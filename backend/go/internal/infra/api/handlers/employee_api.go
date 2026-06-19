package handlers

import (
	"encoding/json"
	"net/http"
	"strconv"
	"time"

	"gym-management/internal/domain/entity"
	"gym-management/internal/domain/usecase/employee_usecase"
	"gym-management/internal/infra/api/dto"
	"gym-management/internal/infra/api/middleware"

	"github.com/gorilla/mux"
)

type EmployeeHandler struct {
	usecase employee_usecase.EmployeeUsecase
}

func NewEmployeeHandler(u employee_usecase.EmployeeUsecase) *EmployeeHandler {
	return &EmployeeHandler{usecase: u}
}

func (h *EmployeeHandler) Create(w http.ResponseWriter, r *http.Request) {
	var employee entity.Employee
	json.NewDecoder(r.Body).Decode(&employee)
	err := h.usecase.CreateEmployee(&employee)
	if err != nil {
		http.Error(w, err.Error(), http.StatusInternalServerError)
		return
	}
	w.Header().Set("Content-Type", "application/json")
	json.NewEncoder(w).Encode(employee)
}

func (h *EmployeeHandler) GetByID(w http.ResponseWriter, r *http.Request) {
	id, _ := strconv.Atoi(mux.Vars(r)["id"])
	employee, err := h.usecase.GetEmployeeByID(id)
	if err != nil {
		http.Error(w, err.Error(), http.StatusNotFound)
		return
	}
	w.Header().Set("Content-Type", "application/json")
	json.NewEncoder(w).Encode(employee)
}

func (h *EmployeeHandler) GetAll(w http.ResponseWriter, r *http.Request) {
	// Check for pagination parameters
	pageStr := r.URL.Query().Get("page")
	limitStr := r.URL.Query().Get("limit")

	if pageStr != "" && limitStr != "" {
		page, err := strconv.Atoi(pageStr)
		if err != nil || page < 1 {
			page = 1
		}
		limit, err := strconv.Atoi(limitStr)
		if err != nil || limit < 1 {
			limit = 6
		}

		employees, total, err := h.usecase.GetAllEmployeesPaginated(page, limit)
		if err != nil {
			http.Error(w, err.Error(), http.StatusInternalServerError)
			return
		}

		totalPages := (total + limit - 1) / limit
		response := dto.PaginationResponse{
			Data:       employees,
			Page:       page,
			Limit:      limit,
			TotalItems: total,
			TotalPages: totalPages,
		}
		w.Header().Set("Content-Type", "application/json")
		json.NewEncoder(w).Encode(response)
		return
	}

	employees, err := h.usecase.GetAllEmployees()
	if err != nil {
		http.Error(w, err.Error(), http.StatusInternalServerError)
		return
	}
	w.Header().Set("Content-Type", "application/json")
	json.NewEncoder(w).Encode(employees)
}

func (h *EmployeeHandler) Update(w http.ResponseWriter, r *http.Request) {
	id, err := strconv.Atoi(mux.Vars(r)["id"])
	if err != nil {
		http.Error(w, "Invalid ID", http.StatusBadRequest)
		return
	}

	existing, err := h.usecase.GetEmployeeByID(id)
	if err != nil {
		http.Error(w, "Employee not found", http.StatusNotFound)
		return
	}

	var req map[string]interface{}
	if err := json.NewDecoder(r.Body).Decode(&req); err != nil {
		http.Error(w, err.Error(), http.StatusBadRequest)
		return
	}

	if val, ok := req["full_name"]; ok {
		existing.FullName = val.(string)
	}
	if val, ok := req["phone"]; ok {
		existing.Phone = val.(string)
	}
	if val, ok := req["position"]; ok {
		existing.Position = val.(string)
	}
	if val, ok := req["salary"]; ok {
		switch v := val.(type) {
		case float64:
			existing.Salary = v
		case int:
			existing.Salary = float64(v)
		}
	}
	if val, ok := req["account_id"]; ok {
		if val == nil {
			existing.AccountID = 0
		} else {
			switch v := val.(type) {
			case float64:
				existing.AccountID = int(v)
			case int:
				existing.AccountID = v
			}
		}
	}
	if val, ok := req["gender"]; ok {
		existing.Gender = val.(string)
	}
	if val, ok := req["dob"]; ok {
		dobStr := val.(string)
		if dobStr != "" {
			t, err := time.Parse("2006-01-02", dobStr[:10])
			if err == nil {
				existing.DOB = t
			}
		}
	}
	if val, ok := req["email"]; ok {
		existing.Email = val.(string)
	}
	if val, ok := req["address"]; ok {
		existing.Address = val.(string)
	}
	if val, ok := req["avatar"]; ok {
		existing.Avatar = val.(string)
	}

	err = h.usecase.UpdateEmployee(existing)
	if err != nil {
		http.Error(w, err.Error(), http.StatusInternalServerError)
		return
	}
	w.WriteHeader(http.StatusOK)
}

func (h *EmployeeHandler) Delete(w http.ResponseWriter, r *http.Request) {
	id, _ := strconv.Atoi(mux.Vars(r)["id"])
	err := h.usecase.DeleteEmployee(id)
	if err != nil {
		http.Error(w, err.Error(), http.StatusInternalServerError)
		return
	}
	w.WriteHeader(http.StatusOK)
}

func (h *EmployeeHandler) GetMe(w http.ResponseWriter, r *http.Request) {
	user, ok := middleware.GetAuthenticatedUser(r)
	if !ok {
		http.Error(w, "unauthorized", http.StatusUnauthorized)
		return
	}
	employee, err := h.usecase.GetEmployeeByAccountID(user.AccountID)
	if err != nil {
		http.Error(w, err.Error(), http.StatusNotFound)
		return
	}
	w.Header().Set("Content-Type", "application/json")
	json.NewEncoder(w).Encode(employee)
}

func (h *EmployeeHandler) UpdateMe(w http.ResponseWriter, r *http.Request) {
	user, ok := middleware.GetAuthenticatedUser(r)
	if !ok {
		http.Error(w, "unauthorized", http.StatusUnauthorized)
		return
	}
	existing, err := h.usecase.GetEmployeeByAccountID(user.AccountID)
	if err != nil {
		http.Error(w, "employee record not found", http.StatusNotFound)
		return
	}
	var req entity.Employee
	if err := json.NewDecoder(r.Body).Decode(&req); err != nil {
		http.Error(w, "invalid request", http.StatusBadRequest)
		return
	}
	// Only allow updating personal fields; preserve privileged fields
	existing.FullName = req.FullName
	existing.Phone = req.Phone
	existing.Email = req.Email
	existing.Gender = req.Gender
	existing.DOB = req.DOB
	existing.Address = req.Address
	if req.Avatar != "" {
		existing.Avatar = req.Avatar
	}
	if err := h.usecase.UpdateEmployee(existing); err != nil {
		http.Error(w, err.Error(), http.StatusInternalServerError)
		return
	}
	w.Header().Set("Content-Type", "application/json")
	json.NewEncoder(w).Encode(existing)
}

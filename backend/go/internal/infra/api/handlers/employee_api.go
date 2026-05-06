package handlers

import (
	"encoding/json"
	"net/http"
	"strconv"

	"gym-management/internal/domain/entity"
	"gym-management/internal/domain/usecase/employee_usecase"
	"gym-management/internal/infra/api/dto"

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
	var employee entity.Employee
	json.NewDecoder(r.Body).Decode(&employee)
	err := h.usecase.UpdateEmployee(&employee)
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

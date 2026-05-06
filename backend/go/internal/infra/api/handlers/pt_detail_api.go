package handlers

import (
	"encoding/json"
	"net/http"
	"strconv"

	"gym-management/internal/domain/entity"
	"gym-management/internal/domain/usecase/pt_detail_usecase"
	"gym-management/internal/infra/api/middleware"

	"github.com/gorilla/mux"
)

type PTDetailHandler struct {
	usecase pt_detail_usecase.PTDetailUsecase
}

func NewPTDetailHandler(u pt_detail_usecase.PTDetailUsecase) *PTDetailHandler {
	return &PTDetailHandler{usecase: u}
}

func (h *PTDetailHandler) Create(w http.ResponseWriter, r *http.Request) {
	var ptDetail entity.PTDetail
	if err := json.NewDecoder(r.Body).Decode(&ptDetail); err != nil {
		http.Error(w, err.Error(), http.StatusBadRequest)
		return
	}

	if err := h.usecase.CreatePTDetail(&ptDetail); err != nil {
		http.Error(w, err.Error(), http.StatusInternalServerError)
		return
	}

	w.Header().Set("Content-Type", "application/json")
	w.WriteHeader(http.StatusCreated)
	json.NewEncoder(w).Encode(ptDetail)
}

func (h *PTDetailHandler) GetMe(w http.ResponseWriter, r *http.Request) {
	user, ok := middleware.GetAuthenticatedUser(r)
	if !ok {
		http.Error(w, "unauthorized", http.StatusUnauthorized)
		return
	}

	ptDetail, err := h.usecase.GetMyPTDetail(user.AccountID)
	if err != nil {
		http.Error(w, err.Error(), http.StatusNotFound)
		return
	}

	w.Header().Set("Content-Type", "application/json")
	json.NewEncoder(w).Encode(ptDetail)
}

func (h *PTDetailHandler) UpdateMe(w http.ResponseWriter, r *http.Request) {
	user, ok := middleware.GetAuthenticatedUser(r)
	if !ok {
		http.Error(w, "unauthorized", http.StatusUnauthorized)
		return
	}

	existing, err := h.usecase.GetMyPTDetail(user.AccountID)
	if err != nil {
		http.Error(w, err.Error(), http.StatusNotFound)
		return
	}

	var updates entity.PTDetail
	if err := json.NewDecoder(r.Body).Decode(&updates); err != nil {
		http.Error(w, err.Error(), http.StatusBadRequest)
		return
	}
	updates.EmployeeID = existing.EmployeeID

	if err := h.usecase.UpdatePTDetail(&updates); err != nil {
		http.Error(w, err.Error(), http.StatusInternalServerError)
		return
	}

	w.Header().Set("Content-Type", "application/json")
	json.NewEncoder(w).Encode(updates)
}

func (h *PTDetailHandler) GetByID(w http.ResponseWriter, r *http.Request) {
	vars := mux.Vars(r)
	employeeID, err := strconv.Atoi(vars["employeeID"])
	if err != nil {
		http.Error(w, "Invalid Employee ID", http.StatusBadRequest)
		return
	}

	ptDetail, err := h.usecase.GetPTDetailByID(employeeID)
	if err != nil {
		http.Error(w, err.Error(), http.StatusNotFound)
		return
	}

	w.Header().Set("Content-Type", "application/json")
	json.NewEncoder(w).Encode(ptDetail)
}

func (h *PTDetailHandler) GetAll(w http.ResponseWriter, r *http.Request) {
	ptDetails, err := h.usecase.GetAllPTDetails()
	if err != nil {
		http.Error(w, err.Error(), http.StatusInternalServerError)
		return
	}

	w.Header().Set("Content-Type", "application/json")
	json.NewEncoder(w).Encode(ptDetails)
}

func (h *PTDetailHandler) Update(w http.ResponseWriter, r *http.Request) {
	vars := mux.Vars(r)
	employeeID, err := strconv.Atoi(vars["employeeID"])
	if err != nil {
		http.Error(w, "Invalid Employee ID", http.StatusBadRequest)
		return
	}

	var ptDetail entity.PTDetail
	if err := json.NewDecoder(r.Body).Decode(&ptDetail); err != nil {
		http.Error(w, err.Error(), http.StatusBadRequest)
		return
	}
	ptDetail.EmployeeID = employeeID

	if err := h.usecase.UpdatePTDetail(&ptDetail); err != nil {
		http.Error(w, err.Error(), http.StatusInternalServerError)
		return
	}

	w.Header().Set("Content-Type", "application/json")
	json.NewEncoder(w).Encode(ptDetail)
}

func (h *PTDetailHandler) Delete(w http.ResponseWriter, r *http.Request) {
	vars := mux.Vars(r)
	employeeID, err := strconv.Atoi(vars["employeeID"])
	if err != nil {
		http.Error(w, "Invalid Employee ID", http.StatusBadRequest)
		return
	}

	if err := h.usecase.DeletePTDetail(employeeID); err != nil {
		http.Error(w, err.Error(), http.StatusInternalServerError)
		return
	}

	w.WriteHeader(http.StatusNoContent)
}

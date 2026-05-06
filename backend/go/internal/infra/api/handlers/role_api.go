package handlers

import (
	"encoding/json"
	"net/http"
	"strconv"

	"gym-management/internal/domain/entity"
	"gym-management/internal/domain/usecase/role_usecase"

	"github.com/gorilla/mux"
)

type RoleHandler struct {
	usecase role_usecase.RoleUsecase
}

func NewRoleHandler(u role_usecase.RoleUsecase) *RoleHandler {
	return &RoleHandler{usecase: u}
}

func (h *RoleHandler) Create(w http.ResponseWriter, r *http.Request) {
	var role entity.Role
	json.NewDecoder(r.Body).Decode(&role)
	err := h.usecase.CreateRole(&role)
	if err != nil {
		http.Error(w, err.Error(), http.StatusInternalServerError)
		return
	}
	w.Header().Set("Content-Type", "application/json")
	json.NewEncoder(w).Encode(role)
}

func (h *RoleHandler) GetByID(w http.ResponseWriter, r *http.Request) {
	id, _ := strconv.Atoi(mux.Vars(r)["id"])
	role, err := h.usecase.GetRoleByID(id)
	if err != nil {
		http.Error(w, err.Error(), http.StatusNotFound)
		return
	}
	w.Header().Set("Content-Type", "application/json")
	json.NewEncoder(w).Encode(role)
}

func (h *RoleHandler) GetAll(w http.ResponseWriter, r *http.Request) {
	roles, err := h.usecase.GetAllRoles()
	if err != nil {
		http.Error(w, err.Error(), http.StatusInternalServerError)
		return
	}
	w.Header().Set("Content-Type", "application/json")
	json.NewEncoder(w).Encode(roles)
}

func (h *RoleHandler) Update(w http.ResponseWriter, r *http.Request) {
	var role entity.Role
	json.NewDecoder(r.Body).Decode(&role)
	err := h.usecase.UpdateRole(&role)
	if err != nil {
		http.Error(w, err.Error(), http.StatusInternalServerError)
		return
	}
	w.WriteHeader(http.StatusOK)
}

func (h *RoleHandler) Delete(w http.ResponseWriter, r *http.Request) {
	id, _ := strconv.Atoi(mux.Vars(r)["id"])
	err := h.usecase.DeleteRole(id)
	if err != nil {
		http.Error(w, err.Error(), http.StatusInternalServerError)
		return
	}
	w.WriteHeader(http.StatusOK)
}

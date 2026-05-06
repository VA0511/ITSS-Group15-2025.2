package handlers

import (
	"encoding/json"
	"net/http"
	"strconv"

	"gym-management/internal/domain/entity"
	"gym-management/internal/domain/usecase/service_category_usecase"

	"github.com/gorilla/mux"
)

type ServiceCategoryHandler struct {
	usecase service_category_usecase.ServiceCategoryUsecase
}

func NewServiceCategoryHandler(u service_category_usecase.ServiceCategoryUsecase) *ServiceCategoryHandler {
	return &ServiceCategoryHandler{usecase: u}
}

func (h *ServiceCategoryHandler) Create(w http.ResponseWriter, r *http.Request) {
	var serviceCategory entity.ServiceCategory
	if err := json.NewDecoder(r.Body).Decode(&serviceCategory); err != nil {
		http.Error(w, err.Error(), http.StatusBadRequest)
		return
	}

	if err := h.usecase.CreateServiceCategory(&serviceCategory); err != nil {
		http.Error(w, err.Error(), http.StatusInternalServerError)
		return
	}

	w.Header().Set("Content-Type", "application/json")
	w.WriteHeader(http.StatusCreated)
	json.NewEncoder(w).Encode(serviceCategory)
}

func (h *ServiceCategoryHandler) GetByID(w http.ResponseWriter, r *http.Request) {
	vars := mux.Vars(r)
	id, err := strconv.Atoi(vars["id"])
	if err != nil {
		http.Error(w, "Invalid ID", http.StatusBadRequest)
		return
	}

	serviceCategory, err := h.usecase.GetServiceCategoryByID(id)
	if err != nil {
		http.Error(w, err.Error(), http.StatusNotFound)
		return
	}

	w.Header().Set("Content-Type", "application/json")
	json.NewEncoder(w).Encode(serviceCategory)
}

func (h *ServiceCategoryHandler) GetAll(w http.ResponseWriter, r *http.Request) {
	serviceCategories, err := h.usecase.GetAllServiceCategories()
	if err != nil {
		http.Error(w, err.Error(), http.StatusInternalServerError)
		return
	}

	w.Header().Set("Content-Type", "application/json")
	json.NewEncoder(w).Encode(serviceCategories)
}

func (h *ServiceCategoryHandler) Update(w http.ResponseWriter, r *http.Request) {
	vars := mux.Vars(r)
	id, err := strconv.Atoi(vars["id"])
	if err != nil {
		http.Error(w, "Invalid ID", http.StatusBadRequest)
		return
	}

	var serviceCategory entity.ServiceCategory
	if err := json.NewDecoder(r.Body).Decode(&serviceCategory); err != nil {
		http.Error(w, err.Error(), http.StatusBadRequest)
		return
	}
	serviceCategory.ID = id

	if err := h.usecase.UpdateServiceCategory(&serviceCategory); err != nil {
		http.Error(w, err.Error(), http.StatusInternalServerError)
		return
	}

	w.Header().Set("Content-Type", "application/json")
	json.NewEncoder(w).Encode(serviceCategory)
}

func (h *ServiceCategoryHandler) Delete(w http.ResponseWriter, r *http.Request) {
	vars := mux.Vars(r)
	id, err := strconv.Atoi(vars["id"])
	if err != nil {
		http.Error(w, "Invalid ID", http.StatusBadRequest)
		return
	}

	if err := h.usecase.DeleteServiceCategory(id); err != nil {
		http.Error(w, err.Error(), http.StatusInternalServerError)
		return
	}

	w.WriteHeader(http.StatusNoContent)
}

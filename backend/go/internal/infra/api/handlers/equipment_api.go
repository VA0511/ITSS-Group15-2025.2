package handlers

import (
	"encoding/json"
	"net/http"
	"strconv"

	"gym-management/internal/domain/entity"
	"gym-management/internal/domain/usecase/equipment_usecase"
	"gym-management/internal/infra/api/dto"

	"github.com/gorilla/mux"
)

type EquipmentHandler struct {
	usecase equipment_usecase.EquipmentUsecase
}

func NewEquipmentHandler(u equipment_usecase.EquipmentUsecase) *EquipmentHandler {
	return &EquipmentHandler{usecase: u}
}

func (h *EquipmentHandler) Create(w http.ResponseWriter, r *http.Request) {
	var equipment entity.Equipment
	json.NewDecoder(r.Body).Decode(&equipment)
	err := h.usecase.CreateEquipment(&equipment)
	if err != nil {
		http.Error(w, err.Error(), http.StatusInternalServerError)
		return
	}
	w.Header().Set("Content-Type", "application/json")
	json.NewEncoder(w).Encode(equipment)
}

func (h *EquipmentHandler) GetByID(w http.ResponseWriter, r *http.Request) {
	id, _ := strconv.Atoi(mux.Vars(r)["id"])
	equipment, err := h.usecase.GetEquipmentByID(id)
	if err != nil {
		http.Error(w, err.Error(), http.StatusNotFound)
		return
	}
	w.Header().Set("Content-Type", "application/json")
	json.NewEncoder(w).Encode(equipment)
}

func (h *EquipmentHandler) GetAll(w http.ResponseWriter, r *http.Request) {
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

		equipments, total, err := h.usecase.GetAllEquipmentsPaginated(page, limit)
		if err != nil {
			http.Error(w, err.Error(), http.StatusInternalServerError)
			return
		}

		totalPages := (total + limit - 1) / limit
		response := dto.PaginationResponse{
			Data:       equipments,
			Page:       page,
			Limit:      limit,
			TotalItems: total,
			TotalPages: totalPages,
		}
		w.Header().Set("Content-Type", "application/json")
		json.NewEncoder(w).Encode(response)
		return
	}

	equipments, err := h.usecase.GetAllEquipments()
	if err != nil {
		http.Error(w, err.Error(), http.StatusInternalServerError)
		return
	}
	w.Header().Set("Content-Type", "application/json")
	json.NewEncoder(w).Encode(equipments)
}

func (h *EquipmentHandler) Update(w http.ResponseWriter, r *http.Request) {
	id, _ := strconv.Atoi(mux.Vars(r)["id"])
	var equipment entity.Equipment
	err := json.NewDecoder(r.Body).Decode(&equipment)
	if err != nil {
		http.Error(w, "Invalid request body", http.StatusBadRequest)
		return
	}
	equipment.ID = id
	err = h.usecase.UpdateEquipment(&equipment)
	if err != nil {
		http.Error(w, err.Error(), http.StatusInternalServerError)
		return
	}
	// Fetch updated equipment with facility_name from JOIN
	updated, err := h.usecase.GetEquipmentByID(id)
	if err != nil {
		http.Error(w, err.Error(), http.StatusInternalServerError)
		return
	}
	w.Header().Set("Content-Type", "application/json")
	w.WriteHeader(http.StatusOK)
	json.NewEncoder(w).Encode(updated)
}

func (h *EquipmentHandler) Delete(w http.ResponseWriter, r *http.Request) {
	id, _ := strconv.Atoi(mux.Vars(r)["id"])
	err := h.usecase.DeleteEquipment(id)
	if err != nil {
		http.Error(w, err.Error(), http.StatusInternalServerError)
		return
	}
	w.WriteHeader(http.StatusOK)
}

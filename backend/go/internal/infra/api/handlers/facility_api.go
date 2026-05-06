package handlers

import (
	"encoding/json"
	"net/http"
	"strconv"

	"gym-management/internal/domain/entity"
	"gym-management/internal/domain/usecase/facility_usecase"
	"gym-management/internal/infra/api/dto"

	"github.com/gorilla/mux"
)

type FacilityHandler struct {
	usecase facility_usecase.FacilityUsecase
}

func NewFacilityHandler(u facility_usecase.FacilityUsecase) *FacilityHandler {
	return &FacilityHandler{usecase: u}
}

func (h *FacilityHandler) Create(w http.ResponseWriter, r *http.Request) {
	var facility entity.Facility
	json.NewDecoder(r.Body).Decode(&facility)
	err := h.usecase.CreateFacility(&facility)
	if err != nil {
		http.Error(w, err.Error(), http.StatusInternalServerError)
		return
	}
	w.Header().Set("Content-Type", "application/json")
	json.NewEncoder(w).Encode(facility)
}

func (h *FacilityHandler) GetByID(w http.ResponseWriter, r *http.Request) {
	id, _ := strconv.Atoi(mux.Vars(r)["id"])
	facility, err := h.usecase.GetFacilityByID(id)
	if err != nil {
		http.Error(w, err.Error(), http.StatusNotFound)
		return
	}
	w.Header().Set("Content-Type", "application/json")
	json.NewEncoder(w).Encode(facility)
}

func (h *FacilityHandler) GetAll(w http.ResponseWriter, r *http.Request) {
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
			limit = 6 // default limit
		}

		facilities, total, err := h.usecase.GetAllFacilitiesPaginated(page, limit)
		if err != nil {
			http.Error(w, err.Error(), http.StatusInternalServerError)
			return
		}

		totalPages := (total + limit - 1) / limit
		response := dto.PaginationResponse{
			Data:       facilities,
			Page:       page,
			Limit:      limit,
			TotalItems: total,
			TotalPages: totalPages,
		}
		w.Header().Set("Content-Type", "application/json")
		json.NewEncoder(w).Encode(response)
		return
	}

	// Return all if no pagination
	facilities, err := h.usecase.GetAllFacilities()
	if err != nil {
		http.Error(w, err.Error(), http.StatusInternalServerError)
		return
	}
	w.Header().Set("Content-Type", "application/json")
	json.NewEncoder(w).Encode(facilities)
}

func (h *FacilityHandler) Update(w http.ResponseWriter, r *http.Request) {
	id, _ := strconv.Atoi(mux.Vars(r)["id"])
	var facility entity.Facility
	json.NewDecoder(r.Body).Decode(&facility)
	facility.ID = id
	err := h.usecase.UpdateFacility(&facility)
	if err != nil {
		http.Error(w, err.Error(), http.StatusInternalServerError)
		return
	}
	w.WriteHeader(http.StatusOK)
}

func (h *FacilityHandler) UpdateStatus(w http.ResponseWriter, r *http.Request) {
	id, _ := strconv.Atoi(mux.Vars(r)["id"])
	var body struct {
		Status string `json:"status"`
	}
	json.NewDecoder(r.Body).Decode(&body)
	err := h.usecase.UpdateFacilityStatus(id, body.Status)
	if err != nil {
		http.Error(w, err.Error(), http.StatusBadRequest)
		return
	}
	w.WriteHeader(http.StatusOK)
}

func (h *FacilityHandler) Delete(w http.ResponseWriter, r *http.Request) {
	id, _ := strconv.Atoi(mux.Vars(r)["id"])
	err := h.usecase.DeleteFacility(id)
	if err != nil {
		http.Error(w, err.Error(), http.StatusInternalServerError)
		return
	}
	w.WriteHeader(http.StatusOK)
}

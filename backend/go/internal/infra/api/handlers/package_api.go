package handlers

import (
	"encoding/json"
	"net/http"
	"strconv"

	"gym-management/internal/domain/entity"
	"gym-management/internal/domain/usecase/package_usecase"
	"gym-management/internal/infra/api/dto"

	"github.com/gorilla/mux"
)

type PackageHandler struct {
	usecase package_usecase.PackageUsecase
}

func NewPackageHandler(u package_usecase.PackageUsecase) *PackageHandler {
	return &PackageHandler{usecase: u}
}

func (h *PackageHandler) Create(w http.ResponseWriter, r *http.Request) {
	var pkg entity.MembershipPackage
	json.NewDecoder(r.Body).Decode(&pkg)
	err := h.usecase.CreatePackage(&pkg)
	if err != nil {
		http.Error(w, err.Error(), http.StatusInternalServerError)
		return
	}
	w.Header().Set("Content-Type", "application/json")
	json.NewEncoder(w).Encode(pkg)
}

func (h *PackageHandler) GetByID(w http.ResponseWriter, r *http.Request) {
	id, _ := strconv.Atoi(mux.Vars(r)["id"])
	pkg, err := h.usecase.GetPackageByID(id)
	if err != nil {
		http.Error(w, err.Error(), http.StatusNotFound)
		return
	}
	w.Header().Set("Content-Type", "application/json")
	json.NewEncoder(w).Encode(pkg)
}

func (h *PackageHandler) GetAll(w http.ResponseWriter, r *http.Request) {
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
			limit = 10
		}

		packages, total, err := h.usecase.GetAllPackagesPaginated(page, limit)
		if err != nil {
			http.Error(w, err.Error(), http.StatusInternalServerError)
			return
		}

		totalPages := (total + limit - 1) / limit
		response := dto.PaginationResponse{
			Data:       packages,
			Page:       page,
			Limit:      limit,
			TotalItems: total,
			TotalPages: totalPages,
		}
		w.Header().Set("Content-Type", "application/json")
		json.NewEncoder(w).Encode(response)
		return
	}

	packages, err := h.usecase.GetAllPackages()
	if err != nil {
		http.Error(w, err.Error(), http.StatusInternalServerError)
		return
	}
	w.Header().Set("Content-Type", "application/json")
	json.NewEncoder(w).Encode(packages)
}

func (h *PackageHandler) Update(w http.ResponseWriter, r *http.Request) {
	id, _ := strconv.Atoi(mux.Vars(r)["id"])
	var pkg entity.MembershipPackage
	err := json.NewDecoder(r.Body).Decode(&pkg)
	if err != nil {
		http.Error(w, "Invalid request body", http.StatusBadRequest)
		return
	}
	pkg.ID = id
	err = h.usecase.UpdatePackage(&pkg)
	if err != nil {
		http.Error(w, err.Error(), http.StatusInternalServerError)
		return
	}
	// Fetch updated package with category_name from JOIN
	updated, err := h.usecase.GetPackageByID(id)
	if err != nil {
		http.Error(w, err.Error(), http.StatusInternalServerError)
		return
	}
	w.Header().Set("Content-Type", "application/json")
	w.WriteHeader(http.StatusOK)
	json.NewEncoder(w).Encode(updated)
}

func (h *PackageHandler) UpdateStatus(w http.ResponseWriter, r *http.Request) {
	id, err := strconv.Atoi(mux.Vars(r)["id"])
	if err != nil || id <= 0 {
		http.Error(w, "invalid package id", http.StatusBadRequest)
		return
	}
	var payload struct {
		IsActive bool `json:"is_active"`
	}
	if err := json.NewDecoder(r.Body).Decode(&payload); err != nil {
		http.Error(w, "invalid request body", http.StatusBadRequest)
		return
	}
	if err := h.usecase.UpdatePackageStatus(id, payload.IsActive); err != nil {
		http.Error(w, err.Error(), http.StatusInternalServerError)
		return
	}
	w.WriteHeader(http.StatusOK)
}

func (h *PackageHandler) Delete(w http.ResponseWriter, r *http.Request) {
	id, _ := strconv.Atoi(mux.Vars(r)["id"])
	err := h.usecase.DeletePackage(id)
	if err != nil {
		http.Error(w, err.Error(), http.StatusInternalServerError)
		return
	}
	w.WriteHeader(http.StatusOK)
}

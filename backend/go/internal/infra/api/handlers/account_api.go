package handlers

import (
	"encoding/json"
	"net/http"
	"strconv"

	"gym-management/internal/domain/usecase/account_usecase"
	"gym-management/internal/infra/api/dto"
	"gym-management/internal/infra/api/mappers"
	"gym-management/internal/infra/api/middleware"

	"github.com/gorilla/mux"
)

type AccountHandler struct {
	usecase account_usecase.AccountUsecase
}

func NewAccountHandler(u account_usecase.AccountUsecase) *AccountHandler {
	return &AccountHandler{usecase: u}
}

func (h *AccountHandler) Create(w http.ResponseWriter, r *http.Request) {
	var req dto.AccountRequest
	if err := json.NewDecoder(r.Body).Decode(&req); err != nil {
		http.Error(w, err.Error(), http.StatusBadRequest)
		return
	}

	account := mappers.AccountRequestToEntity(&req)

	if err := h.usecase.CreateAccount(account); err != nil {
		http.Error(w, err.Error(), http.StatusInternalServerError)
		return
	}

	w.Header().Set("Content-Type", "application/json")
	w.WriteHeader(http.StatusCreated)
	json.NewEncoder(w).Encode(mappers.AccountEntityToResponse(account))
}

func (h *AccountHandler) GetByID(w http.ResponseWriter, r *http.Request) {
	vars := mux.Vars(r)
	id, err := strconv.Atoi(vars["id"])
	if err != nil {
		http.Error(w, "Invalid ID", http.StatusBadRequest)
		return
	}

	account, err := h.usecase.GetAccountByID(id)
	if err != nil {
		http.Error(w, err.Error(), http.StatusNotFound)
		return
	}

	w.Header().Set("Content-Type", "application/json")
	json.NewEncoder(w).Encode(mappers.AccountEntityToResponse(account))
}

func (h *AccountHandler) GetAll(w http.ResponseWriter, r *http.Request) {
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

		accounts, total, err := h.usecase.GetAllAccountsPaginated(page, limit)
		if err != nil {
			http.Error(w, err.Error(), http.StatusInternalServerError)
			return
		}

		// Map to DTO
		responses := make([]*dto.AccountResponse, 0, len(accounts))
		for _, account := range accounts {
			responses = append(responses, mappers.AccountEntityToResponse(account))
		}

		totalPages := (total + limit - 1) / limit
		response := dto.PaginationResponse{
			Data:       responses,
			Page:       page,
			Limit:      limit,
			TotalItems: total,
			TotalPages: totalPages,
		}
		w.Header().Set("Content-Type", "application/json")
		json.NewEncoder(w).Encode(response)
		return
	}

	accounts, err := h.usecase.GetAllAccounts()
	if err != nil {
		http.Error(w, err.Error(), http.StatusInternalServerError)
		return
	}

	w.Header().Set("Content-Type", "application/json")

	responses := make([]*dto.AccountResponse, 0, len(accounts))
	for _, account := range accounts {
		responses = append(responses, mappers.AccountEntityToResponse(account))
	}

	json.NewEncoder(w).Encode(responses)
}

func (h *AccountHandler) Update(w http.ResponseWriter, r *http.Request) {
	vars := mux.Vars(r)
	id, err := strconv.Atoi(vars["id"])
	if err != nil {
		http.Error(w, "Invalid ID", http.StatusBadRequest)
		return
	}

	var req dto.AccountRequest
	if err := json.NewDecoder(r.Body).Decode(&req); err != nil {
		http.Error(w, err.Error(), http.StatusBadRequest)
		return
	}

	account := mappers.AccountRequestToEntity(&req)
	account.ID = id

	if err := h.usecase.UpdateAccount(account); err != nil {
		http.Error(w, err.Error(), http.StatusInternalServerError)
		return
	}

	w.Header().Set("Content-Type", "application/json")
	json.NewEncoder(w).Encode(mappers.AccountEntityToResponse(account))
}

func (h *AccountHandler) RevealPassword(w http.ResponseWriter, r *http.Request) {
	targetID, err := strconv.Atoi(mux.Vars(r)["id"])
	if err != nil {
		http.Error(w, "Invalid ID", http.StatusBadRequest)
		return
	}
	user, ok := middleware.GetAuthenticatedUser(r)
	if !ok {
		http.Error(w, "Unauthorized", http.StatusUnauthorized)
		return
	}
	var body struct {
		OwnerPassword string `json:"owner_password"`
	}
	if err := json.NewDecoder(r.Body).Decode(&body); err != nil {
		http.Error(w, err.Error(), http.StatusBadRequest)
		return
	}
	password, err := h.usecase.RevealAccountPassword(user.AccountID, body.OwnerPassword, targetID)
	if err != nil {
		http.Error(w, err.Error(), http.StatusUnauthorized)
		return
	}
	w.Header().Set("Content-Type", "application/json")
	json.NewEncoder(w).Encode(map[string]string{"password": password})
}

func (h *AccountHandler) Delete(w http.ResponseWriter, r *http.Request) {
	vars := mux.Vars(r)
	id, err := strconv.Atoi(vars["id"])
	if err != nil {
		http.Error(w, "Invalid ID", http.StatusBadRequest)
		return
	}

	if err := h.usecase.DeleteAccount(id); err != nil {
		http.Error(w, err.Error(), http.StatusInternalServerError)
		return
	}

	w.WriteHeader(http.StatusNoContent)
}

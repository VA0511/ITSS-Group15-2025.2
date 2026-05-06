package handlers

import (
	"encoding/json"
	"net/http"
	"strconv"

	"gym-management/internal/domain/entity"
	"gym-management/internal/domain/usecase/member_usecase"
	"gym-management/internal/domain/usecase/subscription_usecase"
	"gym-management/internal/infra/api/middleware"

	"github.com/gorilla/mux"
)

type SubscriptionHandler struct {
	usecase       subscription_usecase.SubscriptionUsecase
	memberUsecase member_usecase.MemberUsecase
}

func NewSubscriptionHandler(u subscription_usecase.SubscriptionUsecase, mu member_usecase.MemberUsecase) *SubscriptionHandler {
	return &SubscriptionHandler{usecase: u, memberUsecase: mu}
}

func (h *SubscriptionHandler) Create(w http.ResponseWriter, r *http.Request) {
	var subscription entity.Subscription
	if err := json.NewDecoder(r.Body).Decode(&subscription); err != nil {
		http.Error(w, err.Error(), http.StatusBadRequest)
		return
	}

	// Security check for Member: Force MemberID to current user's member ID
	currentUser, ok := middleware.GetAuthenticatedUser(r)
	if ok && currentUser.Role == "MEMBER" {
		member, err := h.memberUsecase.GetMemberByAccountID(currentUser.AccountID)
		if err != nil {
			// Auto create a default member profile for demo purposes if not found
			newMember := &entity.Member{
				AccountID: currentUser.AccountID,
				FullName:  "Hội viên (Demo)",
				Gender:    "Khác",
				Phone:     "0000000000",
			}
			err = h.memberUsecase.CreateMember(newMember)
			if err != nil {
				http.Error(w, "member not found and auto-create failed", http.StatusInternalServerError)
				return
			}
			member = newMember
		}
		subscription.MemberID = member.ID
	}

	if err := h.usecase.CreateSubscription(&subscription); err != nil {
		http.Error(w, err.Error(), http.StatusInternalServerError)
		return
	}

	w.Header().Set("Content-Type", "application/json")
	w.WriteHeader(http.StatusCreated)
	json.NewEncoder(w).Encode(subscription)
}

func (h *SubscriptionHandler) GetByID(w http.ResponseWriter, r *http.Request) {
	vars := mux.Vars(r)
	id, err := strconv.Atoi(vars["id"])
	if err != nil {
		http.Error(w, "Invalid ID", http.StatusBadRequest)
		return
	}

	subscription, err := h.usecase.GetSubscriptionByID(id)
	if err != nil {
		http.Error(w, err.Error(), http.StatusNotFound)
		return
	}

	w.Header().Set("Content-Type", "application/json")
	json.NewEncoder(w).Encode(subscription)
}

func (h *SubscriptionHandler) GetAll(w http.ResponseWriter, r *http.Request) {
	subscriptions, err := h.usecase.GetAllSubscriptions()
	if err != nil {
		http.Error(w, err.Error(), http.StatusInternalServerError)
		return
	}

	w.Header().Set("Content-Type", "application/json")
	json.NewEncoder(w).Encode(subscriptions)
}

func (h *SubscriptionHandler) Update(w http.ResponseWriter, r *http.Request) {
	vars := mux.Vars(r)
	id, err := strconv.Atoi(vars["id"])
	if err != nil {
		http.Error(w, "Invalid ID", http.StatusBadRequest)
		return
	}

	var subscription entity.Subscription
	if err := json.NewDecoder(r.Body).Decode(&subscription); err != nil {
		http.Error(w, err.Error(), http.StatusBadRequest)
		return
	}
	subscription.ID = id

	if err := h.usecase.UpdateSubscription(&subscription); err != nil {
		http.Error(w, err.Error(), http.StatusInternalServerError)
		return
	}

	w.Header().Set("Content-Type", "application/json")
	json.NewEncoder(w).Encode(subscription)
}

func (h *SubscriptionHandler) GetMySubscriptions(w http.ResponseWriter, r *http.Request) {
	currentUser, ok := middleware.GetAuthenticatedUser(r)
	if !ok {
		http.Error(w, "unauthorized", http.StatusUnauthorized)
		return
	}

	member, err := h.memberUsecase.GetMemberByAccountID(currentUser.AccountID)
	if err != nil {
		http.Error(w, "member not found", http.StatusInternalServerError)
		return
	}

	pageStr := r.URL.Query().Get("page")
	limitStr := r.URL.Query().Get("limit")

	page := 1
	limit := 10 // Default to 10 for "me" view

	if pageStr != "" {
		if p, err := strconv.Atoi(pageStr); err == nil && p > 0 {
			page = p
		}
	}
	if limitStr != "" {
		if l, err := strconv.Atoi(limitStr); err == nil && l > 0 {
			limit = l
		}
	}

	histories, total, err := h.usecase.GetSubscriptionHistoryByMemberID(member.ID, page, limit)
	if err != nil {
		http.Error(w, err.Error(), http.StatusInternalServerError)
		return
	}

	response := map[string]interface{}{
		"data":       histories,
		"page":       page,
		"limit":      limit,
		"total":      total,
		"totalPages": (total + limit - 1) / limit,
	}

	w.Header().Set("Content-Type", "application/json")
	json.NewEncoder(w).Encode(response)
}

func (h *SubscriptionHandler) GetHistoryByMemberID(w http.ResponseWriter, r *http.Request) {
	vars := mux.Vars(r)
	memberID, err := strconv.Atoi(vars["memberId"])
	if err != nil {
		http.Error(w, "Invalid Member ID", http.StatusBadRequest)
		return
	}

	// Security check: Member can only see their own subscriptions
	currentUser, ok := middleware.GetAuthenticatedUser(r)
	if ok && currentUser.Role == "MEMBER" {
		member, err := h.memberUsecase.GetMemberByAccountID(currentUser.AccountID)
		if err != nil || member.ID != memberID {
			http.Error(w, "forbidden: cannot view other member's subscriptions", http.StatusForbidden)
			return
		}
	}

	pageStr := r.URL.Query().Get("page")
	limitStr := r.URL.Query().Get("limit")

	page := 1
	limit := 5 // Default to 5 records per page

	if pageStr != "" {
		if p, err := strconv.Atoi(pageStr); err == nil && p > 0 {
			page = p
		}
	}
	if limitStr != "" {
		if l, err := strconv.Atoi(limitStr); err == nil && l > 0 {
			limit = l
		}
	}

	histories, total, err := h.usecase.GetSubscriptionHistoryByMemberID(memberID, page, limit)
	if err != nil {
		http.Error(w, err.Error(), http.StatusInternalServerError)
		return
	}

	response := map[string]interface{}{
		"data":       histories,
		"page":       page,
		"limit":      limit,
		"total":      total,
		"totalPages": (total + limit - 1) / limit,
	}

	w.Header().Set("Content-Type", "application/json")
	json.NewEncoder(w).Encode(response)
}
func (h *SubscriptionHandler) Delete(w http.ResponseWriter, r *http.Request) {
	vars := mux.Vars(r)

	id, err := strconv.Atoi(vars["id"])
	if err != nil {
		http.Error(w, "Invalid ID", http.StatusBadRequest)
		return
	}

	err = h.usecase.DeleteSubscription(id)
	if err != nil {
		http.Error(w, err.Error(), http.StatusInternalServerError)
		return
	}

	w.WriteHeader(http.StatusNoContent)
}

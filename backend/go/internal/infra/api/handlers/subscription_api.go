package handlers

import (
	"encoding/json"
	"net/http"
	"strconv"
	"time"

	"gym-management/internal/domain/entity"
	"gym-management/internal/domain/usecase/invoice_usecase"
	"gym-management/internal/domain/usecase/member_usecase"
	"gym-management/internal/domain/usecase/package_usecase"
	"gym-management/internal/domain/usecase/subscription_usecase"
	"gym-management/internal/infra/api/middleware"

	"github.com/gorilla/mux"
)

type SubscriptionHandler struct {
	usecase        subscription_usecase.SubscriptionUsecase
	memberUsecase  member_usecase.MemberUsecase
	packageUsecase package_usecase.PackageUsecase
	invoiceUsecase invoice_usecase.InvoiceUsecase
}

func NewSubscriptionHandler(u subscription_usecase.SubscriptionUsecase, mu member_usecase.MemberUsecase, pu package_usecase.PackageUsecase, iu invoice_usecase.InvoiceUsecase) *SubscriptionHandler {
	return &SubscriptionHandler{usecase: u, memberUsecase: mu, packageUsecase: pu, invoiceUsecase: iu}
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

	// Validate the requested package exists
	newPkg, err := h.packageUsecase.GetPackageByID(subscription.PackageID)
	if err != nil || newPkg == nil {
		http.Error(w, "invalid package", http.StatusBadRequest)
		return
	}

	// Basic gym categories (VIP=1, Normal=2, Female-only=3): only 1 active at a time across ALL basic categories
	// Specialty categories (4+): only 1 active per same category
	basicCategoryIDs := []int{1, 2, 3}
	isBasic := false
	for _, id := range basicCategoryIDs {
		if newPkg.CategoryID == id {
			isBasic = true
			break
		}
	}

	if isBasic {
		for _, catID := range basicCategoryIDs {
			existing, err := h.usecase.GetActiveSubscriptionByMemberIDAndCategoryID(subscription.MemberID, catID)
			if err != nil {
				http.Error(w, "failed to check active subscription", http.StatusInternalServerError)
				return
			}
			if existing != nil {
				http.Error(w, "already_have_active_basic_subscription", http.StatusConflict)
				return
			}
		}
	} else {
		activeSub, err := h.usecase.GetActiveSubscriptionByMemberIDAndCategoryID(subscription.MemberID, newPkg.CategoryID)
		if err != nil {
			http.Error(w, "failed to check active subscription", http.StatusInternalServerError)
			return
		}
		if activeSub != nil {
			http.Error(w, "already_have_active_subscription_in_this_category", http.StatusConflict)
			return
		}
	}

	if err := h.usecase.CreateSubscription(&subscription); err != nil {
		http.Error(w, err.Error(), http.StatusInternalServerError)
		return
	}

	invoice := &entity.Invoice{
		MemberID:       subscription.MemberID,
		SubscriptionID: subscription.ID,
		TotalAmount:    newPkg.Price,
		PaymentStatus:  "Paid",
		PaymentMethod:  "VNPay",
		Notes:          "Đăng ký mới - " + newPkg.PackageName,
	}
	h.invoiceUsecase.CreateInvoice(invoice)

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
func (h *SubscriptionHandler) Upgrade(w http.ResponseWriter, r *http.Request) {
	vars := mux.Vars(r)
	id, err := strconv.Atoi(vars["id"])
	if err != nil {
		http.Error(w, "Invalid ID", http.StatusBadRequest)
		return
	}

	var body struct {
		NewPackageID int       `json:"new_package_id"`
		NewEndDate   time.Time `json:"new_end_date"`
	}
	if err := json.NewDecoder(r.Body).Decode(&body); err != nil {
		http.Error(w, err.Error(), http.StatusBadRequest)
		return
	}

	// Validate new package exists and is VIP (category_id = 1)
	newPkg, err := h.packageUsecase.GetPackageByID(body.NewPackageID)
	if err != nil || newPkg == nil {
		http.Error(w, "invalid package", http.StatusBadRequest)
		return
	}
	if newPkg.CategoryID != 1 {
		http.Error(w, "can_only_upgrade_to_vip", http.StatusBadRequest)
		return
	}

	// Security: MEMBER can only upgrade their own subscription
	currentUser, ok := middleware.GetAuthenticatedUser(r)
	if ok && currentUser.Role == "MEMBER" {
		member, err := h.memberUsecase.GetMemberByAccountID(currentUser.AccountID)
		if err != nil {
			http.Error(w, "member not found", http.StatusInternalServerError)
			return
		}
		sub, err := h.usecase.GetSubscriptionByID(id)
		if err != nil {
			http.Error(w, "subscription not found", http.StatusNotFound)
			return
		}
		if sub.MemberID != member.ID {
			http.Error(w, "forbidden", http.StatusForbidden)
			return
		}
	}

	if err := h.usecase.UpgradeSubscription(id, body.NewPackageID, body.NewEndDate); err != nil {
		http.Error(w, err.Error(), http.StatusInternalServerError)
		return
	}

	w.Header().Set("Content-Type", "application/json")
	json.NewEncoder(w).Encode(map[string]string{"message": "subscription upgraded successfully"})
}

func (h *SubscriptionHandler) Renew(w http.ResponseWriter, r *http.Request) {
	vars := mux.Vars(r)
	id, err := strconv.Atoi(vars["id"])
	if err != nil {
		http.Error(w, "Invalid ID", http.StatusBadRequest)
		return
	}

	var body struct {
		NewEndDate   time.Time `json:"new_end_date"`
		RenewalPrice float64   `json:"renewal_price"`
	}
	if err := json.NewDecoder(r.Body).Decode(&body); err != nil {
		http.Error(w, err.Error(), http.StatusBadRequest)
		return
	}

	sub, err := h.usecase.GetSubscriptionByID(id)
	if err != nil {
		http.Error(w, "subscription not found", http.StatusNotFound)
		return
	}

	// Security: MEMBER can only renew their own subscription
	currentUser, ok := middleware.GetAuthenticatedUser(r)
	if ok && currentUser.Role == "MEMBER" {
		member, err := h.memberUsecase.GetMemberByAccountID(currentUser.AccountID)
		if err != nil {
			http.Error(w, "member not found", http.StatusInternalServerError)
			return
		}
		if sub.MemberID != member.ID {
			http.Error(w, "forbidden", http.StatusForbidden)
			return
		}
	}

	if err := h.usecase.RenewSubscription(id, body.NewEndDate); err != nil {
		http.Error(w, err.Error(), http.StatusInternalServerError)
		return
	}

	// Fetch package name to include in invoice
	pkgName := "Gói tập"
	if sub != nil {
		pkg, err := h.packageUsecase.GetPackageByID(sub.PackageID)
		if err == nil && pkg != nil {
			pkgName = pkg.PackageName
		}
	}

	invoice := &entity.Invoice{
		MemberID:       sub.MemberID,
		SubscriptionID: id,
		TotalAmount:    body.RenewalPrice,
		PaymentStatus:  "Paid",
		PaymentMethod:  "VNPay",
		Notes:          "Gia hạn - " + pkgName,
	}
	h.invoiceUsecase.CreateInvoice(invoice)

	w.Header().Set("Content-Type", "application/json")
	json.NewEncoder(w).Encode(map[string]string{"message": "subscription renewed successfully"})
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

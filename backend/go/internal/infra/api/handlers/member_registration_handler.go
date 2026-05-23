package handlers

import (
	"crypto/rand"
	"encoding/json"
	"fmt"
	"log"
	"net/http"
	"strings"
	"time"

	"gym-management/internal/domain/adapter"
	"gym-management/internal/domain/entity"
	"gym-management/internal/domain/usecase/invoice_usecase"
	"gym-management/internal/domain/usecase/member_usecase"
	"gym-management/internal/domain/usecase/package_usecase"
	"gym-management/internal/domain/usecase/subscription_usecase"
	"gym-management/internal/infra/email"
)

type MemberRegistrationHandler struct {
	authRepo  adapter.AuthRepository
	memberUC  member_usecase.MemberUsecase
	subUC     subscription_usecase.SubscriptionUsecase
	packageUC package_usecase.PackageUsecase
	invoiceUC invoice_usecase.InvoiceUsecase
	emailSvc  *email.Service
}

func NewMemberRegistrationHandler(
	authRepo adapter.AuthRepository,
	memberUC member_usecase.MemberUsecase,
	subUC subscription_usecase.SubscriptionUsecase,
	packageUC package_usecase.PackageUsecase,
	emailSvc *email.Service,
	invoiceUC invoice_usecase.InvoiceUsecase,
) *MemberRegistrationHandler {
	return &MemberRegistrationHandler{
		authRepo:  authRepo,
		memberUC:  memberUC,
		subUC:     subUC,
		packageUC: packageUC,
		invoiceUC: invoiceUC,
		emailSvc:  emailSvc,
	}
}

type createMemberWithAccountRequest struct {
	FullName  string    `json:"full_name"`
	Phone     string    `json:"phone"`
	Email     string    `json:"email"`
	Gender    string    `json:"gender"`
	DOB       time.Time `json:"dob"`
	Address   string    `json:"address"`
	PackageID int       `json:"package_id"`
}

type createMemberWithAccountResponse struct {
	AccountID      int    `json:"account_id"`
	MemberID       int    `json:"member_id"`
	SubscriptionID int    `json:"subscription_id,omitempty"`
	Username       string `json:"username"`
	EmailSent      bool   `json:"email_sent"`
}

func (h *MemberRegistrationHandler) CreateMemberWithAccount(w http.ResponseWriter, r *http.Request) {
	var req createMemberWithAccountRequest
	if err := json.NewDecoder(r.Body).Decode(&req); err != nil {
		http.Error(w, "invalid request body", http.StatusBadRequest)
		return
	}

	req.Email = strings.TrimSpace(req.Email)
	req.FullName = strings.TrimSpace(req.FullName)
	if req.Email == "" || req.FullName == "" {
		http.Error(w, "full_name and email are required", http.StatusBadRequest)
		return
	}

	ctx := r.Context()

	memberRoleID, err := h.authRepo.GetRoleIDByName(ctx, "MEMBER")
	if err != nil {
		http.Error(w, "failed to get member role: "+err.Error(), http.StatusInternalServerError)
		return
	}

	tempPassword := generatePassword(10)

	account := &entity.Account{
		Username:     req.Email,
		Password:     tempPassword,
		RoleID:       memberRoleID,
		Email:        req.Email,
		IsFirstLogin: true,
	}
	if err := h.authRepo.CreateAccount(ctx, account); err != nil {
		http.Error(w, "failed to create account: "+err.Error(), http.StatusInternalServerError)
		return
	}

	member := &entity.Member{
		FullName:  req.FullName,
		Phone:     req.Phone,
		Email:     req.Email,
		Gender:    req.Gender,
		DOB:       req.DOB,
		Address:   req.Address,
		AccountID: account.ID,
		IsActive:  true,
	}
	if err := h.memberUC.CreateMember(member); err != nil {
		http.Error(w, "failed to create member: "+err.Error(), http.StatusInternalServerError)
		return
	}

	resp := createMemberWithAccountResponse{
		AccountID: account.ID,
		MemberID:  member.ID,
		Username:  account.Username,
	}

	if req.PackageID > 0 {
		pkg, err := h.packageUC.GetPackageByID(req.PackageID)
		if err != nil {
			http.Error(w, "package not found: "+err.Error(), http.StatusBadRequest)
			return
		}

		now := time.Now()
		sub := &entity.Subscription{
			MemberID:         member.ID,
			PackageID:        req.PackageID,
			RegistrationDate: now,
			StartDate:        now,
			EndDate:          now.AddDate(0, 0, pkg.DurationDays),
			Status:           "active",
		}
		if err := h.subUC.CreateSubscription(sub); err != nil {
			http.Error(w, "failed to create subscription: "+err.Error(), http.StatusInternalServerError)
			return
		}
		resp.SubscriptionID = sub.ID

		invoice := &entity.Invoice{
			MemberID:       member.ID,
			SubscriptionID: sub.ID,
			TotalAmount:    pkg.Price,
			PaymentStatus:  "Paid",
			PaymentMethod:  "Cash",
			Notes:          "Đăng ký mới - " + pkg.PackageName,
		}
		if err := h.invoiceUC.CreateInvoice(invoice); err != nil {
			log.Printf("Warning: failed to create invoice for subscription %d: %v", sub.ID, err)
		}
	}

	emailErr := h.emailSvc.SendNewMemberCredentials(req.Email, req.FullName, account.Username, tempPassword)
	resp.EmailSent = emailErr == nil

	w.Header().Set("Content-Type", "application/json")
	w.WriteHeader(http.StatusCreated)
	json.NewEncoder(w).Encode(resp)
}

func generatePassword(length int) string {
	const chars = "abcdefghijkmnpqrstuvwxyzABCDEFGHJKLMNPQRSTUVWXYZ23456789"
	buf := make([]byte, length)
	rand.Read(buf)
	for i, b := range buf {
		buf[i] = chars[int(b)%len(chars)]
	}
	return fmt.Sprintf("%s", buf)
}

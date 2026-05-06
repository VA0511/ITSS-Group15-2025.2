package handlers

import (
	"encoding/json"
	"errors"
	"net/http"
	"strings"

	"gym-management/internal/domain/usecase/auth_usecase"
	"gym-management/internal/infra/api/dto"
	"gym-management/internal/infra/api/middleware"
)

type AuthHandler struct {
	usecase auth_usecase.AuthUsecase
}

func NewAuthHandler(u auth_usecase.AuthUsecase) *AuthHandler {
	return &AuthHandler{usecase: u}
}

func (h *AuthHandler) Login(w http.ResponseWriter, r *http.Request) {
	var req dto.LoginRequest
	if err := json.NewDecoder(r.Body).Decode(&req); err != nil {
		http.Error(w, err.Error(), http.StatusBadRequest)
		return
	}

	result, err := h.usecase.Login(r.Context(), auth_usecase.LoginInput{
		Username: pickUsername(req.Username, req.Email),
		Password: req.Password,
	})
	if err != nil {
		writeAuthError(w, err)
		return
	}

	w.Header().Set("Content-Type", "application/json")
	w.WriteHeader(http.StatusOK)
	json.NewEncoder(w).Encode(toAuthResponse(result))
}

func (h *AuthHandler) Refresh(w http.ResponseWriter, r *http.Request) {
	var req dto.RefreshRequest
	if err := json.NewDecoder(r.Body).Decode(&req); err != nil {
		http.Error(w, err.Error(), http.StatusBadRequest)
		return
	}

	result, err := h.usecase.Refresh(r.Context(), auth_usecase.RefreshInput{RefreshToken: req.RefreshToken})
	if err != nil {
		writeAuthError(w, err)
		return
	}

	w.Header().Set("Content-Type", "application/json")
	w.WriteHeader(http.StatusOK)
	json.NewEncoder(w).Encode(toAuthResponse(result))
}

func (h *AuthHandler) Logout(w http.ResponseWriter, r *http.Request) {
	var req dto.LogoutRequest
	if err := json.NewDecoder(r.Body).Decode(&req); err != nil {
		http.Error(w, err.Error(), http.StatusBadRequest)
		return
	}

	logoutInput := auth_usecase.LogoutInput{RefreshToken: req.RefreshToken}
	if user, ok := middleware.GetAuthenticatedUser(r); ok {
		logoutInput.AccountID = user.AccountID
	}

	err := h.usecase.Logout(r.Context(), logoutInput)
	if err != nil {
		writeAuthError(w, err)
		return
	}

	w.WriteHeader(http.StatusNoContent)
}

func (h *AuthHandler) Me(w http.ResponseWriter, r *http.Request) {
	user, ok := middleware.GetAuthenticatedUser(r)
	if !ok {
		http.Error(w, auth_usecase.ErrUnauthorized.Error(), http.StatusUnauthorized)
		return
	}

	w.Header().Set("Content-Type", "application/json")
	json.NewEncoder(w).Encode(map[string]*dto.AuthUserResponse{
		"user": {
			ID:       user.AccountID,
			Email:    user.Username,
			Username: user.Username,
			Role:     mapRoleForClient(user.Role),
		},
	})
}

func toAuthResponse(result *auth_usecase.AuthResult) *dto.AuthResponse {
	if result == nil {
		return nil
	}

	clientRole := mapRoleForClient(result.Role)

	return &dto.AuthResponse{
		AccountID:     result.AccountID,
		Username:      result.Username,
		Role:          clientRole,
		AccessToken:   result.AccessToken,
		RefreshToken:  result.RefreshToken,
		TokenType:     result.TokenType,
		ExpiresInSecs: result.ExpiresInSecs,
		User: &dto.AuthUserResponse{
			ID:       result.AccountID,
			Email:    result.Username,
			Username: result.Username,
			Role:     clientRole,
		},
		Token: result.AccessToken,
	}
}

func pickUsername(username, email string) string {
	if strings.TrimSpace(username) != "" {
		return username
	}
	return strings.TrimSpace(email)
}

func mapRoleForClient(role string) string {
	switch strings.ToUpper(strings.TrimSpace(role)) {
	case "OWNER":
		return "owner"
	case "MANAGER":
		return "manager"
	case "PT", "TRAINER":
		return "trainer"
	case "MEMBER":
		return "member"
	default:
		return strings.ToLower(strings.TrimSpace(role))
	}
}

func writeAuthError(w http.ResponseWriter, err error) {
	statusCode := http.StatusInternalServerError
	message := err.Error()

	switch {
	case errors.Is(err, auth_usecase.ErrInvalidInput):
		statusCode = http.StatusBadRequest
	case errors.Is(err, auth_usecase.ErrConflict):
		statusCode = http.StatusConflict
	case errors.Is(err, auth_usecase.ErrInvalidCredentials), errors.Is(err, auth_usecase.ErrUnauthorized):
		statusCode = http.StatusUnauthorized
	case errors.Is(err, auth_usecase.ErrForbidden):
		statusCode = http.StatusForbidden
	}

	http.Error(w, message, statusCode)
}

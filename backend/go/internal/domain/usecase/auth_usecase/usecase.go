package auth_usecase

import (
	"context"
	"errors"
	"os"
	"strconv"
	"time"

	"gym-management/internal/domain/adapter"
)

var (
	ErrInvalidInput       = errors.New("invalid input")
	ErrInvalidCredentials = errors.New("invalid credentials")
	ErrUnauthorized       = errors.New("unauthorized")
	ErrForbidden          = errors.New("forbidden")
	ErrConflict           = errors.New("resource already exists")
)

type LoginInput struct {
	Username string
	Password string
}

type RefreshInput struct {
	RefreshToken string
}

type LogoutInput struct {
	RefreshToken string
	AccountID    int
}

type AuthResult struct {
	AccountID     int
	Username      string
	Role          string
	AccessToken   string
	RefreshToken  string
	TokenType     string
	ExpiresInSecs int64
}

type AuthUsecase interface {
	Login(ctx context.Context, input LoginInput) (*AuthResult, error)
	Refresh(ctx context.Context, input RefreshInput) (*AuthResult, error)
	Logout(ctx context.Context, input LogoutInput) error
}

type authUsecase struct {
	repo       adapter.AuthRepository
	jwtSecret  []byte
	accessTTL  time.Duration
	refreshTTL time.Duration
}

func NewAuthUsecase(repo adapter.AuthRepository) AuthUsecase {
	return &authUsecase{
		repo:       repo,
		jwtSecret:  []byte(getEnv("JWT_SECRET", "dev-only-secret-change-me")),
		accessTTL:  time.Duration(getEnvInt("JWT_ACCESS_TTL_MINUTES", 15)) * time.Minute,
		refreshTTL: time.Duration(getEnvInt("JWT_REFRESH_TTL_HOURS", 24*7)) * time.Hour,
	}
}

func getEnv(key, defaultValue string) string {
	value := os.Getenv(key)
	if value == "" {
		return defaultValue
	}
	return value
}

func getEnvInt(key string, defaultValue int) int {
	value := os.Getenv(key)
	if value == "" {
		return defaultValue
	}

	parsed, err := strconv.Atoi(value)
	if err != nil {
		return defaultValue
	}

	return parsed
}

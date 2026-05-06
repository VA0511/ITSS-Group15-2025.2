package adapter

import (
	"context"
	"time"

	"gym-management/internal/domain/entity"
)

type RefreshTokenRecord struct {
	TokenHash string
	AccountID int
	ExpiresAt time.Time
	RevokedAt *time.Time
}

type AuthRepository interface {
	CreateAccount(ctx context.Context, account *entity.Account) error
	FindAccountByUsername(ctx context.Context, username string) (*entity.Account, error)
	GetRoleNameByID(ctx context.Context, roleID int) (string, error)
	GetRoleIDByName(ctx context.Context, roleName string) (int, error)
	SaveRefreshToken(ctx context.Context, record *RefreshTokenRecord) error
	GetRefreshToken(ctx context.Context, tokenHash string) (*RefreshTokenRecord, error)
	RevokeRefreshToken(ctx context.Context, tokenHash string) error
	RotateRefreshToken(ctx context.Context, oldTokenHash string, newRecord *RefreshTokenRecord) error
	RevokeAllRefreshTokensByAccountID(ctx context.Context, accountID int) error
}

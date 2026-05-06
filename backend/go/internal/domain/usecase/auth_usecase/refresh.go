package auth_usecase

import (
	"context"
	"database/sql"
	"errors"
	"time"

	"gym-management/internal/domain/adapter"
)

func (u *authUsecase) Refresh(ctx context.Context, input RefreshInput) (*AuthResult, error) {
	claims, err := u.parseRefreshToken(input.RefreshToken)
	if err != nil {
		return nil, err
	}

	refreshHash, err := hashRefreshToken(input.RefreshToken)
	if err != nil {
		return nil, ErrUnauthorized
	}

	record, err := u.repo.GetRefreshToken(ctx, refreshHash)
	if err != nil {
		if errors.Is(err, sql.ErrNoRows) {
			return nil, ErrUnauthorized
		}
		return nil, err
	}
	if record.AccountID != claims.AccountID {
		return nil, ErrUnauthorized
	}
	if record.RevokedAt != nil {
		return nil, ErrUnauthorized
	}
	if time.Now().UTC().After(record.ExpiresAt) {
		return nil, ErrUnauthorized
	}

	account, err := u.repo.FindAccountByUsername(ctx, claims.Username)
	if err != nil {
		if errors.Is(err, sql.ErrNoRows) {
			return nil, ErrUnauthorized
		}
		return nil, err
	}
	if account.ID != claims.AccountID {
		return nil, ErrUnauthorized
	}

	roleName, err := u.repo.GetRoleNameByID(ctx, account.RoleID)
	if err != nil {
		return nil, err
	}

	authResult, refreshExpiry, err := u.generateAuthTokens(account.ID, account.Username, roleName)
	if err != nil {
		return nil, err
	}

	newRefreshHash, err := hashRefreshToken(authResult.RefreshToken)
	if err != nil {
		return nil, err
	}

	if err := u.repo.RotateRefreshToken(ctx, refreshHash, &adapter.RefreshTokenRecord{
		TokenHash: newRefreshHash,
		AccountID: account.ID,
		ExpiresAt: refreshExpiry,
	}); err != nil {
		return nil, err
	}

	return authResult, nil
}

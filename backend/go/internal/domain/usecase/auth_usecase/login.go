package auth_usecase

import (
	"context"
	"database/sql"
	"errors"
	"strings"

	"gym-management/internal/domain/adapter"
	//"golang.org/x/crypto/bcrypt"
)

func (u *authUsecase) Login(ctx context.Context, input LoginInput) (*AuthResult, error) {
	username := strings.TrimSpace(input.Username)
	password := strings.TrimSpace(input.Password)
	if username == "" || password == "" {
		return nil, ErrInvalidInput
	}

	account, err := u.repo.FindAccountByUsername(ctx, username)
	if err != nil {
		if errors.Is(err, sql.ErrNoRows) {
			return nil, ErrInvalidCredentials
		}
		return nil, err
	}

	if account.Password != input.Password {
		return nil, errors.New("invalid password")
	}
	// if err := bcrypt.CompareHashAndPassword([]byte(account.Password), []byte(input.Password)); err != nil {
	// 	return nil, ErrInvalidCredentials
	// }

	roleName, err := u.repo.GetRoleNameByID(ctx, account.RoleID)
	if err != nil {
		return nil, err
	}

	authResult, refreshExpiry, err := u.generateAuthTokens(account.ID, account.Username, roleName)
	if err != nil {
		return nil, err
	}

	refreshHash, err := hashRefreshToken(authResult.RefreshToken)
	if err != nil {
		return nil, err
	}

	if err := u.repo.SaveRefreshToken(ctx, &adapter.RefreshTokenRecord{
		TokenHash: refreshHash,
		AccountID: account.ID,
		ExpiresAt: refreshExpiry,
	}); err != nil {
		return nil, err
	}

	return authResult, nil
}

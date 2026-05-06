package auth_usecase

import (
	"context"
	"database/sql"
	"errors"
	"strings"
)

func (u *authUsecase) Logout(ctx context.Context, input LogoutInput) error {
	if strings.TrimSpace(input.RefreshToken) == "" {
		return ErrInvalidInput
	}

	refreshHash, err := hashRefreshToken(input.RefreshToken)
	if err != nil {
		return ErrInvalidInput
	}

	if input.AccountID > 0 {
		record, err := u.repo.GetRefreshToken(ctx, refreshHash)
		if err != nil {
			if errors.Is(err, sql.ErrNoRows) {
				return ErrUnauthorized
			}
			return err
		}
		if record.AccountID != input.AccountID {
			return ErrForbidden
		}
	}

	if err := u.repo.RevokeRefreshToken(ctx, refreshHash); err != nil {
		return err
	}

	return nil
}

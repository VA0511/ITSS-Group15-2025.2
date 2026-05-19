package auth_usecase

import (
	"context"
	"errors"
)

func (u *authUsecase) ChangePassword(ctx context.Context, input ChangePasswordInput) error {
	if input.AccountID <= 0 {
		return ErrInvalidInput
	}
	if input.OldPassword == "" || input.NewPassword == "" {
		return ErrInvalidInput
	}
	if len(input.NewPassword) < 6 {
		return errors.New("new password must be at least 6 characters")
	}

	account, err := u.repo.GetAccountByID(ctx, input.AccountID)
	if err != nil {
		return ErrUnauthorized
	}

	if account.Password != input.OldPassword {
		return errors.New("old password is incorrect")
	}

	return u.repo.UpdatePassword(ctx, input.AccountID, input.NewPassword, false)
}

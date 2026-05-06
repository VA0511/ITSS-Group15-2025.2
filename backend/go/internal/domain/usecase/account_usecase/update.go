package account_usecase

import (
	"context"
	"errors"
	"gym-management/internal/domain/adapter"
	"gym-management/internal/domain/entity"
)

type IUpdateAccountUseCase interface {
	Execute(ctx context.Context, account *entity.Account) (*entity.Account, error)
}

type UpdateAccountUseCase struct {
	repo adapter.AccountRepository
}

func NewUpdateAccountUseCase(repo adapter.AccountRepository) IUpdateAccountUseCase {
	return &UpdateAccountUseCase{repo: repo}
}

func (u *UpdateAccountUseCase) Execute(ctx context.Context, account *entity.Account) (*entity.Account, error) {
	if account == nil {
		return nil, errors.New("account cannot be nil")
	}
	if account.ID <= 0 {
		return nil, errors.New("invalid id")
	}

	existing, err := u.repo.GetByID(account.ID)
	if err != nil {
		return nil, err
	}

	if account.Username == "" {
		account.Username = existing.Username
	}
	if account.RoleID <= 0 {
		account.RoleID = existing.RoleID
	}
	if account.Password == "" {
		account.Password = existing.Password
	} else if len(account.Password) < 6 {
		return nil, errors.New("password must be at least 6 characters")
	}

	if err := u.repo.Update(account); err != nil {
		return nil, err
	}
	return account, nil
}

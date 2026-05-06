package account_usecase

import (
	"context"
	"errors"
	"gym-management/internal/domain/adapter"
	"gym-management/internal/domain/entity"
)

type ICreateAccountUseCase interface {
	Execute(ctx context.Context, account *entity.Account) (*entity.Account, error)
}

type CreateAccountUseCase struct {
	repo adapter.AccountRepository
}

func NewCreateAccountUseCase(repo adapter.AccountRepository) ICreateAccountUseCase {
	return &CreateAccountUseCase{repo: repo}
}

func (u *CreateAccountUseCase) Execute(ctx context.Context, account *entity.Account) (*entity.Account, error) {
	if account.Username == "" {
		return nil, errors.New("username cannot be empty")
	}
	if len(account.Password) < 6 {
		return nil, errors.New("password must be at least 6 characters")
	}
	err := u.repo.Create(account)
	return account, err
}

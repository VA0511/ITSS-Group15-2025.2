package account_usecase

import (
	"context"
	"errors"
	"gym-management/internal/domain/adapter"
	"gym-management/internal/domain/entity"
)

type IGetAccountUseCase interface {
	Execute(ctx context.Context, id int) (*entity.Account, error)
}

type GetAccountUseCase struct {
	repo adapter.AccountRepository
}

func NewGetAccountUseCase(repo adapter.AccountRepository) IGetAccountUseCase {
	return &GetAccountUseCase{repo: repo}
}

func (u *GetAccountUseCase) Execute(ctx context.Context, id int) (*entity.Account, error) {
	if id <= 0 {
		return nil, errors.New("invalid id")
	}
	return u.repo.GetByID(id)
}

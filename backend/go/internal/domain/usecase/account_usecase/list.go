package account_usecase

import (
	"context"
	"gym-management/internal/domain/adapter"
	"gym-management/internal/domain/entity"
)

type IListAccountsUseCase interface {
	Execute(ctx context.Context) ([]*entity.Account, error)
}

type IListAccountsPaginatedUseCase interface {
	Execute(ctx context.Context, page, limit int) ([]*entity.Account, int, error)
}

type ListAccountsUseCase struct {
	repo adapter.AccountRepository
}

func NewListAccountsUseCase(repo adapter.AccountRepository) IListAccountsUseCase {
	return &ListAccountsUseCase{repo: repo}
}

func (u *ListAccountsUseCase) Execute(ctx context.Context) ([]*entity.Account, error) {
	return u.repo.GetAll()
}

type ListAccountsPaginatedUseCase struct {
	repo adapter.AccountRepository
}

func NewListAccountsPaginatedUseCase(repo adapter.AccountRepository) IListAccountsPaginatedUseCase {
	return &ListAccountsPaginatedUseCase{repo: repo}
}

func (u *ListAccountsPaginatedUseCase) Execute(ctx context.Context, page, limit int) ([]*entity.Account, int, error) {
	return u.repo.GetAllPaginated(page, limit)
}

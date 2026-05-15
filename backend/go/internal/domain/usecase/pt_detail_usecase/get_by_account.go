package pt_detail_usecase

import (
	"context"
	"errors"
	"gym-management/internal/domain/adapter"
	"gym-management/internal/domain/entity"
)

type IGetPTDetailByAccountIDUseCase interface {
	Execute(ctx context.Context, accountID int) (*entity.PTDetail, error)
}

type GetPTDetailByAccountIDUseCase struct {
	repo adapter.PTDetailRepository
}

func NewGetPTDetailByAccountIDUseCase(repo adapter.PTDetailRepository) IGetPTDetailByAccountIDUseCase {
	return &GetPTDetailByAccountIDUseCase{repo: repo}
}

func (u *GetPTDetailByAccountIDUseCase) Execute(ctx context.Context, accountID int) (*entity.PTDetail, error) {
	if accountID <= 0 {
		return nil, errors.New("invalid accountID")
	}
	return u.repo.GetByAccountID(accountID)
}

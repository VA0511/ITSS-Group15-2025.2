package pt_detail_usecase

import (
	"context"
	"errors"
	"gym-management/internal/domain/adapter"
	"gym-management/internal/domain/entity"
)

type IGetPTDetailUseCase interface {
	Execute(ctx context.Context, employeeID int) (*entity.PTDetail, error)
}

type GetPTDetailUseCase struct {
	repo adapter.PTDetailRepository
}

func NewGetPTDetailUseCase(repo adapter.PTDetailRepository) IGetPTDetailUseCase {
	return &GetPTDetailUseCase{repo: repo}
}

func (u *GetPTDetailUseCase) Execute(ctx context.Context, employeeID int) (*entity.PTDetail, error) {
	if employeeID <= 0 {
		return nil, errors.New("invalid employeeID")
	}
	return u.repo.GetByID(employeeID)
}

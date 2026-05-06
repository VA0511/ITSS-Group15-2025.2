package pt_detail_usecase

import (
	"context"
	"errors"
	"gym-management/internal/domain/adapter"
	"gym-management/internal/domain/entity"
)

type IUpdatePTDetailUseCase interface {
	Execute(ctx context.Context, pTDetail *entity.PTDetail) (*entity.PTDetail, error)
}

type UpdatePTDetailUseCase struct {
	repo adapter.PTDetailRepository
}

func NewUpdatePTDetailUseCase(repo adapter.PTDetailRepository) IUpdatePTDetailUseCase {
	return &UpdatePTDetailUseCase{repo: repo}
}

func (u *UpdatePTDetailUseCase) Execute(ctx context.Context, pTDetail *entity.PTDetail) (*entity.PTDetail, error) {
	if pTDetail.EmployeeID <= 0 {
		return nil, errors.New("invalid employeeID")
	}
	if err := u.repo.Update(pTDetail); err != nil {
		return nil, err
	}
	return pTDetail, nil
}

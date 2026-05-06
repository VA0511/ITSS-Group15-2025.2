package pt_detail_usecase

import (
	"context"
	"errors"
	"gym-management/internal/domain/adapter"
)

type IDeletePTDetailUseCase interface {
	Execute(ctx context.Context, employeeID int) error
}

type DeletePTDetailUseCase struct {
	repo adapter.PTDetailRepository
}

func NewDeletePTDetailUseCase(repo adapter.PTDetailRepository) IDeletePTDetailUseCase {
	return &DeletePTDetailUseCase{repo: repo}
}

func (u *DeletePTDetailUseCase) Execute(ctx context.Context, employeeID int) error {
	if employeeID <= 0 {
		return errors.New("invalid employeeID")
	}
	return u.repo.Delete(employeeID)
}

package pt_detail_usecase

import (
	"context"
	"gym-management/internal/domain/adapter"
	"gym-management/internal/domain/entity"
)

type ICreatePTDetailUseCase interface {
	Execute(ctx context.Context, pTDetail *entity.PTDetail) (*entity.PTDetail, error)
}

type CreatePTDetailUseCase struct {
	repo adapter.PTDetailRepository
}

func NewCreatePTDetailUseCase(repo adapter.PTDetailRepository) ICreatePTDetailUseCase {
	return &CreatePTDetailUseCase{repo: repo}
}

func (u *CreatePTDetailUseCase) Execute(ctx context.Context, pTDetail *entity.PTDetail) (*entity.PTDetail, error) {

	err := u.repo.Create(pTDetail)
	return pTDetail, err
}

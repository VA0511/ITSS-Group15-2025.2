package pt_detail_usecase

import (
	"context"
	"gym-management/internal/domain/adapter"
	"gym-management/internal/domain/entity"
)

type IListPTDetailsUseCase interface {
	Execute(ctx context.Context) ([]*entity.PTDetail, error)
}

type ListPTDetailsUseCase struct {
	repo adapter.PTDetailRepository
}

func NewListPTDetailsUseCase(repo adapter.PTDetailRepository) IListPTDetailsUseCase {
	return &ListPTDetailsUseCase{repo: repo}
}

func (u *ListPTDetailsUseCase) Execute(ctx context.Context) ([]*entity.PTDetail, error) {
	return u.repo.GetAll()
}

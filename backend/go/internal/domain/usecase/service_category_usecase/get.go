package service_category_usecase

import (
	"context"
	"errors"
	"gym-management/internal/domain/adapter"
	"gym-management/internal/domain/entity"
)

type IGetServiceCategoryUseCase interface {
	Execute(ctx context.Context, id int) (*entity.ServiceCategory, error)
}

type GetServiceCategoryUseCase struct {
	repo adapter.ServiceCategoryRepository
}

func NewGetServiceCategoryUseCase(repo adapter.ServiceCategoryRepository) IGetServiceCategoryUseCase {
	return &GetServiceCategoryUseCase{repo: repo}
}

func (u *GetServiceCategoryUseCase) Execute(ctx context.Context, id int) (*entity.ServiceCategory, error) {
	if id <= 0 {
		return nil, errors.New("invalid id")
	}
	return u.repo.GetByID(id)
}

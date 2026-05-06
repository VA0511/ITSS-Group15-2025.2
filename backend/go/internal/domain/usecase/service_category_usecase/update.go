package service_category_usecase

import (
	"context"
	"errors"
	"gym-management/internal/domain/adapter"
	"gym-management/internal/domain/entity"
)

type IUpdateServiceCategoryUseCase interface {
	Execute(ctx context.Context, serviceCategory *entity.ServiceCategory) (*entity.ServiceCategory, error)
}

type UpdateServiceCategoryUseCase struct {
	repo adapter.ServiceCategoryRepository
}

func NewUpdateServiceCategoryUseCase(repo adapter.ServiceCategoryRepository) IUpdateServiceCategoryUseCase {
	return &UpdateServiceCategoryUseCase{repo: repo}
}

func (u *UpdateServiceCategoryUseCase) Execute(ctx context.Context, serviceCategory *entity.ServiceCategory) (*entity.ServiceCategory, error) {
	if serviceCategory.ID <= 0 {
		return nil, errors.New("invalid id")
	}
	if err := u.repo.Update(serviceCategory); err != nil {
		return nil, err
	}
	return serviceCategory, nil
}

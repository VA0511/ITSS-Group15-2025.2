package service_category_usecase

import (
	"context"
	"gym-management/internal/domain/adapter"
	"gym-management/internal/domain/entity"
)

type ICreateServiceCategoryUseCase interface {
	Execute(ctx context.Context, serviceCategory *entity.ServiceCategory) (*entity.ServiceCategory, error)
}

type CreateServiceCategoryUseCase struct {
	repo adapter.ServiceCategoryRepository
}

func NewCreateServiceCategoryUseCase(repo adapter.ServiceCategoryRepository) ICreateServiceCategoryUseCase {
	return &CreateServiceCategoryUseCase{repo: repo}
}

func (u *CreateServiceCategoryUseCase) Execute(ctx context.Context, serviceCategory *entity.ServiceCategory) (*entity.ServiceCategory, error) {

	err := u.repo.Create(serviceCategory)
	return serviceCategory, err
}

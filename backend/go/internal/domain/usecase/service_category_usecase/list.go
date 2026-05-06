package service_category_usecase

import (
	"context"
	"gym-management/internal/domain/adapter"
	"gym-management/internal/domain/entity"
)

type IListServiceCategoriesUseCase interface {
	Execute(ctx context.Context) ([]*entity.ServiceCategory, error)
}

type ListServiceCategoriesUseCase struct {
	repo adapter.ServiceCategoryRepository
}

func NewListServiceCategoriesUseCase(repo adapter.ServiceCategoryRepository) IListServiceCategoriesUseCase {
	return &ListServiceCategoriesUseCase{repo: repo}
}

func (u *ListServiceCategoriesUseCase) Execute(ctx context.Context) ([]*entity.ServiceCategory, error) {
	return u.repo.GetAll()
}

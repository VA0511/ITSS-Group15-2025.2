package service_category_usecase

import (
	"context"
	"errors"
	"gym-management/internal/domain/adapter"
)

type IDeleteServiceCategoryUseCase interface {
	Execute(ctx context.Context, id int) error
}

type DeleteServiceCategoryUseCase struct {
	repo adapter.ServiceCategoryRepository
}

func NewDeleteServiceCategoryUseCase(repo adapter.ServiceCategoryRepository) IDeleteServiceCategoryUseCase {
	return &DeleteServiceCategoryUseCase{repo: repo}
}

func (u *DeleteServiceCategoryUseCase) Execute(ctx context.Context, id int) error {
	if id <= 0 {
		return errors.New("invalid id")
	}
	return u.repo.Delete(id)
}

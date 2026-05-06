package package_usecase

import (
	"context"
	"errors"
	"gym-management/internal/domain/adapter"
)

type IUpdatePackageStatusUseCase interface {
	Execute(ctx context.Context, id int, isActive bool) error
}

type UpdatePackageStatusUseCase struct {
	repo adapter.MembershipPackageRepository
}

func NewUpdatePackageStatusUseCase(repo adapter.MembershipPackageRepository) IUpdatePackageStatusUseCase {
	return &UpdatePackageStatusUseCase{repo: repo}
}

func (u *UpdatePackageStatusUseCase) Execute(ctx context.Context, id int, isActive bool) error {
	if id <= 0 {
		return errors.New("invalid id")
	}
	return u.repo.UpdateStatus(id, isActive)
}
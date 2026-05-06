package package_usecase

import (
	"context"
	"errors"
	"gym-management/internal/domain/adapter"
)

type IDeletePackageUseCase interface {
	Execute(ctx context.Context, id int) error
}

type DeletePackageUseCase struct {
	repo adapter.MembershipPackageRepository
}

func NewDeletePackageUseCase(repo adapter.MembershipPackageRepository) IDeletePackageUseCase {
	return &DeletePackageUseCase{repo: repo}
}

func (u *DeletePackageUseCase) Execute(ctx context.Context, id int) error {
	if id <= 0 {
		return errors.New("invalid id")
	}
	return u.repo.Delete(id)
}

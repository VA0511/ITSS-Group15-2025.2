package package_usecase

import (
	"context"
	"errors"
	"gym-management/internal/domain/adapter"
	"gym-management/internal/domain/entity"
)

type IGetPackageUseCase interface {
	Execute(ctx context.Context, id int) (*entity.MembershipPackage, error)
}

type GetPackageUseCase struct {
	repo adapter.MembershipPackageRepository
}

func NewGetPackageUseCase(repo adapter.MembershipPackageRepository) IGetPackageUseCase {
	return &GetPackageUseCase{repo: repo}
}

func (u *GetPackageUseCase) Execute(ctx context.Context, id int) (*entity.MembershipPackage, error) {
	if id <= 0 {
		return nil, errors.New("invalid id")
	}
	return u.repo.GetByID(id)
}

package package_usecase

import (
	"context"
	"errors"
	"gym-management/internal/domain/adapter"
	"gym-management/internal/domain/entity"
)

type IUpdatePackageUseCase interface {
	Execute(ctx context.Context, membershipPackage *entity.MembershipPackage) (*entity.MembershipPackage, error)
}

type UpdatePackageUseCase struct {
	repo adapter.MembershipPackageRepository
}

func NewUpdatePackageUseCase(repo adapter.MembershipPackageRepository) IUpdatePackageUseCase {
	return &UpdatePackageUseCase{repo: repo}
}

func (u *UpdatePackageUseCase) Execute(ctx context.Context, membershipPackage *entity.MembershipPackage) (*entity.MembershipPackage, error) {
	if membershipPackage.ID <= 0 {
		return nil, errors.New("invalid id")
	}
	if err := u.repo.Update(membershipPackage); err != nil {
		return nil, err
	}
	return membershipPackage, nil
}

package package_usecase

import (
	"context"
	"gym-management/internal/domain/adapter"
	"gym-management/internal/domain/entity"
)

type ICreatePackageUseCase interface {
	Execute(ctx context.Context, membershipPackage *entity.MembershipPackage) (*entity.MembershipPackage, error)
}

type CreatePackageUseCase struct {
	repo adapter.MembershipPackageRepository
}

func NewCreatePackageUseCase(repo adapter.MembershipPackageRepository) ICreatePackageUseCase {
	return &CreatePackageUseCase{repo: repo}
}

func (u *CreatePackageUseCase) Execute(ctx context.Context, membershipPackage *entity.MembershipPackage) (*entity.MembershipPackage, error) {

	err := u.repo.Create(membershipPackage)
	return membershipPackage, err
}

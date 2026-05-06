package package_usecase

import (
	"context"
	"gym-management/internal/domain/adapter"
	"gym-management/internal/domain/entity"
)

type IListPackagesUseCase interface {
	Execute(ctx context.Context) ([]*entity.MembershipPackage, error)
}

type IListPackagesPaginatedUseCase interface {
	Execute(ctx context.Context, page, limit int) ([]*entity.MembershipPackage, int, error)
}

type ListPackagesUseCase struct {
	repo adapter.MembershipPackageRepository
}

func NewListPackagesUseCase(repo adapter.MembershipPackageRepository) IListPackagesUseCase {
	return &ListPackagesUseCase{repo: repo}
}

func (u *ListPackagesUseCase) Execute(ctx context.Context) ([]*entity.MembershipPackage, error) {
	return u.repo.GetAll()
}

type ListPackagesPaginatedUseCase struct {
	repo adapter.MembershipPackageRepository
}

func NewListPackagesPaginatedUseCase(repo adapter.MembershipPackageRepository) IListPackagesPaginatedUseCase {
	return &ListPackagesPaginatedUseCase{repo: repo}
}

func (u *ListPackagesPaginatedUseCase) Execute(ctx context.Context, page, limit int) ([]*entity.MembershipPackage, int, error) {
	return u.repo.GetAllPaginated(page, limit)
}

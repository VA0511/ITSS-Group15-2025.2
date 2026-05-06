package role_usecase

import (
	"context"
	"gym-management/internal/domain/adapter"
	"gym-management/internal/domain/entity"
)

type IListRolesUseCase interface {
	Execute(ctx context.Context) ([]*entity.Role, error)
}

type ListRolesUseCase struct {
	repo adapter.RoleRepository
}

func NewListRolesUseCase(repo adapter.RoleRepository) IListRolesUseCase {
	return &ListRolesUseCase{repo: repo}
}

func (u *ListRolesUseCase) Execute(ctx context.Context) ([]*entity.Role, error) {
	return u.repo.GetAll()
}

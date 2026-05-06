package role_usecase

import (
	"context"
	"gym-management/internal/domain/adapter"
	"gym-management/internal/domain/entity"
)

type ICreateRoleUseCase interface {
	Execute(ctx context.Context, role *entity.Role) (*entity.Role, error)
}

type CreateRoleUseCase struct {
	repo adapter.RoleRepository
}

func NewCreateRoleUseCase(repo adapter.RoleRepository) ICreateRoleUseCase {
	return &CreateRoleUseCase{repo: repo}
}

func (u *CreateRoleUseCase) Execute(ctx context.Context, role *entity.Role) (*entity.Role, error) {

	err := u.repo.Create(role)
	return role, err
}

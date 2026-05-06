package role_usecase

import (
	"context"
	"errors"
	"gym-management/internal/domain/adapter"
	"gym-management/internal/domain/entity"
)

type IUpdateRoleUseCase interface {
	Execute(ctx context.Context, role *entity.Role) (*entity.Role, error)
}

type UpdateRoleUseCase struct {
	repo adapter.RoleRepository
}

func NewUpdateRoleUseCase(repo adapter.RoleRepository) IUpdateRoleUseCase {
	return &UpdateRoleUseCase{repo: repo}
}

func (u *UpdateRoleUseCase) Execute(ctx context.Context, role *entity.Role) (*entity.Role, error) {
	if role.ID <= 0 {
		return nil, errors.New("invalid id")
	}
	if err := u.repo.Update(role); err != nil {
		return nil, err
	}
	return role, nil
}

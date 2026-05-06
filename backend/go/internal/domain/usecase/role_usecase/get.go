package role_usecase

import (
	"context"
	"errors"
	"gym-management/internal/domain/adapter"
	"gym-management/internal/domain/entity"
)

type IGetRoleUseCase interface {
	Execute(ctx context.Context, id int) (*entity.Role, error)
}

type GetRoleUseCase struct {
	repo adapter.RoleRepository
}

func NewGetRoleUseCase(repo adapter.RoleRepository) IGetRoleUseCase {
	return &GetRoleUseCase{repo: repo}
}

func (u *GetRoleUseCase) Execute(ctx context.Context, id int) (*entity.Role, error) {
	if id <= 0 {
		return nil, errors.New("invalid id")
	}
	return u.repo.GetByID(id)
}

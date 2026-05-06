package role_usecase

import (
	"context"
	"errors"
	"gym-management/internal/domain/adapter"
)

type IDeleteRoleUseCase interface {
	Execute(ctx context.Context, id int) error
}

type DeleteRoleUseCase struct {
	repo adapter.RoleRepository
}

func NewDeleteRoleUseCase(repo adapter.RoleRepository) IDeleteRoleUseCase {
	return &DeleteRoleUseCase{repo: repo}
}

func (u *DeleteRoleUseCase) Execute(ctx context.Context, id int) error {
	if id <= 0 {
		return errors.New("invalid id")
	}
	return u.repo.Delete(id)
}

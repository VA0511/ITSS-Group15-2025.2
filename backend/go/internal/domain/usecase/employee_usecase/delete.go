package employee_usecase

import (
	"context"
	"errors"
	"gym-management/internal/domain/adapter"
)

type IDeleteEmployeeUseCase interface {
	Execute(ctx context.Context, id int) error
}

type DeleteEmployeeUseCase struct {
	repo adapter.EmployeeRepository
}

func NewDeleteEmployeeUseCase(repo adapter.EmployeeRepository) IDeleteEmployeeUseCase {
	return &DeleteEmployeeUseCase{repo: repo}
}

func (u *DeleteEmployeeUseCase) Execute(ctx context.Context, id int) error {
	if id <= 0 {
		return errors.New("invalid id")
	}
	return u.repo.Delete(id)
}

package employee_usecase

import (
	"context"
	"errors"
	"gym-management/internal/domain/adapter"
	"gym-management/internal/domain/entity"
)

type IGetEmployeeUseCase interface {
	Execute(ctx context.Context, id int) (*entity.Employee, error)
}

type GetEmployeeUseCase struct {
	repo adapter.EmployeeRepository
}

func NewGetEmployeeUseCase(repo adapter.EmployeeRepository) IGetEmployeeUseCase {
	return &GetEmployeeUseCase{repo: repo}
}

func (u *GetEmployeeUseCase) Execute(ctx context.Context, id int) (*entity.Employee, error) {
	if id <= 0 {
		return nil, errors.New("invalid id")
	}
	return u.repo.GetByID(id)
}

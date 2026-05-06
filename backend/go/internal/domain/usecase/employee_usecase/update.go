package employee_usecase

import (
	"context"
	"errors"
	"gym-management/internal/domain/adapter"
	"gym-management/internal/domain/entity"
)

type IUpdateEmployeeUseCase interface {
	Execute(ctx context.Context, employee *entity.Employee) (*entity.Employee, error)
}

type UpdateEmployeeUseCase struct {
	repo adapter.EmployeeRepository
}

func NewUpdateEmployeeUseCase(repo adapter.EmployeeRepository) IUpdateEmployeeUseCase {
	return &UpdateEmployeeUseCase{repo: repo}
}

func (u *UpdateEmployeeUseCase) Execute(ctx context.Context, employee *entity.Employee) (*entity.Employee, error) {
	if employee.ID <= 0 {
		return nil, errors.New("invalid id")
	}
	if err := u.repo.Update(employee); err != nil {
		return nil, err
	}
	return employee, nil
}

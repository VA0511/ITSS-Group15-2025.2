package employee_usecase

import (
	"context"
	"gym-management/internal/domain/adapter"
	"gym-management/internal/domain/entity"
)

type ICreateEmployeeUseCase interface {
	Execute(ctx context.Context, employee *entity.Employee) (*entity.Employee, error)
}

type CreateEmployeeUseCase struct {
	repo adapter.EmployeeRepository
}

func NewCreateEmployeeUseCase(repo adapter.EmployeeRepository) ICreateEmployeeUseCase {
	return &CreateEmployeeUseCase{repo: repo}
}

func (u *CreateEmployeeUseCase) Execute(ctx context.Context, employee *entity.Employee) (*entity.Employee, error) {

	err := u.repo.Create(employee)
	return employee, err
}

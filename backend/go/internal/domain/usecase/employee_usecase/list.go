package employee_usecase

import (
	"context"
	"gym-management/internal/domain/adapter"
	"gym-management/internal/domain/entity"
)

type IListEmployeesUseCase interface {
	Execute(ctx context.Context) ([]*entity.Employee, error)
}

type IListEmployeesPaginatedUseCase interface {
	Execute(ctx context.Context, page, limit int) ([]*entity.Employee, int, error)
}

type ListEmployeesUseCase struct {
	repo adapter.EmployeeRepository
}

func NewListEmployeesUseCase(repo adapter.EmployeeRepository) IListEmployeesUseCase {
	return &ListEmployeesUseCase{repo: repo}
}

func (u *ListEmployeesUseCase) Execute(ctx context.Context) ([]*entity.Employee, error) {
	return u.repo.GetAll()
}

type ListEmployeesPaginatedUseCase struct {
	repo adapter.EmployeeRepository
}

func NewListEmployeesPaginatedUseCase(repo adapter.EmployeeRepository) IListEmployeesPaginatedUseCase {
	return &ListEmployeesPaginatedUseCase{repo: repo}
}

func (u *ListEmployeesPaginatedUseCase) Execute(ctx context.Context, page, limit int) ([]*entity.Employee, int, error) {
	return u.repo.GetAllPaginated(page, limit)
}

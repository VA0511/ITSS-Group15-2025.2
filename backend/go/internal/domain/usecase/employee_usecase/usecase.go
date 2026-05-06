package employee_usecase

import (
	"context"
	"gym-management/internal/domain/adapter"
	"gym-management/internal/domain/entity"
)

type EmployeeUsecase interface {
	CreateEmployee(employee *entity.Employee) error
	GetEmployeeByID(id int) (*entity.Employee, error)
	GetEmployeeByAccountID(accountID int) (*entity.Employee, error)
	GetAllEmployees() ([]*entity.Employee, error)
	GetAllEmployeesPaginated(page, limit int) ([]*entity.Employee, int, error)
	UpdateEmployee(employee *entity.Employee) error
	DeleteEmployee(id int) error
}

type employeeUsecase struct {
	repo          adapter.EmployeeRepository
	create        ICreateEmployeeUseCase
	get           IGetEmployeeUseCase
	list          IListEmployeesUseCase
	listPaginated IListEmployeesPaginatedUseCase
	update        IUpdateEmployeeUseCase
	delete        IDeleteEmployeeUseCase
}

func NewEmployeeUsecase(repo adapter.EmployeeRepository) EmployeeUsecase {
	return &employeeUsecase{
		repo:          repo,
		create:        NewCreateEmployeeUseCase(repo),
		get:           NewGetEmployeeUseCase(repo),
		list:          NewListEmployeesUseCase(repo),
		listPaginated: NewListEmployeesPaginatedUseCase(repo),
		update:        NewUpdateEmployeeUseCase(repo),
		delete:        NewDeleteEmployeeUseCase(repo),
	}
}

func (u *employeeUsecase) CreateEmployee(employee *entity.Employee) error {
	created, err := u.create.Execute(context.Background(), employee)
	if err != nil {
		return err
	}
	*employee = *created
	return nil
}

func (u *employeeUsecase) GetEmployeeByID(id int) (*entity.Employee, error) {
	return u.get.Execute(context.Background(), id)
}

func (u *employeeUsecase) GetEmployeeByAccountID(accountID int) (*entity.Employee, error) {
	return u.repo.GetByAccountID(accountID)
}

func (u *employeeUsecase) GetAllEmployees() ([]*entity.Employee, error) {
	return u.list.Execute(context.Background())
}

func (u *employeeUsecase) GetAllEmployeesPaginated(page, limit int) ([]*entity.Employee, int, error) {
	return u.listPaginated.Execute(context.Background(), page, limit)
}

func (u *employeeUsecase) UpdateEmployee(employee *entity.Employee) error {
	updated, err := u.update.Execute(context.Background(), employee)
	if err != nil {
		return err
	}
	*employee = *updated
	return nil
}

func (u *employeeUsecase) DeleteEmployee(id int) error {
	return u.delete.Execute(context.Background(), id)
}

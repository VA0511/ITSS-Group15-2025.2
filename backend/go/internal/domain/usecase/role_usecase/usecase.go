package role_usecase

import (
	"context"
	"gym-management/internal/domain/adapter"
	"gym-management/internal/domain/entity"
)

type RoleUsecase interface {
	CreateRole(role *entity.Role) error
	GetRoleByID(id int) (*entity.Role, error)
	GetAllRoles() ([]*entity.Role, error)
	UpdateRole(role *entity.Role) error
	DeleteRole(id int) error
}

type roleUsecase struct {
	create ICreateRoleUseCase
	get    IGetRoleUseCase
	list   IListRolesUseCase
	update IUpdateRoleUseCase
	delete IDeleteRoleUseCase
}

func NewRoleUsecase(repo adapter.RoleRepository) RoleUsecase {
	return &roleUsecase{
		create: NewCreateRoleUseCase(repo),
		get:    NewGetRoleUseCase(repo),
		list:   NewListRolesUseCase(repo),
		update: NewUpdateRoleUseCase(repo),
		delete: NewDeleteRoleUseCase(repo),
	}
}

func (u *roleUsecase) CreateRole(role *entity.Role) error {
	created, err := u.create.Execute(context.Background(), role)
	if err != nil {
		return err
	}
	*role = *created
	return nil
}

func (u *roleUsecase) GetRoleByID(id int) (*entity.Role, error) {
	return u.get.Execute(context.Background(), id)
}

func (u *roleUsecase) GetAllRoles() ([]*entity.Role, error) {
	return u.list.Execute(context.Background())
}

func (u *roleUsecase) UpdateRole(role *entity.Role) error {
	updated, err := u.update.Execute(context.Background(), role)
	if err != nil {
		return err
	}
	*role = *updated
	return nil
}

func (u *roleUsecase) DeleteRole(id int) error {
	return u.delete.Execute(context.Background(), id)
}

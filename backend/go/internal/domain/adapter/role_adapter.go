package adapter

import "gym-management/internal/domain/entity"

type RoleRepository interface {
	Create(role *entity.Role) error
	GetByID(id int) (*entity.Role, error)
	GetAll() ([]*entity.Role, error)
	Update(role *entity.Role) error
	Delete(id int) error
}

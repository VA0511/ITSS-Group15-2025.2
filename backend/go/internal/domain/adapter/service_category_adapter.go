package adapter

import "gym-management/internal/domain/entity"

type ServiceCategoryRepository interface {
	Create(sc *entity.ServiceCategory) error
	GetByID(id int) (*entity.ServiceCategory, error)
	GetAll() ([]*entity.ServiceCategory, error)
	Update(sc *entity.ServiceCategory) error
	Delete(id int) error
}

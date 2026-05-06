package adapter

import "gym-management/internal/domain/entity"

type FacilityRepository interface {
	Create(facility *entity.Facility) error
	GetByID(id int) (*entity.Facility, error)
	GetAll() ([]*entity.Facility, error)
	GetAllPaginated(page, limit int) ([]*entity.Facility, int, error)
	Update(facility *entity.Facility) error
	UpdateStatus(id int, status string) error
	Delete(id int) error
}

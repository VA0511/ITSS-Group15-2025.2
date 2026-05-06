package adapter

import "gym-management/internal/domain/entity"

type TrainingBookingRepository interface {
	Create(tb *entity.TrainingBooking) error
	GetByID(id int) (*entity.TrainingBooking, error)
	GetAll() ([]*entity.TrainingBooking, error)
	Update(tb *entity.TrainingBooking) error
	Delete(id int) error
}

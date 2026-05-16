package adapter

import "gym-management/internal/domain/entity"

type TrainingSessionRepository interface {
	Create(ts *entity.TrainingSession) error
	GetByID(id int) (*entity.TrainingSession, error)
	GetAll() ([]*entity.TrainingSession, error)
	Update(ts *entity.TrainingSession) error
	Delete(id int) error
	ConfirmAttendance(id int, memberID int) error
}

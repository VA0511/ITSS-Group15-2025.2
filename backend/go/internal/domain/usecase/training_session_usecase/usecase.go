package training_session_usecase

import (
	"context"
	"gym-management/internal/domain/adapter"
	"gym-management/internal/domain/entity"
)

type TrainingSessionUsecase interface {
	CreateTrainingSession(trainingSession *entity.TrainingSession) error
	GetTrainingSessionByID(id int) (*entity.TrainingSession, error)
	GetAllTrainingSessions() ([]*entity.TrainingSession, error)
	GetSessionsByPTEmployeeID(employeeID int) ([]*entity.TrainingSession, error)
	UpdateTrainingSession(trainingSession *entity.TrainingSession) error
	DeleteTrainingSession(id int) error
	ConfirmAttendance(id int, memberID int) error
}

type trainingSessionUsecase struct {
	create ICreateTrainingSessionUseCase
	get    IGetTrainingSessionUseCase
	list   IListTrainingSessionsUseCase
	update IUpdateTrainingSessionUseCase
	delete IDeleteTrainingSessionUseCase
	repo   adapter.TrainingSessionRepository
}

func NewTrainingSessionUsecase(repo adapter.TrainingSessionRepository) TrainingSessionUsecase {
	return &trainingSessionUsecase{
		create: NewCreateTrainingSessionUseCase(repo),
		get:    NewGetTrainingSessionUseCase(repo),
		list:   NewListTrainingSessionsUseCase(repo),
		update: NewUpdateTrainingSessionUseCase(repo),
		delete: NewDeleteTrainingSessionUseCase(repo),
		repo:   repo,
	}
}

func (u *trainingSessionUsecase) CreateTrainingSession(trainingSession *entity.TrainingSession) error {
	created, err := u.create.Execute(context.Background(), trainingSession)
	if err != nil {
		return err
	}
	*trainingSession = *created
	return nil
}

func (u *trainingSessionUsecase) GetTrainingSessionByID(id int) (*entity.TrainingSession, error) {
	return u.get.Execute(context.Background(), id)
}

func (u *trainingSessionUsecase) GetAllTrainingSessions() ([]*entity.TrainingSession, error) {
	return u.list.Execute(context.Background())
}

func (u *trainingSessionUsecase) UpdateTrainingSession(trainingSession *entity.TrainingSession) error {
	updated, err := u.update.Execute(context.Background(), trainingSession)
	if err != nil {
		return err
	}
	*trainingSession = *updated
	return nil
}

func (u *trainingSessionUsecase) DeleteTrainingSession(id int) error {
	return u.delete.Execute(context.Background(), id)
}

func (u *trainingSessionUsecase) GetSessionsByPTEmployeeID(employeeID int) ([]*entity.TrainingSession, error) {
	return u.repo.GetByPTEmployeeID(employeeID)
}

func (u *trainingSessionUsecase) ConfirmAttendance(id int, memberID int) error {
	return u.repo.ConfirmAttendance(id, memberID)
}

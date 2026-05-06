package training_session_usecase

import (
	"context"
	"gym-management/internal/domain/adapter"
	"gym-management/internal/domain/entity"
)

type ICreateTrainingSessionUseCase interface {
	Execute(ctx context.Context, trainingSession *entity.TrainingSession) (*entity.TrainingSession, error)
}

type CreateTrainingSessionUseCase struct {
	repo adapter.TrainingSessionRepository
}

func NewCreateTrainingSessionUseCase(repo adapter.TrainingSessionRepository) ICreateTrainingSessionUseCase {
	return &CreateTrainingSessionUseCase{repo: repo}
}

func (u *CreateTrainingSessionUseCase) Execute(ctx context.Context, trainingSession *entity.TrainingSession) (*entity.TrainingSession, error) {

	err := u.repo.Create(trainingSession)
	return trainingSession, err
}

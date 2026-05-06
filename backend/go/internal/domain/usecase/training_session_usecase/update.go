package training_session_usecase

import (
	"context"
	"errors"
	"gym-management/internal/domain/adapter"
	"gym-management/internal/domain/entity"
)

type IUpdateTrainingSessionUseCase interface {
	Execute(ctx context.Context, trainingSession *entity.TrainingSession) (*entity.TrainingSession, error)
}

type UpdateTrainingSessionUseCase struct {
	repo adapter.TrainingSessionRepository
}

func NewUpdateTrainingSessionUseCase(repo adapter.TrainingSessionRepository) IUpdateTrainingSessionUseCase {
	return &UpdateTrainingSessionUseCase{repo: repo}
}

func (u *UpdateTrainingSessionUseCase) Execute(ctx context.Context, trainingSession *entity.TrainingSession) (*entity.TrainingSession, error) {
	if trainingSession.ID <= 0 {
		return nil, errors.New("invalid id")
	}
	if err := u.repo.Update(trainingSession); err != nil {
		return nil, err
	}
	return trainingSession, nil
}

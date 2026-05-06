package training_session_usecase

import (
	"context"
	"errors"
	"gym-management/internal/domain/adapter"
	"gym-management/internal/domain/entity"
)

type IGetTrainingSessionUseCase interface {
	Execute(ctx context.Context, id int) (*entity.TrainingSession, error)
}

type GetTrainingSessionUseCase struct {
	repo adapter.TrainingSessionRepository
}

func NewGetTrainingSessionUseCase(repo adapter.TrainingSessionRepository) IGetTrainingSessionUseCase {
	return &GetTrainingSessionUseCase{repo: repo}
}

func (u *GetTrainingSessionUseCase) Execute(ctx context.Context, id int) (*entity.TrainingSession, error) {
	if id <= 0 {
		return nil, errors.New("invalid id")
	}
	return u.repo.GetByID(id)
}

package training_session_usecase

import (
	"context"
	"errors"
	"gym-management/internal/domain/adapter"
)

type IDeleteTrainingSessionUseCase interface {
	Execute(ctx context.Context, id int) error
}

type DeleteTrainingSessionUseCase struct {
	repo adapter.TrainingSessionRepository
}

func NewDeleteTrainingSessionUseCase(repo adapter.TrainingSessionRepository) IDeleteTrainingSessionUseCase {
	return &DeleteTrainingSessionUseCase{repo: repo}
}

func (u *DeleteTrainingSessionUseCase) Execute(ctx context.Context, id int) error {
	if id <= 0 {
		return errors.New("invalid id")
	}
	return u.repo.Delete(id)
}

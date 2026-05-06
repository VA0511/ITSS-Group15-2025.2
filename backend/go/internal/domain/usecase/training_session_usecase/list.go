package training_session_usecase

import (
	"context"
	"gym-management/internal/domain/adapter"
	"gym-management/internal/domain/entity"
)

type IListTrainingSessionsUseCase interface {
	Execute(ctx context.Context) ([]*entity.TrainingSession, error)
}

type ListTrainingSessionsUseCase struct {
	repo adapter.TrainingSessionRepository
}

func NewListTrainingSessionsUseCase(repo adapter.TrainingSessionRepository) IListTrainingSessionsUseCase {
	return &ListTrainingSessionsUseCase{repo: repo}
}

func (u *ListTrainingSessionsUseCase) Execute(ctx context.Context) ([]*entity.TrainingSession, error) {
	return u.repo.GetAll()
}

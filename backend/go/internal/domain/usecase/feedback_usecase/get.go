package feedback_usecase

import (
	"context"
	"errors"
	"gym-management/internal/domain/adapter"
	"gym-management/internal/domain/entity"
)

type IGetFeedbackUseCase interface {
	Execute(ctx context.Context, id int) (*entity.Feedback, error)
}

type GetFeedbackUseCase struct {
	repo adapter.FeedbackRepository
}

func NewGetFeedbackUseCase(repo adapter.FeedbackRepository) IGetFeedbackUseCase {
	return &GetFeedbackUseCase{repo: repo}
}

func (u *GetFeedbackUseCase) Execute(ctx context.Context, id int) (*entity.Feedback, error) {
	if id <= 0 {
		return nil, errors.New("invalid id")
	}
	return u.repo.GetByID(id)
}

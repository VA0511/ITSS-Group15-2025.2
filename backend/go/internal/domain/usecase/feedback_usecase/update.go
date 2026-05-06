package feedback_usecase

import (
	"context"
	"errors"
	"gym-management/internal/domain/adapter"
	"gym-management/internal/domain/entity"
)

type IUpdateFeedbackUseCase interface {
	Execute(ctx context.Context, feedback *entity.Feedback) (*entity.Feedback, error)
}

type UpdateFeedbackUseCase struct {
	repo adapter.FeedbackRepository
}

func NewUpdateFeedbackUseCase(repo adapter.FeedbackRepository) IUpdateFeedbackUseCase {
	return &UpdateFeedbackUseCase{repo: repo}
}

func (u *UpdateFeedbackUseCase) Execute(ctx context.Context, feedback *entity.Feedback) (*entity.Feedback, error) {
	if feedback.ID <= 0 {
		return nil, errors.New("invalid id")
	}
	if err := u.repo.Update(feedback); err != nil {
		return nil, err
	}
	return feedback, nil
}

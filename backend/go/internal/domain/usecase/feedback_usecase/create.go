package feedback_usecase

import (
	"context"
	"time"

	"gym-management/internal/domain/adapter"
	"gym-management/internal/domain/entity"
)

type ICreateFeedbackUseCase interface {
	Execute(ctx context.Context, feedback *entity.Feedback) (*entity.Feedback, error)
}

type CreateFeedbackUseCase struct {
	repo adapter.FeedbackRepository
}

func NewCreateFeedbackUseCase(repo adapter.FeedbackRepository) ICreateFeedbackUseCase {
	return &CreateFeedbackUseCase{repo: repo}
}

func (u *CreateFeedbackUseCase) Execute(ctx context.Context, feedback *entity.Feedback) (*entity.Feedback, error) {
	if feedback.SentAt.IsZero() {
		feedback.SentAt = time.Now()
	}
	err := u.repo.Create(feedback)
	return feedback, err
}

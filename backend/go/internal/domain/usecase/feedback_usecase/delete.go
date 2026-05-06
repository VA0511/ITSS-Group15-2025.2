package feedback_usecase

import (
	"context"
	"errors"
	"gym-management/internal/domain/adapter"
)

type IDeleteFeedbackUseCase interface {
	Execute(ctx context.Context, id int) error
}

type DeleteFeedbackUseCase struct {
	repo adapter.FeedbackRepository
}

func NewDeleteFeedbackUseCase(repo adapter.FeedbackRepository) IDeleteFeedbackUseCase {
	return &DeleteFeedbackUseCase{repo: repo}
}

func (u *DeleteFeedbackUseCase) Execute(ctx context.Context, id int) error {
	if id <= 0 {
		return errors.New("invalid id")
	}
	return u.repo.Delete(id)
}

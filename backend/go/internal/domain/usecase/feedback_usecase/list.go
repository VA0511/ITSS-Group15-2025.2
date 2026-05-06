package feedback_usecase

import (
	"context"
	"gym-management/internal/domain/adapter"
	"gym-management/internal/domain/entity"
)

type IListFeedbacksUseCase interface {
	Execute(ctx context.Context) ([]*entity.Feedback, error)
}

type IListFeedbacksPaginatedUseCase interface {
	Execute(ctx context.Context, page, limit int, status string) ([]*entity.Feedback, int, error)
}

type ListFeedbacksUseCase struct {
	repo adapter.FeedbackRepository
}

func NewListFeedbacksUseCase(repo adapter.FeedbackRepository) IListFeedbacksUseCase {
	return &ListFeedbacksUseCase{repo: repo}
}

func (u *ListFeedbacksUseCase) Execute(ctx context.Context) ([]*entity.Feedback, error) {
	return u.repo.GetAll()
}

type ListFeedbacksPaginatedUseCase struct {
	repo adapter.FeedbackRepository
}

func NewListFeedbacksPaginatedUseCase(repo adapter.FeedbackRepository) IListFeedbacksPaginatedUseCase {
	return &ListFeedbacksPaginatedUseCase{repo: repo}
}

func (u *ListFeedbacksPaginatedUseCase) Execute(ctx context.Context, page, limit int, status string) ([]*entity.Feedback, int, error) {
	return u.repo.GetAllPaginated(page, limit, status)
}

type IListFeedbacksByMemberIDUseCase interface {
	Execute(ctx context.Context, memberID int) ([]*entity.Feedback, error)
}

type ListFeedbacksByMemberIDUseCase struct {
	repo adapter.FeedbackRepository
}

func NewListFeedbacksByMemberIDUseCase(repo adapter.FeedbackRepository) IListFeedbacksByMemberIDUseCase {
	return &ListFeedbacksByMemberIDUseCase{repo: repo}
}

func (u *ListFeedbacksByMemberIDUseCase) Execute(ctx context.Context, memberID int) ([]*entity.Feedback, error) {
	return u.repo.GetByMemberID(memberID)
}

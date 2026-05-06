package subscription_usecase

import (
	"context"
	"gym-management/internal/domain/adapter"
	"gym-management/internal/domain/entity"
)

type IGetSubscriptionHistoryUseCase interface {
	Execute(ctx context.Context, memberID int, page, limit int) ([]*entity.SubscriptionHistory, int, error)
}

type getSubscriptionHistoryUseCase struct {
	repo adapter.SubscriptionRepository
}

func NewGetSubscriptionHistoryUseCase(repo adapter.SubscriptionRepository) IGetSubscriptionHistoryUseCase {
	return &getSubscriptionHistoryUseCase{repo: repo}
}

func (u *getSubscriptionHistoryUseCase) Execute(ctx context.Context, memberID int, page, limit int) ([]*entity.SubscriptionHistory, int, error) {
	return u.repo.GetByMemberID(memberID, page, limit)
}

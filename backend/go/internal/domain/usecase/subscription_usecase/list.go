package subscription_usecase

import (
	"context"
	"gym-management/internal/domain/adapter"
	"gym-management/internal/domain/entity"
)

type IListSubscriptionsUseCase interface {
	Execute(ctx context.Context) ([]*entity.Subscription, error)
}

type ListSubscriptionsUseCase struct {
	repo adapter.SubscriptionRepository
}

func NewListSubscriptionsUseCase(repo adapter.SubscriptionRepository) IListSubscriptionsUseCase {
	return &ListSubscriptionsUseCase{repo: repo}
}

func (u *ListSubscriptionsUseCase) Execute(ctx context.Context) ([]*entity.Subscription, error) {
	return u.repo.GetAll()
}

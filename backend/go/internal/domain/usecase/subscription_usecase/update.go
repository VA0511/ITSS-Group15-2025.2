package subscription_usecase

import (
	"context"
	"errors"
	"gym-management/internal/domain/adapter"
	"gym-management/internal/domain/entity"
)

type IUpdateSubscriptionUseCase interface {
	Execute(ctx context.Context, subscription *entity.Subscription) (*entity.Subscription, error)
}

type UpdateSubscriptionUseCase struct {
	repo adapter.SubscriptionRepository
}

func NewUpdateSubscriptionUseCase(repo adapter.SubscriptionRepository) IUpdateSubscriptionUseCase {
	return &UpdateSubscriptionUseCase{repo: repo}
}

func (u *UpdateSubscriptionUseCase) Execute(ctx context.Context, subscription *entity.Subscription) (*entity.Subscription, error) {
	if subscription.ID <= 0 {
		return nil, errors.New("invalid id")
	}
	if err := u.repo.Update(subscription); err != nil {
		return nil, err
	}
	return subscription, nil
}

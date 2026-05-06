package subscription_usecase

import (
	"context"
	"gym-management/internal/domain/adapter"
	"gym-management/internal/domain/entity"
)

type ICreateSubscriptionUseCase interface {
	Execute(ctx context.Context, subscription *entity.Subscription) (*entity.Subscription, error)
}

type CreateSubscriptionUseCase struct {
	repo adapter.SubscriptionRepository
}

func NewCreateSubscriptionUseCase(repo adapter.SubscriptionRepository) ICreateSubscriptionUseCase {
	return &CreateSubscriptionUseCase{repo: repo}
}

func (u *CreateSubscriptionUseCase) Execute(ctx context.Context, subscription *entity.Subscription) (*entity.Subscription, error) {

	err := u.repo.Create(subscription)
	return subscription, err
}

package subscription_usecase

import (
	"context"
	"errors"
	"gym-management/internal/domain/adapter"
	"gym-management/internal/domain/entity"
)

type IGetSubscriptionUseCase interface {
	Execute(ctx context.Context, id int) (*entity.Subscription, error)
}

type GetSubscriptionUseCase struct {
	repo adapter.SubscriptionRepository
}

func NewGetSubscriptionUseCase(repo adapter.SubscriptionRepository) IGetSubscriptionUseCase {
	return &GetSubscriptionUseCase{repo: repo}
}

func (u *GetSubscriptionUseCase) Execute(ctx context.Context, id int) (*entity.Subscription, error) {
	if id <= 0 {
		return nil, errors.New("invalid id")
	}
	return u.repo.GetByID(id)
}

package subscription_usecase

import (
	"context"
	"errors"
	"gym-management/internal/domain/adapter"
)

type IDeleteSubscriptionUseCase interface {
	Execute(ctx context.Context, id int) error
}

type DeleteSubscriptionUseCase struct {
	repo adapter.SubscriptionRepository
}

func NewDeleteSubscriptionUseCase(repo adapter.SubscriptionRepository) IDeleteSubscriptionUseCase {
	return &DeleteSubscriptionUseCase{repo: repo}
}

func (u *DeleteSubscriptionUseCase) Execute(ctx context.Context, id int) error {
	if id <= 0 {
		return errors.New("invalid id")
	}
	return u.repo.Delete(id)
}

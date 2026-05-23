package subscription_usecase

import (
	"context"
	"time"

	"gym-management/internal/domain/adapter"
	"gym-management/internal/domain/entity"
)

type SubscriptionUsecase interface {
	CreateSubscription(subscription *entity.Subscription) error
	GetSubscriptionByID(id int) (*entity.Subscription, error)
	GetSubscriptionHistoryByMemberID(memberID int, page, limit int) ([]*entity.SubscriptionHistory, int, error)
	GetAllSubscriptions() ([]*entity.Subscription, error)
	UpdateSubscription(subscription *entity.Subscription) error
	DeleteSubscription(id int) error
	GetActiveSubscriptionByMemberID(memberID int) (*entity.Subscription, error)
	GetActiveSubscriptionByMemberIDAndCategoryID(memberID, categoryID int) (*entity.Subscription, error)
	RenewSubscription(id int, newEndDate time.Time) error
}

type subscriptionUsecase struct {
	repo       adapter.SubscriptionRepository
	create     ICreateSubscriptionUseCase
	get        IGetSubscriptionUseCase
	getHistory IGetSubscriptionHistoryUseCase
	list       IListSubscriptionsUseCase
	update     IUpdateSubscriptionUseCase
	delete     IDeleteSubscriptionUseCase
}

func NewSubscriptionUsecase(repo adapter.SubscriptionRepository) SubscriptionUsecase {
	return &subscriptionUsecase{
		repo:       repo,
		create:     NewCreateSubscriptionUseCase(repo),
		get:        NewGetSubscriptionUseCase(repo),
		getHistory: NewGetSubscriptionHistoryUseCase(repo),
		list:       NewListSubscriptionsUseCase(repo),
		update:     NewUpdateSubscriptionUseCase(repo),
		delete:     NewDeleteSubscriptionUseCase(repo),
	}
}

func (u *subscriptionUsecase) CreateSubscription(subscription *entity.Subscription) error {
	created, err := u.create.Execute(context.Background(), subscription)
	if err != nil {
		return err
	}
	*subscription = *created
	return nil
}

func (u *subscriptionUsecase) GetSubscriptionByID(id int) (*entity.Subscription, error) {
	return u.get.Execute(context.Background(), id)
}

func (u *subscriptionUsecase) GetSubscriptionHistoryByMemberID(memberID int, page, limit int) ([]*entity.SubscriptionHistory, int, error) {
	return u.getHistory.Execute(context.Background(), memberID, page, limit)
}

func (u *subscriptionUsecase) UpdateSubscription(subscription *entity.Subscription) error {
	updated, err := u.update.Execute(context.Background(), subscription)
	if err != nil {
		return err
	}
	*subscription = *updated
	return nil
}

func (u *subscriptionUsecase) DeleteSubscription(id int) error {
	return u.delete.Execute(context.Background(), id)
}
func (u *subscriptionUsecase) GetAllSubscriptions() ([]*entity.Subscription, error) {
	return u.list.Execute(context.Background())
}

func (u *subscriptionUsecase) GetActiveSubscriptionByMemberID(memberID int) (*entity.Subscription, error) {
	return u.repo.GetActiveByMemberID(memberID)
}

func (u *subscriptionUsecase) GetActiveSubscriptionByMemberIDAndCategoryID(memberID, categoryID int) (*entity.Subscription, error) {
	return u.repo.GetActiveByMemberIDAndCategoryID(memberID, categoryID)
}

func (u *subscriptionUsecase) RenewSubscription(id int, newEndDate time.Time) error {
	return u.repo.Renew(id, newEndDate)
}

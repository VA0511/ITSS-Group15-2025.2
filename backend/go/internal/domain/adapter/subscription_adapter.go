package adapter

import (
	"time"

	"gym-management/internal/domain/entity"
)

type SubscriptionRepository interface {
	Create(sub *entity.Subscription) error
	GetByID(id int) (*entity.Subscription, error)
	GetAll() ([]*entity.Subscription, error)
	Update(sub *entity.Subscription) error
	Delete(id int) error
	GetByMemberID(memberID int, page, limit int) ([]*entity.SubscriptionHistory, int, error)
	GetActiveByMemberID(memberID int) (*entity.Subscription, error)
	GetActiveByMemberIDAndCategoryID(memberID, categoryID int) (*entity.Subscription, error)
	Renew(id int, newEndDate time.Time) error
}

package adapter

import "gym-management/internal/domain/entity"

type PTDetailRepository interface {
	Create(ptd *entity.PTDetail) error
	GetByID(id int) (*entity.PTDetail, error)
	GetByAccountID(accountID int) (*entity.PTDetail, error)
	GetAll() ([]*entity.PTDetail, error)
	Update(ptd *entity.PTDetail) error
	Delete(id int) error
}

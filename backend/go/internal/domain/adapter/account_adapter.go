package adapter

import "gym-management/internal/domain/entity"

type AccountRepository interface {
	Create(account *entity.Account) error
	GetByID(id int) (*entity.Account, error)
	GetAll() ([]*entity.Account, error)
	GetAllPaginated(page, limit int) ([]*entity.Account, int, error)
	Update(account *entity.Account) error
	Delete(id int) error
}

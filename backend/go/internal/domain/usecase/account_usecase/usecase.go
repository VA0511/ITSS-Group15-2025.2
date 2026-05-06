package account_usecase

import (
	"context"
	"errors"
	"gym-management/internal/domain/adapter"
	"gym-management/internal/domain/entity"
)

type AccountUsecase interface {
	CreateAccount(account *entity.Account) error
	GetAccountByID(id int) (*entity.Account, error)
	GetAllAccounts() ([]*entity.Account, error)
	GetAllAccountsPaginated(page, limit int) ([]*entity.Account, int, error)
	UpdateAccount(account *entity.Account) error
	DeleteAccount(id int) error
	RevealAccountPassword(requesterID int, requesterPassword string, targetID int) (string, error)
}

type accountUsecase struct {
	create        ICreateAccountUseCase
	get           IGetAccountUseCase
	list          IListAccountsUseCase
	listPaginated IListAccountsPaginatedUseCase
	update        IUpdateAccountUseCase
	delete        IDeleteAccountUseCase
}

func NewAccountUsecase(repo adapter.AccountRepository) AccountUsecase {
	return &accountUsecase{
		create:        NewCreateAccountUseCase(repo),
		get:           NewGetAccountUseCase(repo),
		list:          NewListAccountsUseCase(repo),
		listPaginated: NewListAccountsPaginatedUseCase(repo),
		update:        NewUpdateAccountUseCase(repo),
		delete:        NewDeleteAccountUseCase(repo),
	}
}

func (u *accountUsecase) CreateAccount(account *entity.Account) error {
	created, err := u.create.Execute(context.Background(), account)
	if err != nil {
		return err
	}
	*account = *created
	return nil
}

func (u *accountUsecase) GetAccountByID(id int) (*entity.Account, error) {
	return u.get.Execute(context.Background(), id)
}

func (u *accountUsecase) GetAllAccounts() ([]*entity.Account, error) {
	return u.list.Execute(context.Background())
}

func (u *accountUsecase) GetAllAccountsPaginated(page, limit int) ([]*entity.Account, int, error) {
	return u.listPaginated.Execute(context.Background(), page, limit)
}

func (u *accountUsecase) UpdateAccount(account *entity.Account) error {
	updated, err := u.update.Execute(context.Background(), account)
	if err != nil {
		return err
	}
	*account = *updated
	return nil
}

func (u *accountUsecase) DeleteAccount(id int) error {
	return u.delete.Execute(context.Background(), id)
}

func (u *accountUsecase) RevealAccountPassword(requesterID int, requesterPassword string, targetID int) (string, error) {
	requester, err := u.get.Execute(context.Background(), requesterID)
	if err != nil {
		return "", errors.New("requester not found")
	}
	if requester.Password != requesterPassword {
		return "", errors.New("wrong password")
	}
	target, err := u.get.Execute(context.Background(), targetID)
	if err != nil {
		return "", errors.New("account not found")
	}
	return target.Password, nil
}

package pt_detail_usecase

import (
	"context"
	"gym-management/internal/domain/adapter"
	"gym-management/internal/domain/entity"
)

type PTDetailUsecase interface {
	CreatePTDetail(pTDetail *entity.PTDetail) error
	GetPTDetailByID(id int) (*entity.PTDetail, error)
	GetMyPTDetail(accountID int) (*entity.PTDetail, error)
	GetAllPTDetails() ([]*entity.PTDetail, error)
	UpdatePTDetail(pTDetail *entity.PTDetail) error
	DeletePTDetail(id int) error
}

type pTDetailUsecase struct {
	create         ICreatePTDetailUseCase
	get            IGetPTDetailUseCase
	getByAccountID IGetPTDetailByAccountIDUseCase
	list           IListPTDetailsUseCase
	update         IUpdatePTDetailUseCase
	delete         IDeletePTDetailUseCase
}

func NewPTDetailUsecase(repo adapter.PTDetailRepository) PTDetailUsecase {
	return &pTDetailUsecase{
		create:         NewCreatePTDetailUseCase(repo),
		get:            NewGetPTDetailUseCase(repo),
		getByAccountID: NewGetPTDetailByAccountIDUseCase(repo),
		list:           NewListPTDetailsUseCase(repo),
		update:         NewUpdatePTDetailUseCase(repo),
		delete:         NewDeletePTDetailUseCase(repo),
	}
}

func (u *pTDetailUsecase) CreatePTDetail(pTDetail *entity.PTDetail) error {
	created, err := u.create.Execute(context.Background(), pTDetail)
	if err != nil {
		return err
	}
	*pTDetail = *created
	return nil
}

func (u *pTDetailUsecase) GetPTDetailByID(id int) (*entity.PTDetail, error) {
	return u.get.Execute(context.Background(), id)
}

func (u *pTDetailUsecase) GetMyPTDetail(accountID int) (*entity.PTDetail, error) {
	return u.getByAccountID.Execute(context.Background(), accountID)
}

func (u *pTDetailUsecase) GetAllPTDetails() ([]*entity.PTDetail, error) {
	return u.list.Execute(context.Background())
}

func (u *pTDetailUsecase) UpdatePTDetail(pTDetail *entity.PTDetail) error {
	updated, err := u.update.Execute(context.Background(), pTDetail)
	if err != nil {
		return err
	}
	*pTDetail = *updated
	return nil
}

func (u *pTDetailUsecase) DeletePTDetail(id int) error {
	return u.delete.Execute(context.Background(), id)
}

package account_usecase

import (
	"context"
	"errors"
	"gym-management/internal/domain/adapter"
)

type IDeleteAccountUseCase interface {
	Execute(ctx context.Context, id int) error
}

type DeleteAccountUseCase struct {
	repo adapter.AccountRepository
}

func NewDeleteAccountUseCase(repo adapter.AccountRepository) IDeleteAccountUseCase {
	return &DeleteAccountUseCase{repo: repo}
}

func (u *DeleteAccountUseCase) Execute(ctx context.Context, id int) error {
	if id <= 0 {
		return errors.New("invalid id")
	}
	return u.repo.Delete(id)
}

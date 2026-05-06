package member_usecase

import (
	"context"
	"errors"
	"gym-management/internal/domain/adapter"
)

type IDeleteMemberUseCase interface {
	Execute(ctx context.Context, id int) error
}

type DeleteMemberUseCase struct {
	repo adapter.MemberRepository
}

func NewDeleteMemberUseCase(repo adapter.MemberRepository) IDeleteMemberUseCase {
	return &DeleteMemberUseCase{repo: repo}
}

func (u *DeleteMemberUseCase) Execute(ctx context.Context, id int) error {
	if id <= 0 {
		return errors.New("invalid id")
	}
	return u.repo.Delete(id)
}

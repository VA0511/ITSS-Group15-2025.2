package member_usecase

import (
	"context"
	"errors"
	"gym-management/internal/domain/adapter"
	"gym-management/internal/domain/entity"
)

type IGetMemberUseCase interface {
	Execute(ctx context.Context, id int) (*entity.Member, error)
}

type GetMemberUseCase struct {
	repo adapter.MemberRepository
}

func NewGetMemberUseCase(repo adapter.MemberRepository) IGetMemberUseCase {
	return &GetMemberUseCase{repo: repo}
}

func (u *GetMemberUseCase) Execute(ctx context.Context, id int) (*entity.Member, error) {
	if id <= 0 {
		return nil, errors.New("invalid id")
	}
	return u.repo.GetByID(id)
}

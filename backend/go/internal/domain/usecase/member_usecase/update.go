package member_usecase

import (
	"context"
	"errors"
	"gym-management/internal/domain/adapter"
	"gym-management/internal/domain/entity"
)

type IUpdateMemberUseCase interface {
	Execute(ctx context.Context, member *entity.Member) (*entity.Member, error)
}

type UpdateMemberUseCase struct {
	repo adapter.MemberRepository
}

func NewUpdateMemberUseCase(repo adapter.MemberRepository) IUpdateMemberUseCase {
	return &UpdateMemberUseCase{repo: repo}
}

func (u *UpdateMemberUseCase) Execute(ctx context.Context, member *entity.Member) (*entity.Member, error) {
	if member.ID <= 0 {
		return nil, errors.New("invalid id")
	}
	if err := u.repo.Update(member); err != nil {
		return nil, err
	}
	return member, nil
}

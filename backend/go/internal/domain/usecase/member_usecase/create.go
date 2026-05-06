package member_usecase

import (
	"context"
	"gym-management/internal/domain/adapter"
	"gym-management/internal/domain/entity"
)

type ICreateMemberUseCase interface {
	Execute(ctx context.Context, member *entity.Member) (*entity.Member, error)
}

type CreateMemberUseCase struct {
	repo adapter.MemberRepository
}

func NewCreateMemberUseCase(repo adapter.MemberRepository) ICreateMemberUseCase {
	return &CreateMemberUseCase{repo: repo}
}

func (u *CreateMemberUseCase) Execute(ctx context.Context, member *entity.Member) (*entity.Member, error) {

	err := u.repo.Create(member)
	return member, err
}

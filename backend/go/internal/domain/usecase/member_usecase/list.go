package member_usecase

import (
	"context"
	"gym-management/internal/domain/adapter"
	"gym-management/internal/domain/entity"
)

type IListMembersUseCase interface {
	Execute(ctx context.Context) ([]*entity.Member, error)
}

type IListMembersPaginatedUseCase interface {
	Execute(ctx context.Context, page, limit int) ([]*entity.Member, int, error)
}

type ListMembersUseCase struct {
	repo adapter.MemberRepository
}

func NewListMembersUseCase(repo adapter.MemberRepository) IListMembersUseCase {
	return &ListMembersUseCase{repo: repo}
}

func (u *ListMembersUseCase) Execute(ctx context.Context) ([]*entity.Member, error) {
	return u.repo.GetAll()
}

type ListMembersPaginatedUseCase struct {
	repo adapter.MemberRepository
}

func NewListMembersPaginatedUseCase(repo adapter.MemberRepository) IListMembersPaginatedUseCase {
	return &ListMembersPaginatedUseCase{repo: repo}
}

func (u *ListMembersPaginatedUseCase) Execute(ctx context.Context, page, limit int) ([]*entity.Member, int, error) {
	return u.repo.GetAllPaginated(page, limit)
}

package member_usecase

import (
	"context"
	"gym-management/internal/domain/adapter"
	"gym-management/internal/domain/entity"
	"gym-management/internal/infra/api/dto"
)

type MemberUsecase interface {
	CreateMember(member *entity.Member) error
	GetMemberByID(id int) (*entity.Member, error)
	GetAllMembers() ([]*entity.Member, error)
	GetAllMembersPaginated(page, limit int) ([]*entity.Member, int, error)
	GetAllMembersWithDetails() ([]*dto.MemberListItemDTO, error)
	GetMemberByIDWithDetails(id int) (*dto.MemberDetailDTO, error)
	GetMemberByAccountID(accountID int) (*entity.Member, error)
	UpdateMember(member *entity.Member) error
	UpdateMemberStatus(id int, isActive bool) error
	DeleteMember(id int) error
}

type memberUsecase struct {
	repo          adapter.MemberRepository
	create        ICreateMemberUseCase
	get           IGetMemberUseCase
	list          IListMembersUseCase
	listPaginated IListMembersPaginatedUseCase
	update        IUpdateMemberUseCase
	delete        IDeleteMemberUseCase
}

func NewMemberUsecase(repo adapter.MemberRepository) MemberUsecase {
	return &memberUsecase{
		repo:          repo,
		create:        NewCreateMemberUseCase(repo),
		get:           NewGetMemberUseCase(repo),
		list:          NewListMembersUseCase(repo),
		listPaginated: NewListMembersPaginatedUseCase(repo),
		update:        NewUpdateMemberUseCase(repo),
		delete:        NewDeleteMemberUseCase(repo),
	}
}

func (u *memberUsecase) CreateMember(member *entity.Member) error {
	created, err := u.create.Execute(context.Background(), member)
	if err != nil {
		return err
	}
	*member = *created
	return nil
}

func (u *memberUsecase) GetMemberByID(id int) (*entity.Member, error) {
	return u.get.Execute(context.Background(), id)
}

func (u *memberUsecase) GetAllMembers() ([]*entity.Member, error) {
	return u.list.Execute(context.Background())
}

func (u *memberUsecase) GetAllMembersPaginated(page, limit int) ([]*entity.Member, int, error) {
	return u.listPaginated.Execute(context.Background(), page, limit)
}

func (u *memberUsecase) GetAllMembersWithDetails() ([]*dto.MemberListItemDTO, error) {
	return u.repo.GetAllMembersWithDetails()
}

func (u *memberUsecase) GetMemberByIDWithDetails(id int) (*dto.MemberDetailDTO, error) {
	return u.repo.GetMemberByIDWithDetails(id)
}

func (u *memberUsecase) GetMemberByAccountID(accountID int) (*entity.Member, error) {
	return u.repo.GetByAccountID(accountID)
}

func (u *memberUsecase) UpdateMember(member *entity.Member) error {
	updated, err := u.update.Execute(context.Background(), member)
	if err != nil {
		return err
	}
	*member = *updated
	return nil
}

func (u *memberUsecase) UpdateMemberStatus(id int, isActive bool) error {
	return u.repo.UpdateStatus(id, isActive)
}

func (u *memberUsecase) DeleteMember(id int) error {
	return u.delete.Execute(context.Background(), id)
}

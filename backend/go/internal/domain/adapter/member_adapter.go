package adapter

import (
	"gym-management/internal/domain/entity"
	"gym-management/internal/infra/api/dto"
)

type MemberRepository interface {
	Create(member *entity.Member) error
	GetByID(id int) (*entity.Member, error)
	GetAll() ([]*entity.Member, error)
	GetAllPaginated(page, limit int) ([]*entity.Member, int, error)
	GetAllMembersWithDetails() ([]*dto.MemberListItemDTO, error)
	GetMemberByIDWithDetails(id int) (*dto.MemberDetailDTO, error)
	Update(member *entity.Member) error
	UpdateStatus(id int, isActive bool) error
	GetByAccountID(accountID int) (*entity.Member, error)
	Delete(id int) error
}

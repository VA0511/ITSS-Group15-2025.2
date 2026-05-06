package facility_usecase

import (
	"context"
	"errors"
	"gym-management/internal/domain/adapter"
	"gym-management/internal/domain/entity"
)

type IGetFacilityUseCase interface {
	Execute(ctx context.Context, id int) (*entity.Facility, error)
}

type GetFacilityUseCase struct {
	repo adapter.FacilityRepository
}

func NewGetFacilityUseCase(repo adapter.FacilityRepository) IGetFacilityUseCase {
	return &GetFacilityUseCase{repo: repo}
}

func (u *GetFacilityUseCase) Execute(ctx context.Context, id int) (*entity.Facility, error) {
	if id <= 0 {
		return nil, errors.New("invalid id")
	}
	return u.repo.GetByID(id)
}

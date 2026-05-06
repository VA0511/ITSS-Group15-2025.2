package facility_usecase

import (
	"context"
	"errors"
	"gym-management/internal/domain/adapter"
	"gym-management/internal/domain/entity"
)

type IUpdateFacilityUseCase interface {
	Execute(ctx context.Context, facility *entity.Facility) (*entity.Facility, error)
}

type UpdateFacilityUseCase struct {
	repo adapter.FacilityRepository
}

func NewUpdateFacilityUseCase(repo adapter.FacilityRepository) IUpdateFacilityUseCase {
	return &UpdateFacilityUseCase{repo: repo}
}

func (u *UpdateFacilityUseCase) Execute(ctx context.Context, facility *entity.Facility) (*entity.Facility, error) {
	if facility.ID <= 0 {
		return nil, errors.New("invalid id")
	}
	if err := u.repo.Update(facility); err != nil {
		return nil, err
	}
	return facility, nil
}

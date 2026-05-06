package facility_usecase

import (
	"context"
	"gym-management/internal/domain/adapter"
	"gym-management/internal/domain/entity"
)

type ICreateFacilityUseCase interface {
	Execute(ctx context.Context, facility *entity.Facility) (*entity.Facility, error)
}

type CreateFacilityUseCase struct {
	repo adapter.FacilityRepository
}

func NewCreateFacilityUseCase(repo adapter.FacilityRepository) ICreateFacilityUseCase {
	return &CreateFacilityUseCase{repo: repo}
}

func (u *CreateFacilityUseCase) Execute(ctx context.Context, facility *entity.Facility) (*entity.Facility, error) {

	err := u.repo.Create(facility)
	return facility, err
}

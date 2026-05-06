package facility_usecase

import (
	"context"
	"errors"
	"gym-management/internal/domain/adapter"
)

type IUpdateFacilityStatusUseCase interface {
	Execute(ctx context.Context, id int, status string) error
}

type UpdateFacilityStatusUseCase struct {
	repo adapter.FacilityRepository
}

func NewUpdateFacilityStatusUseCase(repo adapter.FacilityRepository) IUpdateFacilityStatusUseCase {
	return &UpdateFacilityStatusUseCase{repo: repo}
}

func (u *UpdateFacilityStatusUseCase) Execute(ctx context.Context, id int, status string) error {
	if id <= 0 {
		return errors.New("invalid id")
	}
	if status != "Operating" && status != "Maintenance" {
		return errors.New("status must be 'Operating' or 'Maintenance'")
	}
	return u.repo.UpdateStatus(id, status)
}

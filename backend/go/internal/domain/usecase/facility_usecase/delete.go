package facility_usecase

import (
	"context"
	"errors"
	"gym-management/internal/domain/adapter"
)

type IDeleteFacilityUseCase interface {
	Execute(ctx context.Context, id int) error
}

type DeleteFacilityUseCase struct {
	repo adapter.FacilityRepository
}

func NewDeleteFacilityUseCase(repo adapter.FacilityRepository) IDeleteFacilityUseCase {
	return &DeleteFacilityUseCase{repo: repo}
}

func (u *DeleteFacilityUseCase) Execute(ctx context.Context, id int) error {
	if id <= 0 {
		return errors.New("invalid id")
	}
	return u.repo.Delete(id)
}

package training_booking_usecase

import (
	"context"
	"errors"
	"gym-management/internal/domain/adapter"
)

type IDeleteTrainingBookingUseCase interface {
	Execute(ctx context.Context, id int) error
}

type DeleteTrainingBookingUseCase struct {
	repo adapter.TrainingBookingRepository
}

func NewDeleteTrainingBookingUseCase(repo adapter.TrainingBookingRepository) IDeleteTrainingBookingUseCase {
	return &DeleteTrainingBookingUseCase{repo: repo}
}

func (u *DeleteTrainingBookingUseCase) Execute(ctx context.Context, id int) error {
	if id <= 0 {
		return errors.New("invalid id")
	}
	return u.repo.Delete(id)
}

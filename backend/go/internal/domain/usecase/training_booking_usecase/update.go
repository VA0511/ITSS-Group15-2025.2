package training_booking_usecase

import (
	"context"
	"errors"
	"gym-management/internal/domain/adapter"
	"gym-management/internal/domain/entity"
)

type IUpdateTrainingBookingUseCase interface {
	Execute(ctx context.Context, trainingBooking *entity.TrainingBooking) (*entity.TrainingBooking, error)
}

type UpdateTrainingBookingUseCase struct {
	repo adapter.TrainingBookingRepository
}

func NewUpdateTrainingBookingUseCase(repo adapter.TrainingBookingRepository) IUpdateTrainingBookingUseCase {
	return &UpdateTrainingBookingUseCase{repo: repo}
}

func (u *UpdateTrainingBookingUseCase) Execute(ctx context.Context, trainingBooking *entity.TrainingBooking) (*entity.TrainingBooking, error) {
	if trainingBooking.ID <= 0 {
		return nil, errors.New("invalid id")
	}
	if err := u.repo.Update(trainingBooking); err != nil {
		return nil, err
	}
	return trainingBooking, nil
}

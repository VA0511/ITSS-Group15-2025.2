package training_booking_usecase

import (
	"context"
	"gym-management/internal/domain/adapter"
	"gym-management/internal/domain/entity"
)

type ICreateTrainingBookingUseCase interface {
	Execute(ctx context.Context, trainingBooking *entity.TrainingBooking) (*entity.TrainingBooking, error)
}

type CreateTrainingBookingUseCase struct {
	repo adapter.TrainingBookingRepository
}

func NewCreateTrainingBookingUseCase(repo adapter.TrainingBookingRepository) ICreateTrainingBookingUseCase {
	return &CreateTrainingBookingUseCase{repo: repo}
}

func (u *CreateTrainingBookingUseCase) Execute(ctx context.Context, trainingBooking *entity.TrainingBooking) (*entity.TrainingBooking, error) {

	err := u.repo.Create(trainingBooking)
	return trainingBooking, err
}

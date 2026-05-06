package training_booking_usecase

import (
	"context"
	"errors"
	"gym-management/internal/domain/adapter"
	"gym-management/internal/domain/entity"
)

type IGetTrainingBookingUseCase interface {
	Execute(ctx context.Context, id int) (*entity.TrainingBooking, error)
}

type GetTrainingBookingUseCase struct {
	repo adapter.TrainingBookingRepository
}

func NewGetTrainingBookingUseCase(repo adapter.TrainingBookingRepository) IGetTrainingBookingUseCase {
	return &GetTrainingBookingUseCase{repo: repo}
}

func (u *GetTrainingBookingUseCase) Execute(ctx context.Context, id int) (*entity.TrainingBooking, error) {
	if id <= 0 {
		return nil, errors.New("invalid id")
	}
	return u.repo.GetByID(id)
}

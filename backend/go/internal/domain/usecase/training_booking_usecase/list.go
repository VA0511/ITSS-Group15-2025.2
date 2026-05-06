package training_booking_usecase

import (
	"context"
	"gym-management/internal/domain/adapter"
	"gym-management/internal/domain/entity"
)

type IListTrainingBookingsUseCase interface {
	Execute(ctx context.Context) ([]*entity.TrainingBooking, error)
}

type ListTrainingBookingsUseCase struct {
	repo adapter.TrainingBookingRepository
}

func NewListTrainingBookingsUseCase(repo adapter.TrainingBookingRepository) IListTrainingBookingsUseCase {
	return &ListTrainingBookingsUseCase{repo: repo}
}

func (u *ListTrainingBookingsUseCase) Execute(ctx context.Context) ([]*entity.TrainingBooking, error) {
	return u.repo.GetAll()
}

package training_booking_usecase

import (
	"context"
	"gym-management/internal/domain/adapter"
	"gym-management/internal/domain/entity"
)

type TrainingBookingUsecase interface {
	CreateTrainingBooking(trainingBooking *entity.TrainingBooking) error
	GetTrainingBookingByID(id int) (*entity.TrainingBooking, error)
	GetAllTrainingBookings() ([]*entity.TrainingBooking, error)
	UpdateTrainingBooking(trainingBooking *entity.TrainingBooking) error
	DeleteTrainingBooking(id int) error
}

type trainingBookingUsecase struct {
	create ICreateTrainingBookingUseCase
	get    IGetTrainingBookingUseCase
	list   IListTrainingBookingsUseCase
	update IUpdateTrainingBookingUseCase
	delete IDeleteTrainingBookingUseCase
}

func NewTrainingBookingUsecase(repo adapter.TrainingBookingRepository) TrainingBookingUsecase {
	return &trainingBookingUsecase{
		create: NewCreateTrainingBookingUseCase(repo),
		get:    NewGetTrainingBookingUseCase(repo),
		list:   NewListTrainingBookingsUseCase(repo),
		update: NewUpdateTrainingBookingUseCase(repo),
		delete: NewDeleteTrainingBookingUseCase(repo),
	}
}

func (u *trainingBookingUsecase) CreateTrainingBooking(trainingBooking *entity.TrainingBooking) error {
	created, err := u.create.Execute(context.Background(), trainingBooking)
	if err != nil {
		return err
	}
	*trainingBooking = *created
	return nil
}

func (u *trainingBookingUsecase) GetTrainingBookingByID(id int) (*entity.TrainingBooking, error) {
	return u.get.Execute(context.Background(), id)
}

func (u *trainingBookingUsecase) GetAllTrainingBookings() ([]*entity.TrainingBooking, error) {
	return u.list.Execute(context.Background())
}

func (u *trainingBookingUsecase) UpdateTrainingBooking(trainingBooking *entity.TrainingBooking) error {
	updated, err := u.update.Execute(context.Background(), trainingBooking)
	if err != nil {
		return err
	}
	*trainingBooking = *updated
	return nil
}

func (u *trainingBookingUsecase) DeleteTrainingBooking(id int) error {
	return u.delete.Execute(context.Background(), id)
}

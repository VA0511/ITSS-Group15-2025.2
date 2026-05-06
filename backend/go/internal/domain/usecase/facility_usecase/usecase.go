package facility_usecase

import (
	"context"
	"gym-management/internal/domain/adapter"
	"gym-management/internal/domain/entity"
)

type FacilityUsecase interface {
	CreateFacility(facility *entity.Facility) error
	GetFacilityByID(id int) (*entity.Facility, error)
	GetAllFacilities() ([]*entity.Facility, error)
	GetAllFacilitiesPaginated(page, limit int) ([]*entity.Facility, int, error)
	UpdateFacility(facility *entity.Facility) error
	UpdateFacilityStatus(id int, status string) error
	DeleteFacility(id int) error
}

type facilityUsecase struct {
	create        ICreateFacilityUseCase
	get           IGetFacilityUseCase
	list          IListFacilitiesUseCase
	listPaginated IListFacilitiesPaginatedUseCase
	update        IUpdateFacilityUseCase
	updateStatus  IUpdateFacilityStatusUseCase
	delete        IDeleteFacilityUseCase
}

func NewFacilityUsecase(repo adapter.FacilityRepository) FacilityUsecase {
	return &facilityUsecase{
		create:        NewCreateFacilityUseCase(repo),
		get:           NewGetFacilityUseCase(repo),
		list:          NewListFacilitiesUseCase(repo),
		listPaginated: NewListFacilitiesPaginatedUseCase(repo),
		update:        NewUpdateFacilityUseCase(repo),
		updateStatus:  NewUpdateFacilityStatusUseCase(repo),
		delete:        NewDeleteFacilityUseCase(repo),
	}
}

func (u *facilityUsecase) CreateFacility(facility *entity.Facility) error {
	created, err := u.create.Execute(context.Background(), facility)
	if err != nil {
		return err
	}
	*facility = *created
	return nil
}

func (u *facilityUsecase) GetFacilityByID(id int) (*entity.Facility, error) {
	return u.get.Execute(context.Background(), id)
}

func (u *facilityUsecase) GetAllFacilities() ([]*entity.Facility, error) {
	return u.list.Execute(context.Background())
}

func (u *facilityUsecase) GetAllFacilitiesPaginated(page, limit int) ([]*entity.Facility, int, error) {
	return u.listPaginated.Execute(context.Background(), page, limit)
}

func (u *facilityUsecase) UpdateFacility(facility *entity.Facility) error {
	updated, err := u.update.Execute(context.Background(), facility)
	if err != nil {
		return err
	}
	*facility = *updated
	return nil
}

func (u *facilityUsecase) UpdateFacilityStatus(id int, status string) error {
	return u.updateStatus.Execute(context.Background(), id, status)
}

func (u *facilityUsecase) DeleteFacility(id int) error {
	return u.delete.Execute(context.Background(), id)
}

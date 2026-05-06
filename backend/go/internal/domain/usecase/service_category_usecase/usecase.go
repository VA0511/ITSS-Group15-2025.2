package service_category_usecase

import (
	"context"
	"gym-management/internal/domain/adapter"
	"gym-management/internal/domain/entity"
)

type ServiceCategoryUsecase interface {
	CreateServiceCategory(serviceCategory *entity.ServiceCategory) error
	GetServiceCategoryByID(id int) (*entity.ServiceCategory, error)
	GetAllServiceCategories() ([]*entity.ServiceCategory, error)
	UpdateServiceCategory(serviceCategory *entity.ServiceCategory) error
	DeleteServiceCategory(id int) error
}

type serviceCategoryUsecase struct {
	create ICreateServiceCategoryUseCase
	get    IGetServiceCategoryUseCase
	list   IListServiceCategoriesUseCase
	update IUpdateServiceCategoryUseCase
	delete IDeleteServiceCategoryUseCase
}

func NewServiceCategoryUsecase(repo adapter.ServiceCategoryRepository) ServiceCategoryUsecase {
	return &serviceCategoryUsecase{
		create: NewCreateServiceCategoryUseCase(repo),
		get:    NewGetServiceCategoryUseCase(repo),
		list:   NewListServiceCategoriesUseCase(repo),
		update: NewUpdateServiceCategoryUseCase(repo),
		delete: NewDeleteServiceCategoryUseCase(repo),
	}
}

func (u *serviceCategoryUsecase) CreateServiceCategory(serviceCategory *entity.ServiceCategory) error {
	created, err := u.create.Execute(context.Background(), serviceCategory)
	if err != nil {
		return err
	}
	*serviceCategory = *created
	return nil
}

func (u *serviceCategoryUsecase) GetServiceCategoryByID(id int) (*entity.ServiceCategory, error) {
	return u.get.Execute(context.Background(), id)
}

func (u *serviceCategoryUsecase) GetAllServiceCategories() ([]*entity.ServiceCategory, error) {
	return u.list.Execute(context.Background())
}

func (u *serviceCategoryUsecase) UpdateServiceCategory(serviceCategory *entity.ServiceCategory) error {
	updated, err := u.update.Execute(context.Background(), serviceCategory)
	if err != nil {
		return err
	}
	*serviceCategory = *updated
	return nil
}

func (u *serviceCategoryUsecase) DeleteServiceCategory(id int) error {
	return u.delete.Execute(context.Background(), id)
}

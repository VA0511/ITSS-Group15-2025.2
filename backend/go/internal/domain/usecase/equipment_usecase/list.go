package equipment_usecase

import (
	"context"
	"gym-management/internal/domain/adapter"
	"gym-management/internal/domain/entity"
)

type IListEquipmentsUseCase interface {
	Execute(ctx context.Context) ([]*entity.Equipment, error)
}

type IListEquipmentsPaginatedUseCase interface {
	Execute(ctx context.Context, page, limit int) ([]*entity.Equipment, int, error)
}

type ListEquipmentsUseCase struct {
	repo adapter.EquipmentRepository
}

func NewListEquipmentsUseCase(repo adapter.EquipmentRepository) IListEquipmentsUseCase {
	return &ListEquipmentsUseCase{repo: repo}
}

func (u *ListEquipmentsUseCase) Execute(ctx context.Context) ([]*entity.Equipment, error) {
	return u.repo.GetAll()
}

type ListEquipmentsPaginatedUseCase struct {
	repo adapter.EquipmentRepository
}

func NewListEquipmentsPaginatedUseCase(repo adapter.EquipmentRepository) IListEquipmentsPaginatedUseCase {
	return &ListEquipmentsPaginatedUseCase{repo: repo}
}

func (u *ListEquipmentsPaginatedUseCase) Execute(ctx context.Context, page, limit int) ([]*entity.Equipment, int, error) {
	return u.repo.GetAllPaginated(page, limit)
}

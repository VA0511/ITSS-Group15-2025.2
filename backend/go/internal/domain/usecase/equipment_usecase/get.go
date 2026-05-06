package equipment_usecase

import (
	"context"
	"errors"
	"gym-management/internal/domain/adapter"
	"gym-management/internal/domain/entity"
)

type IGetEquipmentUseCase interface {
	Execute(ctx context.Context, id int) (*entity.Equipment, error)
}

type GetEquipmentUseCase struct {
	repo adapter.EquipmentRepository
}

func NewGetEquipmentUseCase(repo adapter.EquipmentRepository) IGetEquipmentUseCase {
	return &GetEquipmentUseCase{repo: repo}
}

func (u *GetEquipmentUseCase) Execute(ctx context.Context, id int) (*entity.Equipment, error) {
	if id <= 0 {
		return nil, errors.New("invalid id")
	}
	return u.repo.GetByID(id)
}

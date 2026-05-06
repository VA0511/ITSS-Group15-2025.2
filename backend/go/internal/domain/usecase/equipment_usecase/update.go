package equipment_usecase

import (
	"context"
	"errors"
	"gym-management/internal/domain/adapter"
	"gym-management/internal/domain/entity"
)

type IUpdateEquipmentUseCase interface {
	Execute(ctx context.Context, equipment *entity.Equipment) (*entity.Equipment, error)
}

type UpdateEquipmentUseCase struct {
	repo adapter.EquipmentRepository
}

func NewUpdateEquipmentUseCase(repo adapter.EquipmentRepository) IUpdateEquipmentUseCase {
	return &UpdateEquipmentUseCase{repo: repo}
}

func (u *UpdateEquipmentUseCase) Execute(ctx context.Context, equipment *entity.Equipment) (*entity.Equipment, error) {
	if equipment.ID <= 0 {
		return nil, errors.New("invalid id")
	}
	if err := u.repo.Update(equipment); err != nil {
		return nil, err
	}
	return equipment, nil
}

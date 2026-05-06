package equipment_usecase

import (
	"context"
	"gym-management/internal/domain/adapter"
	"gym-management/internal/domain/entity"
)

type ICreateEquipmentUseCase interface {
	Execute(ctx context.Context, equipment *entity.Equipment) (*entity.Equipment, error)
}

type CreateEquipmentUseCase struct {
	repo adapter.EquipmentRepository
}

func NewCreateEquipmentUseCase(repo adapter.EquipmentRepository) ICreateEquipmentUseCase {
	return &CreateEquipmentUseCase{repo: repo}
}

func (u *CreateEquipmentUseCase) Execute(ctx context.Context, equipment *entity.Equipment) (*entity.Equipment, error) {

	err := u.repo.Create(equipment)
	return equipment, err
}

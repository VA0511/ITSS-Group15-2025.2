package equipment_usecase

import (
	"context"
	"errors"
	"gym-management/internal/domain/adapter"
)

type IDeleteEquipmentUseCase interface {
	Execute(ctx context.Context, id int) error
}

type DeleteEquipmentUseCase struct {
	repo adapter.EquipmentRepository
}

func NewDeleteEquipmentUseCase(repo adapter.EquipmentRepository) IDeleteEquipmentUseCase {
	return &DeleteEquipmentUseCase{repo: repo}
}

func (u *DeleteEquipmentUseCase) Execute(ctx context.Context, id int) error {
	if id <= 0 {
		return errors.New("invalid id")
	}
	return u.repo.Delete(id)
}

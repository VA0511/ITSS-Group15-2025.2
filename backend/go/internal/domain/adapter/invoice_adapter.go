package adapter

import "gym-management/internal/domain/entity"

type InvoiceRepository interface {
	GetAllTransactions() ([]*entity.InvoiceTransaction, error)
}

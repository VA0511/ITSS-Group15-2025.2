package invoice_usecase

import (
	"gym-management/internal/domain/adapter"
	"gym-management/internal/domain/entity"
)

type InvoiceUsecase interface {
	GetAllTransactions() ([]*entity.InvoiceTransaction, error)
}

type invoiceUsecase struct {
	repo adapter.InvoiceRepository
}

func NewInvoiceUsecase(repo adapter.InvoiceRepository) InvoiceUsecase {
	return &invoiceUsecase{repo: repo}
}

func (u *invoiceUsecase) GetAllTransactions() ([]*entity.InvoiceTransaction, error) {
	return u.repo.GetAllTransactions()
}

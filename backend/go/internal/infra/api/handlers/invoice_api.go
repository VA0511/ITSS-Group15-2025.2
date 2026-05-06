package handlers

import (
	"encoding/json"
	"net/http"

	"gym-management/internal/domain/usecase/invoice_usecase"
)

type InvoiceHandler struct {
	usecase invoice_usecase.InvoiceUsecase
}

func NewInvoiceHandler(u invoice_usecase.InvoiceUsecase) *InvoiceHandler {
	return &InvoiceHandler{usecase: u}
}

func (h *InvoiceHandler) GetTransactions(w http.ResponseWriter, r *http.Request) {
	transactions, err := h.usecase.GetAllTransactions()
	if err != nil {
		http.Error(w, err.Error(), http.StatusInternalServerError)
		return
	}

	w.Header().Set("Content-Type", "application/json")
	json.NewEncoder(w).Encode(transactions)
}

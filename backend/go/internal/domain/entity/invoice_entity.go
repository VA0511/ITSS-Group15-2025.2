package entity

import "time"

type InvoiceTransaction struct {
	ID             int       `json:"id"`
	Type           string    `json:"type"`
	CustomerName   string    `json:"customerName"`
	Phone          string    `json:"phone"`
	PackageName    string    `json:"package"`
	Date           time.Time `json:"date"`
	Amount         float64   `json:"amount"`
	Status         string    `json:"status"`
	PaymentMethod  string    `json:"paymentMethod"`
	Notes          string    `json:"notes"`
	MemberID       int       `json:"memberId"`
	SubscriptionID int       `json:"subscriptionId"`
}

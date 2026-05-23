package entity

import "time"

type Invoice struct {
	ID             int       `json:"id"`
	MemberID       int       `json:"member_id"`
	SubscriptionID int       `json:"subscription_id"`
	InvoiceDate    time.Time `json:"invoice_date"`
	TotalAmount    float64   `json:"total_amount"`
	PaymentStatus  string    `json:"payment_status"`
	PaymentMethod  string    `json:"payment_method"`
	Notes          string    `json:"notes"`
}

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

package repository

import (
	"database/sql"
	"gym-management/internal/domain/entity"
)

type InvoiceRepository interface {
	GetAllTransactions() ([]*entity.InvoiceTransaction, error)
	CreateInvoice(invoice *entity.Invoice) error
}

type invoiceRepository struct {
	db *sql.DB
}

func NewInvoiceRepository(db *sql.DB) InvoiceRepository {
	return &invoiceRepository{db: db}
}

func (r *invoiceRepository) GetAllTransactions() ([]*entity.InvoiceTransaction, error) {
	query := `
		WITH ranked_invoices AS (
			SELECT
				i.id,
				i.member_id,
				COALESCE(i.subscription_id, 0) AS subscription_id,
				COALESCE(m.full_name, '') AS customer_name,
				COALESCE(m.phone, '') AS phone,
				COALESCE(mp.package_name, '') AS package_name,
				i.invoice_date,
				i.total_amount,
				COALESCE(i.payment_status, '') AS payment_status,
				COALESCE(i.payment_method, '') AS payment_method,
				COALESCE(i.notes, '') AS notes,
				ROW_NUMBER() OVER (PARTITION BY i.member_id ORDER BY i.invoice_date, i.id) AS payment_number
			FROM "Invoice" i
			LEFT JOIN "Member" m ON m.id = i.member_id
			LEFT JOIN "Subscription" s ON s.id = i.subscription_id
			LEFT JOIN "MembershipPackage" mp ON mp.id = s.package_id
		)
		SELECT
			id,
			member_id,
			subscription_id,
			customer_name,
			phone,
			package_name,
			invoice_date,
			total_amount,
			payment_status,
			payment_method,
			notes,
			CASE WHEN payment_number = 1 THEN 'registration' ELSE 'renewal' END AS transaction_type
		FROM ranked_invoices
		ORDER BY invoice_date DESC, id DESC`

	rows, err := r.db.Query(query)
	if err != nil {
		return nil, err
	}
	defer rows.Close()

	var transactions []*entity.InvoiceTransaction
	for rows.Next() {
		var transaction entity.InvoiceTransaction
		if err := rows.Scan(
			&transaction.ID,
			&transaction.MemberID,
			&transaction.SubscriptionID,
			&transaction.CustomerName,
			&transaction.Phone,
			&transaction.PackageName,
			&transaction.Date,
			&transaction.Amount,
			&transaction.Status,
			&transaction.PaymentMethod,
			&transaction.Notes,
			&transaction.Type,
		); err != nil {
			return nil, err
		}
		transactions = append(transactions, &transaction)
	}

	if err := rows.Err(); err != nil {
		return nil, err
	}

	return transactions, nil
}

func (r *invoiceRepository) CreateInvoice(invoice *entity.Invoice) error {
	query := `INSERT INTO "Invoice" (member_id, subscription_id, total_amount, payment_status, payment_method, notes)
	          VALUES ($1, $2, $3, $4, $5, $6) RETURNING id, invoice_date`
	return r.db.QueryRow(query,
		invoice.MemberID, invoice.SubscriptionID, invoice.TotalAmount,
		invoice.PaymentStatus, invoice.PaymentMethod, invoice.Notes,
	).Scan(&invoice.ID, &invoice.InvoiceDate)
}

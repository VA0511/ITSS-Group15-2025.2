package repository

import (
	"database/sql"
	"gym-management/internal/domain/entity"
)

type SubscriptionRepository interface {
	Create(subscription *entity.Subscription) error
	GetByID(id int) (*entity.Subscription, error)
	GetByMemberID(memberID int, page, limit int) ([]*entity.SubscriptionHistory, int, error)
	GetAll() ([]*entity.Subscription, error)
	Update(subscription *entity.Subscription) error
	Delete(id int) error
}

type subscriptionRepository struct {
	db *sql.DB
}

func NewSubscriptionRepository(db *sql.DB) SubscriptionRepository {
	return &subscriptionRepository{db: db}
}

func (r *subscriptionRepository) Create(subscription *entity.Subscription) error {
	query := `INSERT INTO "Subscription" (member_id, package_id, registration_date, start_date, end_date, status) VALUES ($1, $2, $3, $4, $5, $6) RETURNING id`
	return r.db.QueryRow(query, subscription.MemberID, subscription.PackageID, subscription.RegistrationDate, subscription.StartDate, subscription.EndDate, subscription.Status).Scan(&subscription.ID)
}

func (r *subscriptionRepository) GetByID(id int) (*entity.Subscription, error) {
	query := `SELECT id, member_id, package_id, registration_date, start_date, end_date, status FROM "Subscription" WHERE id = $1`
	row := r.db.QueryRow(query, id)

	var subscription entity.Subscription
	err := row.Scan(&subscription.ID, &subscription.MemberID, &subscription.PackageID, &subscription.RegistrationDate, &subscription.StartDate, &subscription.EndDate, &subscription.Status)
	if err != nil {
		return nil, err
	}

	return &subscription, nil
}

func (r *subscriptionRepository) GetAll() ([]*entity.Subscription, error) {
	query := `SELECT id, member_id, package_id, registration_date, start_date, end_date, status FROM "Subscription"`
	rows, err := r.db.Query(query)
	if err != nil {
		return nil, err
	}
	defer rows.Close()

	var subscriptions []*entity.Subscription
	for rows.Next() {
		var subscription entity.Subscription
		err := rows.Scan(&subscription.ID, &subscription.MemberID, &subscription.PackageID, &subscription.RegistrationDate, &subscription.StartDate, &subscription.EndDate, &subscription.Status)
		if err != nil {
			return nil, err
		}
		subscriptions = append(subscriptions, &subscription)
	}

	return subscriptions, nil
}

func (r *subscriptionRepository) Update(subscription *entity.Subscription) error {
	query := `UPDATE "Subscription" SET member_id = $1, package_id = $2, registration_date = $3, start_date = $4, end_date = $5, status = $6 WHERE id = $7`
	_, err := r.db.Exec(query, subscription.MemberID, subscription.PackageID, subscription.RegistrationDate, subscription.StartDate, subscription.EndDate, subscription.Status, subscription.ID)
	return err
}

func (r *subscriptionRepository) GetByMemberID(memberID int, page, limit int) ([]*entity.SubscriptionHistory, int, error) {
	// Count total items
	var total int
	countQuery := `SELECT COUNT(*) FROM "Subscription" WHERE member_id = $1`
	err := r.db.QueryRow(countQuery, memberID).Scan(&total)
	if err != nil {
		return nil, 0, err
	}

	// Calculate offset
	offset := (page - 1) * limit

	query := `SELECT s.id, p.package_name, s.registration_date, s.start_date, s.end_date, s.status, p.price
	FROM "Subscription" s
	LEFT JOIN "MembershipPackage" p ON s.package_id = p.id
	WHERE s.member_id = $1
	ORDER BY s.registration_date DESC LIMIT $2 OFFSET $3`
	rows, err := r.db.Query(query, memberID, limit, offset)
	if err != nil {
		return nil, 0, err
	}
	defer rows.Close()

	var histories []*entity.SubscriptionHistory
	for rows.Next() {
		var history entity.SubscriptionHistory
		err := rows.Scan(&history.ID, &history.PackageName, &history.RegistrationDate, &history.StartDate, &history.EndDate, &history.Status, &history.Price)
		if err != nil {
			return nil, 0, err
		}
		histories = append(histories, &history)
	}

	return histories, total, nil
}

func (r *subscriptionRepository) Delete(id int) error {
	query := `DELETE FROM "Subscription" WHERE id = $1`
	_, err := r.db.Exec(query, id)
	return err
}

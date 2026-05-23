package repository

import (
	"database/sql"
	"time"

	"gym-management/internal/domain/entity"
)

type SubscriptionRepository interface {
	Create(subscription *entity.Subscription) error
	GetByID(id int) (*entity.Subscription, error)
	GetByMemberID(memberID int, page, limit int) ([]*entity.SubscriptionHistory, int, error)
	GetAll() ([]*entity.Subscription, error)
	Update(subscription *entity.Subscription) error
	Delete(id int) error
	GetActiveByMemberID(memberID int) (*entity.Subscription, error)
	GetActiveByMemberIDAndCategoryID(memberID, categoryID int) (*entity.Subscription, error)
	Renew(id int, newEndDate time.Time) error
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

	query := `SELECT s.id, s.package_id, COALESCE(sc.id, 0), COALESCE(sc.category_name, ''), p.package_name,
	          s.registration_date, s.start_date, s.end_date, s.status, COALESCE(p.price, 0)
	FROM "Subscription" s
	LEFT JOIN "MembershipPackage" p ON s.package_id = p.id
	LEFT JOIN "ServiceCategory" sc ON p.category_id = sc.id
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
		err := rows.Scan(&history.ID, &history.PackageID, &history.CategoryID, &history.CategoryName,
			&history.PackageName, &history.RegistrationDate, &history.StartDate, &history.EndDate,
			&history.Status, &history.Price)
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

func (r *subscriptionRepository) Renew(id int, newEndDate time.Time) error {
	query := `UPDATE "Subscription" SET end_date = $1, status = 'active' WHERE id = $2`
	result, err := r.db.Exec(query, newEndDate, id)
	if err != nil {
		return err
	}
	rows, _ := result.RowsAffected()
	if rows == 0 {
		return sql.ErrNoRows
	}
	return nil
}

func (r *subscriptionRepository) GetActiveByMemberID(memberID int) (*entity.Subscription, error) {
	query := `SELECT id, member_id, package_id, registration_date, start_date, end_date, status FROM "Subscription" WHERE member_id = $1 AND end_date >= CURRENT_DATE AND status = 'active' LIMIT 1`
	row := r.db.QueryRow(query, memberID)
	var sub entity.Subscription
	err := row.Scan(&sub.ID, &sub.MemberID, &sub.PackageID, &sub.RegistrationDate, &sub.StartDate, &sub.EndDate, &sub.Status)
	if err == sql.ErrNoRows {
		return nil, nil
	}
	if err != nil {
		return nil, err
	}
	return &sub, nil
}

func (r *subscriptionRepository) GetActiveByMemberIDAndCategoryID(memberID, categoryID int) (*entity.Subscription, error) {
	query := `SELECT s.id, s.member_id, s.package_id, s.registration_date, s.start_date, s.end_date, s.status
	          FROM "Subscription" s
	          JOIN "MembershipPackage" mp ON s.package_id = mp.id
	          WHERE s.member_id = $1 AND mp.category_id = $2
	            AND s.end_date >= CURRENT_DATE AND s.status = 'active'
	          LIMIT 1`
	row := r.db.QueryRow(query, memberID, categoryID)
	var sub entity.Subscription
	err := row.Scan(&sub.ID, &sub.MemberID, &sub.PackageID, &sub.RegistrationDate, &sub.StartDate, &sub.EndDate, &sub.Status)
	if err == sql.ErrNoRows {
		return nil, nil
	}
	if err != nil {
		return nil, err
	}
	return &sub, nil
}

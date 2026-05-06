package repository

import (
	"database/sql"
	"gym-management/internal/domain/entity"
)

type AccountRepository interface {
	Create(account *entity.Account) error
	GetByID(id int) (*entity.Account, error)
	GetAll() ([]*entity.Account, error)
	GetAllPaginated(page, limit int) ([]*entity.Account, int, error)
	Update(account *entity.Account) error
	Delete(id int) error
}

type accountRepository struct {
	db *sql.DB
}

func NewAccountRepository(db *sql.DB) AccountRepository {
	return &accountRepository{db: db}
}

func (r *accountRepository) Create(account *entity.Account) error {
	query := `INSERT INTO "Account" (username, password, role_id) VALUES ($1, $2, $3) RETURNING id`
	return r.db.QueryRow(query, account.Username, account.Password, account.RoleID).Scan(&account.ID)
}

func (r *accountRepository) GetByID(id int) (*entity.Account, error) {
	query := `SELECT id, username, password, role_id FROM "Account" WHERE id = $1`
	row := r.db.QueryRow(query, id)

	var account entity.Account
	err := row.Scan(&account.ID, &account.Username, &account.Password, &account.RoleID)
	if err != nil {
		return nil, err
	}

	return &account, nil
}

func (r *accountRepository) GetAll() ([]*entity.Account, error) {
	query := `SELECT id, username, password, role_id FROM "Account" WHERE role_id != 4`
	rows, err := r.db.Query(query)
	if err != nil {
		return nil, err
	}
	defer rows.Close()

	var accounts []*entity.Account
	for rows.Next() {
		var account entity.Account
		err := rows.Scan(&account.ID, &account.Username, &account.Password, &account.RoleID)
		if err != nil {
			return nil, err
		}
		accounts = append(accounts, &account)
	}

	return accounts, nil
}

func (r *accountRepository) GetAllPaginated(page, limit int) ([]*entity.Account, int, error) {
	// Count total items
	var total int
	countQuery := `SELECT COUNT(*) FROM "Account" WHERE role_id != 4`
	err := r.db.QueryRow(countQuery).Scan(&total)
	if err != nil {
		return nil, 0, err
	}

	// Calculate offset
	offset := (page - 1) * limit

	// Get paginated data (exclude password from results for security, exclude MEMBER role)
	query := `SELECT id, username, role_id FROM "Account" WHERE role_id != 4 ORDER BY id LIMIT $1 OFFSET $2`
	rows, err := r.db.Query(query, limit, offset)
	if err != nil {
		return nil, 0, err
	}
	defer rows.Close()

	var accounts []*entity.Account
	for rows.Next() {
		var account entity.Account
		err := rows.Scan(&account.ID, &account.Username, &account.RoleID)
		if err != nil {
			return nil, 0, err
		}
		accounts = append(accounts, &account)
	}
	return accounts, total, nil
}

func (r *accountRepository) Update(account *entity.Account) error {
	query := `UPDATE "Account" SET username = $1, password = $2, role_id = $3 WHERE id = $4`
	_, err := r.db.Exec(query, account.Username, account.Password, account.RoleID, account.ID)
	return err
}

func (r *accountRepository) Delete(id int) error {
	query := `DELETE FROM "Account" WHERE id = $1`
	_, err := r.db.Exec(query, id)
	return err
}

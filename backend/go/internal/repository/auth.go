package repository

import (
	"context"
	"database/sql"
	"errors"
	"strings"

	"gym-management/internal/domain/adapter"
	"gym-management/internal/domain/entity"
)

type authRepository struct {
	db *sql.DB
}

var _ adapter.AuthRepository = (*authRepository)(nil)

func NewAuthRepository(db *sql.DB) adapter.AuthRepository {
	return &authRepository{db: db}
}

func (r *authRepository) CreateAccount(ctx context.Context, account *entity.Account) error {
	if account == nil {
		return errors.New("account cannot be nil")
	}
	if account.Username == "" {
		return errors.New("username cannot be empty")
	}
	if account.Password == "" {
		return errors.New("password cannot be empty")
	}
	if account.RoleID <= 0 {
		return errors.New("invalid role id")
	}

	query := `INSERT INTO "Account" (username, password, role_id) VALUES ($1, $2, $3) RETURNING id`
	return r.db.QueryRowContext(ctx, query, account.Username, account.Password, account.RoleID).Scan(&account.ID)
}

func (r *authRepository) FindAccountByUsername(ctx context.Context, username string) (*entity.Account, error) {
	if username == "" {
		return nil, errors.New("username cannot be empty")
	}

	query := `SELECT id, username, password, role_id FROM "Account" WHERE username = $1`
	account := &entity.Account{}
	err := r.db.QueryRowContext(ctx, query, username).Scan(
		&account.ID,
		&account.Username,
		&account.Password,
		&account.RoleID,
	)
	if err != nil {
		return nil, err
	}

	return account, nil
}

func (r *authRepository) GetRoleNameByID(ctx context.Context, roleID int) (string, error) {
	if roleID <= 0 {
		return "", errors.New("invalid role id")
	}

	query := `SELECT role_name FROM "Role" WHERE id = $1`
	var roleName string
	err := r.db.QueryRowContext(ctx, query, roleID).Scan(&roleName)
	if err != nil {
		return "", err
	}

	return roleName, nil
}

func (r *authRepository) GetRoleIDByName(ctx context.Context, roleName string) (int, error) {
	name := strings.ToUpper(strings.TrimSpace(roleName))
	if name == "" {
		return 0, errors.New("role name cannot be empty")
	}

	query := `SELECT id FROM "Role" WHERE UPPER(role_name) = $1`
	var roleID int
	err := r.db.QueryRowContext(ctx, query, name).Scan(&roleID)
	if err != nil {
		return 0, err
	}

	return roleID, nil
}

func (r *authRepository) SaveRefreshToken(ctx context.Context, record *adapter.RefreshTokenRecord) error {
	if record == nil {
		return errors.New("refresh token record cannot be nil")
	}
	if record.TokenHash == "" {
		return errors.New("token hash cannot be empty")
	}
	if record.AccountID <= 0 {
		return errors.New("invalid account id")
	}
	if record.ExpiresAt.IsZero() {
		return errors.New("expires at cannot be empty")
	}

	query := `
		INSERT INTO "AuthRefreshToken" (token_hash, account_id, expires_at, revoked_at)
		VALUES ($1, $2, $3, $4)
	`
	_, err := r.db.ExecContext(ctx, query, record.TokenHash, record.AccountID, record.ExpiresAt, record.RevokedAt)
	return err
}

func (r *authRepository) GetRefreshToken(ctx context.Context, tokenHash string) (*adapter.RefreshTokenRecord, error) {
	if tokenHash == "" {
		return nil, errors.New("token hash cannot be empty")
	}

	query := `
		SELECT token_hash, account_id, expires_at, revoked_at
		FROM "AuthRefreshToken"
		WHERE token_hash = $1
	`

	record := &adapter.RefreshTokenRecord{}
	var revokedAt sql.NullTime
	err := r.db.QueryRowContext(ctx, query, tokenHash).Scan(
		&record.TokenHash,
		&record.AccountID,
		&record.ExpiresAt,
		&revokedAt,
	)
	if err != nil {
		return nil, err
	}

	if revokedAt.Valid {
		record.RevokedAt = &revokedAt.Time
	}

	return record, nil
}

func (r *authRepository) RevokeRefreshToken(ctx context.Context, tokenHash string) error {
	if tokenHash == "" {
		return errors.New("token hash cannot be empty")
	}

	query := `
		UPDATE "AuthRefreshToken"
		SET revoked_at = CURRENT_TIMESTAMP
		WHERE token_hash = $1 AND revoked_at IS NULL
	`
	_, err := r.db.ExecContext(ctx, query, tokenHash)
	return err
}

func (r *authRepository) RotateRefreshToken(ctx context.Context, oldTokenHash string, newRecord *adapter.RefreshTokenRecord) error {
	if oldTokenHash == "" {
		return errors.New("old token hash cannot be empty")
	}
	if newRecord == nil {
		return errors.New("new refresh token record cannot be nil")
	}
	if newRecord.TokenHash == "" {
		return errors.New("new token hash cannot be empty")
	}
	if newRecord.AccountID <= 0 {
		return errors.New("invalid account id")
	}
	if newRecord.ExpiresAt.IsZero() {
		return errors.New("expires at cannot be empty")
	}

	tx, err := r.db.BeginTx(ctx, nil)
	if err != nil {
		return err
	}

	defer func() {
		if tx != nil {
			_ = tx.Rollback()
		}
	}()

	revokeQuery := `
		UPDATE "AuthRefreshToken"
		SET revoked_at = CURRENT_TIMESTAMP
		WHERE token_hash = $1 AND revoked_at IS NULL
	`
	if _, err := tx.ExecContext(ctx, revokeQuery, oldTokenHash); err != nil {
		return err
	}

	insertQuery := `
		INSERT INTO "AuthRefreshToken" (token_hash, account_id, expires_at, revoked_at)
		VALUES ($1, $2, $3, $4)
	`
	if _, err := tx.ExecContext(ctx, insertQuery, newRecord.TokenHash, newRecord.AccountID, newRecord.ExpiresAt, newRecord.RevokedAt); err != nil {
		return err
	}

	if err := tx.Commit(); err != nil {
		return err
	}
	tx = nil

	return nil
}

func (r *authRepository) RevokeAllRefreshTokensByAccountID(ctx context.Context, accountID int) error {
	if accountID <= 0 {
		return errors.New("invalid account id")
	}

	query := `
		UPDATE "AuthRefreshToken"
		SET revoked_at = CURRENT_TIMESTAMP
		WHERE account_id = $1 AND revoked_at IS NULL
	`
	_, err := r.db.ExecContext(ctx, query, accountID)
	return err
}

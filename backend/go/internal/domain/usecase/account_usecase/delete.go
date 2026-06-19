package account_usecase

import (
	"context"
	"database/sql"
	"errors"
	"gym-management/internal/domain/adapter"
)

type IDeleteAccountUseCase interface {
	Execute(ctx context.Context, id int) error
}

type DeleteAccountUseCase struct {
	repo     adapter.AccountRepository
	empRepo  adapter.EmployeeRepository
}

func NewDeleteAccountUseCase(repo adapter.AccountRepository, empRepo adapter.EmployeeRepository) IDeleteAccountUseCase {
	return &DeleteAccountUseCase{repo: repo, empRepo: empRepo}
}

func (u *DeleteAccountUseCase) Execute(ctx context.Context, id int) error {
	if id <= 0 {
		return errors.New("invalid id")
	}

	// Unlink the employee record that references this account (if any),
	// so the FK constraint doesn't block the deletion.
	// The employee's personal information is preserved; they just lose login access.
	emp, err := u.empRepo.GetByAccountID(id)
	if err == nil && emp != nil {
		emp.AccountID = 0 // maps to NULL in the repo's Update logic
		// Intentionally ignore errors here — even if unlinking fails,
		// we still attempt the account deletion.
		_ = u.empRepo.Update(emp)
	} else if err != nil && err != sql.ErrNoRows {
		// Unexpected DB error — surface it
		return err
	}

	return u.repo.Delete(id)
}

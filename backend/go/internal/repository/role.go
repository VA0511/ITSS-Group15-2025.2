package repository

import (
	"database/sql"
	"gym-management/internal/domain/adapter"
	"gym-management/internal/domain/entity"
)

type roleRepository struct {
	db *sql.DB
}

func NewRoleRepository(db *sql.DB) adapter.RoleRepository {
	return &roleRepository{db: db}
}

func (r *roleRepository) Create(role *entity.Role) error {
	query := `INSERT INTO "Role" (role_name) VALUES ($1) RETURNING id`
	return r.db.QueryRow(query, role.RoleName).Scan(&role.ID)
}

func (r *roleRepository) GetByID(id int) (*entity.Role, error) {
	role := &entity.Role{}
	query := `SELECT id, role_name FROM "Role" WHERE id = $1`
	err := r.db.QueryRow(query, id).Scan(&role.ID, &role.RoleName)
	return role, err
}

func (r *roleRepository) GetAll() ([]*entity.Role, error) {
	rows, err := r.db.Query(`SELECT id, role_name FROM "Role"`)
	if err != nil {
		return nil, err
	}
	defer rows.Close()
	var roles []*entity.Role
	for rows.Next() {
		role := &entity.Role{}
		err := rows.Scan(&role.ID, &role.RoleName)
		if err != nil {
			return nil, err
		}
		roles = append(roles, role)
	}
	return roles, nil
}

func (r *roleRepository) Update(role *entity.Role) error {
	query := `UPDATE "Role" SET role_name = $1 WHERE id = $2`
	_, err := r.db.Exec(query, role.RoleName, role.ID)
	return err
}

func (r *roleRepository) Delete(id int) error {
	_, err := r.db.Exec(`DELETE FROM "Role" WHERE id = $1`, id)
	return err
}

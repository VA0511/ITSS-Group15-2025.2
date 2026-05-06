package repository

import (
	"database/sql"
	"gym-management/internal/domain/entity"
)

type ServiceCategoryRepository interface {
	Create(serviceCategory *entity.ServiceCategory) error
	GetByID(id int) (*entity.ServiceCategory, error)
	GetAll() ([]*entity.ServiceCategory, error)
	Update(serviceCategory *entity.ServiceCategory) error
	Delete(id int) error
}

type serviceCategoryRepository struct {
	db *sql.DB
}

func NewServiceCategoryRepository(db *sql.DB) ServiceCategoryRepository {
	return &serviceCategoryRepository{db: db}
}

func (r *serviceCategoryRepository) Create(serviceCategory *entity.ServiceCategory) error {
	query := `INSERT INTO "ServiceCategory" (category_name, benefits_description, allowed_gender) VALUES ($1, $2, $3) RETURNING id`
	return r.db.QueryRow(query, serviceCategory.CategoryName, serviceCategory.BenefitsDescription, serviceCategory.AllowedGender).Scan(&serviceCategory.ID)
}

func (r *serviceCategoryRepository) GetByID(id int) (*entity.ServiceCategory, error) {
	query := `SELECT id, category_name, benefits_description, allowed_gender FROM "ServiceCategory" WHERE id = $1`
	row := r.db.QueryRow(query, id)

	var serviceCategory entity.ServiceCategory
	err := row.Scan(&serviceCategory.ID, &serviceCategory.CategoryName, &serviceCategory.BenefitsDescription, &serviceCategory.AllowedGender)
	if err != nil {
		return nil, err
	}

	return &serviceCategory, nil
}

func (r *serviceCategoryRepository) GetAll() ([]*entity.ServiceCategory, error) {
	query := `SELECT id, category_name, benefits_description, allowed_gender FROM "ServiceCategory"`
	rows, err := r.db.Query(query)
	if err != nil {
		return nil, err
	}
	defer rows.Close()

	var serviceCategories []*entity.ServiceCategory
	for rows.Next() {
		var serviceCategory entity.ServiceCategory
		err := rows.Scan(&serviceCategory.ID, &serviceCategory.CategoryName, &serviceCategory.BenefitsDescription, &serviceCategory.AllowedGender)
		if err != nil {
			return nil, err
		}
		serviceCategories = append(serviceCategories, &serviceCategory)
	}

	return serviceCategories, nil
}

func (r *serviceCategoryRepository) Update(serviceCategory *entity.ServiceCategory) error {
	query := `UPDATE "ServiceCategory" SET category_name = $1, benefits_description = $2, allowed_gender = $3 WHERE id = $4`
	_, err := r.db.Exec(query, serviceCategory.CategoryName, serviceCategory.BenefitsDescription, serviceCategory.AllowedGender, serviceCategory.ID)
	return err
}

func (r *serviceCategoryRepository) Delete(id int) error {
	query := `DELETE FROM "ServiceCategory" WHERE id = $1`
	_, err := r.db.Exec(query, id)
	return err
}

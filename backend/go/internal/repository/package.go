package repository

import (
	"database/sql"
	"gym-management/internal/domain/adapter"
	"gym-management/internal/domain/entity"
)

type packageRepository struct {
	db *sql.DB
}

func NewPackageRepository(db *sql.DB) adapter.MembershipPackageRepository {
	return &packageRepository{db: db}
}

func (r *packageRepository) Create(pkg *entity.MembershipPackage) error {
	var categoryID interface{} = pkg.CategoryID
	if pkg.CategoryID == 0 {
		categoryID = nil
	}
	query := `INSERT INTO "MembershipPackage" (category_id, package_name, duration_days, price) VALUES ($1, $2, $3, $4) RETURNING id`
	return r.db.QueryRow(query, categoryID, pkg.PackageName, pkg.DurationDays, pkg.Price).Scan(&pkg.ID)
}

func (r *packageRepository) GetByID(id int) (*entity.MembershipPackage, error) {
	pkg := &entity.MembershipPackage{}
	query := `SELECT p.id, COALESCE(p.category_id, 0), COALESCE(p.package_name, ''), COALESCE(p.duration_days, 0), COALESCE(p.price, 0), COALESCE(p.is_active, true), COALESCE(c.benefits_description, ''), COALESCE(c.category_name, ''), COALESCE(c.allowed_gender, 'All')
	FROM "MembershipPackage" p
	LEFT JOIN "ServiceCategory" c ON p.category_id = c.id
	WHERE p.id = $1`
	err := r.db.QueryRow(query, id).Scan(&pkg.ID, &pkg.CategoryID, &pkg.PackageName, &pkg.DurationDays, &pkg.Price, &pkg.IsActive, &pkg.Description, &pkg.CategoryName, &pkg.AllowedGender)
	return pkg, err
}

func (r *packageRepository) GetAll() ([]*entity.MembershipPackage, error) {
	query := `SELECT p.id, COALESCE(p.category_id, 0), COALESCE(p.package_name, ''), COALESCE(p.duration_days, 0), COALESCE(p.price, 0), COALESCE(p.is_active, true), COALESCE(c.benefits_description, ''), COALESCE(c.category_name, ''), COALESCE(c.allowed_gender, 'All')
	FROM "MembershipPackage" p
	LEFT JOIN "ServiceCategory" c ON p.category_id = c.id
	ORDER BY p.id DESC`
	rows, err := r.db.Query(query)
	if err != nil {
		return nil, err
	}
	defer rows.Close()
	var packages []*entity.MembershipPackage
	for rows.Next() {
		pkg := &entity.MembershipPackage{}
		err := rows.Scan(&pkg.ID, &pkg.CategoryID, &pkg.PackageName, &pkg.DurationDays, &pkg.Price, &pkg.IsActive, &pkg.Description, &pkg.CategoryName, &pkg.AllowedGender)
		if err != nil {
			return nil, err
		}
		packages = append(packages, pkg)
	}
	return packages, nil
}

func (r *packageRepository) GetAllPaginated(page, limit int) ([]*entity.MembershipPackage, int, error) {
	// Count total items
	var total int
	countQuery := `SELECT COUNT(*) FROM "MembershipPackage"`
	err := r.db.QueryRow(countQuery).Scan(&total)
	if err != nil {
		return nil, 0, err
	}

	// Calculate offset
	offset := (page - 1) * limit

	// Get paginated data
	query := `SELECT p.id, COALESCE(p.category_id, 0), COALESCE(p.package_name, ''), COALESCE(p.duration_days, 0), COALESCE(p.price, 0), COALESCE(p.is_active, true), COALESCE(c.benefits_description, ''), COALESCE(c.category_name, ''), COALESCE(c.allowed_gender, 'All')
	FROM "MembershipPackage" p
	LEFT JOIN "ServiceCategory" c ON p.category_id = c.id
	ORDER BY p.id DESC LIMIT $1 OFFSET $2`
	rows, err := r.db.Query(query, limit, offset)
	if err != nil {
		return nil, 0, err
	}
	defer rows.Close()

	var packages []*entity.MembershipPackage
	for rows.Next() {
		pkg := &entity.MembershipPackage{}
		err := rows.Scan(&pkg.ID, &pkg.CategoryID, &pkg.PackageName, &pkg.DurationDays, &pkg.Price, &pkg.IsActive, &pkg.Description, &pkg.CategoryName, &pkg.AllowedGender)
		if err != nil {
			return nil, 0, err
		}
		packages = append(packages, pkg)
	}
	return packages, total, nil
}

func (r *packageRepository) Update(pkg *entity.MembershipPackage) error {
	var categoryID interface{} = pkg.CategoryID
	if pkg.CategoryID == 0 {
		categoryID = nil
	}
	query := `UPDATE "MembershipPackage" SET category_id = $1, package_name = $2, duration_days = $3, price = $4, is_active = $5 WHERE id = $6`
	_, err := r.db.Exec(query, categoryID, pkg.PackageName, pkg.DurationDays, pkg.Price, pkg.IsActive, pkg.ID)
	return err
}

func (r *packageRepository) UpdateStatus(id int, isActive bool) error {
	_, err := r.db.Exec(`UPDATE "MembershipPackage" SET is_active = $1 WHERE id = $2`, isActive, id)
	return err
}

func (r *packageRepository) Delete(id int) error {
	_, err := r.db.Exec(`DELETE FROM "MembershipPackage" WHERE id = $1`, id)
	return err
}

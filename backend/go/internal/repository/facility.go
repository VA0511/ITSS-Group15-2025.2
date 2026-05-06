package repository

import (
	"database/sql"
	"gym-management/internal/domain/adapter"
	"gym-management/internal/domain/entity"
)

type facilityRepository struct {
	db *sql.DB
}

func NewFacilityRepository(db *sql.DB) adapter.FacilityRepository {
	return &facilityRepository{db: db}
}

func (r *facilityRepository) Create(facility *entity.Facility) error {
	query := `INSERT INTO "Facility" (facility_name, facility_type, status, description, max_capacity, current_capacity, amenities) VALUES ($1, $2, $3, $4, $5, $6, $7) RETURNING id`
	return r.db.QueryRow(query, facility.FacilityName, facility.FacilityType, facility.Status, facility.Description, facility.MaxCapacity, facility.CurrentCapacity, facility.Amenities).Scan(&facility.ID)
}

func (r *facilityRepository) GetByID(id int) (*entity.Facility, error) {
	facility := &entity.Facility{}
	query := `SELECT id, facility_name, facility_type, status, COALESCE(description, ''), COALESCE(max_capacity, 0), COALESCE(current_capacity, 0), COALESCE(amenities, '') FROM "Facility" WHERE id = $1`
	err := r.db.QueryRow(query, id).Scan(&facility.ID, &facility.FacilityName, &facility.FacilityType, &facility.Status, &facility.Description, &facility.MaxCapacity, &facility.CurrentCapacity, &facility.Amenities)
	return facility, err
}

func (r *facilityRepository) GetAll() ([]*entity.Facility, error) {
	rows, err := r.db.Query(`SELECT id, facility_name, facility_type, status, COALESCE(description, ''), COALESCE(max_capacity, 0), COALESCE(current_capacity, 0), COALESCE(amenities, '') FROM "Facility"`)
	if err != nil {
		return nil, err
	}
	defer rows.Close()
	var facilities []*entity.Facility
	for rows.Next() {
		facility := &entity.Facility{}
		err := rows.Scan(&facility.ID, &facility.FacilityName, &facility.FacilityType, &facility.Status, &facility.Description, &facility.MaxCapacity, &facility.CurrentCapacity, &facility.Amenities)
		if err != nil {
			return nil, err
		}
		facilities = append(facilities, facility)
	}
	return facilities, nil
}

func (r *facilityRepository) GetAllPaginated(page, limit int) ([]*entity.Facility, int, error) {
	// Count total items
	var total int
	countQuery := `SELECT COUNT(*) FROM "Facility"`
	err := r.db.QueryRow(countQuery).Scan(&total)
	if err != nil {
		return nil, 0, err
	}

	// Calculate offset
	offset := (page - 1) * limit

	// Get paginated data with capacity
	query := `SELECT id, facility_name, facility_type, status, COALESCE(description, ''), COALESCE(max_capacity, 0), COALESCE(current_capacity, 0), COALESCE(amenities, '') FROM "Facility" ORDER BY id DESC LIMIT $1 OFFSET $2`
	rows, err := r.db.Query(query, limit, offset)
	if err != nil {
		return nil, 0, err
	}
	defer rows.Close()

	var facilities []*entity.Facility
	for rows.Next() {
		facility := &entity.Facility{}
		err := rows.Scan(&facility.ID, &facility.FacilityName, &facility.FacilityType, &facility.Status, &facility.Description, &facility.MaxCapacity, &facility.CurrentCapacity, &facility.Amenities)
		if err != nil {
			return nil, 0, err
		}
		facilities = append(facilities, facility)
	}
	return facilities, total, nil
}

func (r *facilityRepository) Update(facility *entity.Facility) error {
	query := `UPDATE "Facility" SET facility_name = $1, facility_type = $2, status = $3, description = $4, max_capacity = $5, current_capacity = $6, amenities = $7 WHERE id = $8`
	_, err := r.db.Exec(query, facility.FacilityName, facility.FacilityType, facility.Status, facility.Description, facility.MaxCapacity, facility.CurrentCapacity, facility.Amenities, facility.ID)
	return err
}

func (r *facilityRepository) UpdateStatus(id int, status string) error {
	_, err := r.db.Exec(`UPDATE "Facility" SET status = $1 WHERE id = $2`, status, id)
	return err
}

func (r *facilityRepository) Delete(id int) error {
	_, err := r.db.Exec(`DELETE FROM "Facility" WHERE id = $1`, id)
	return err
}

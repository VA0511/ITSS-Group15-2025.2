package repository

import (
	"database/sql"
	"gym-management/internal/domain/adapter"
	"gym-management/internal/domain/entity"
)

type feedbackRepository struct {
	db *sql.DB
}

func NewFeedbackRepository(db *sql.DB) adapter.FeedbackRepository {
	return &feedbackRepository{db: db}
}

func (r *feedbackRepository) Create(feedback *entity.Feedback) error {
	var memberID interface{} = feedback.MemberID
	if feedback.MemberID == 0 {
		memberID = nil
	}
	var processorID interface{} = feedback.ProcessorID
	if feedback.ProcessorID == 0 {
		processorID = nil
	}
	var equipmentID interface{} = feedback.EquipmentID
	if feedback.EquipmentID == 0 {
		equipmentID = nil
	}
	query := `INSERT INTO "Feedback" (member_id, processor_id, equipment_id, content, sent_at, resolution_note, status, rating) VALUES ($1, $2, $3, $4, $5, $6, $7, $8) RETURNING id`
	return r.db.QueryRow(query, memberID, processorID, equipmentID, feedback.Content, feedback.SentAt, feedback.ResolutionNote, feedback.Status, feedback.Rating).Scan(&feedback.ID)
}

func (r *feedbackRepository) GetByID(id int) (*entity.Feedback, error) {
	feedback := &entity.Feedback{}
	query := `SELECT f.id, COALESCE(f.member_id, 0), COALESCE(m.full_name, 'Unknown'), COALESCE(f.processor_id, 0), COALESCE(f.equipment_id, 0), COALESCE(f.content, ''), f.sent_at, COALESCE(f.resolution_note, ''), COALESCE(f.status, ''), COALESCE(f.rating, 0)
	FROM "Feedback" f
	LEFT JOIN "Member" m ON f.member_id = m.id
	WHERE f.id = $1`
	err := r.db.QueryRow(query, id).Scan(&feedback.ID, &feedback.MemberID, &feedback.MemberName, &feedback.ProcessorID, &feedback.EquipmentID, &feedback.Content, &feedback.SentAt, &feedback.ResolutionNote, &feedback.Status, &feedback.Rating)
	return feedback, err
}

func (r *feedbackRepository) GetAll() ([]*entity.Feedback, error) {
	rows, err := r.db.Query(`SELECT f.id, COALESCE(f.member_id, 0), COALESCE(m.full_name, 'Unknown'), COALESCE(f.processor_id, 0), COALESCE(f.equipment_id, 0), COALESCE(f.content, ''), f.sent_at, COALESCE(f.resolution_note, ''), COALESCE(f.status, ''), COALESCE(f.rating, 0)
	FROM "Feedback" f
	LEFT JOIN "Member" m ON f.member_id = m.id
	ORDER BY f.id DESC`)
	if err != nil {
		return nil, err
	}
	defer rows.Close()
	var feedbacks []*entity.Feedback
	for rows.Next() {
		feedback := &entity.Feedback{}
		err := rows.Scan(&feedback.ID, &feedback.MemberID, &feedback.MemberName, &feedback.ProcessorID, &feedback.EquipmentID, &feedback.Content, &feedback.SentAt, &feedback.ResolutionNote, &feedback.Status, &feedback.Rating)
		if err != nil {
			return nil, err
		}
		feedbacks = append(feedbacks, feedback)
	}
	return feedbacks, nil
}

func (r *feedbackRepository) GetAllPaginated(page, limit int, status string) ([]*entity.Feedback, int, error) {
	// Build query based on status filter - join with Member to get member name
	var countQuery string
	var total int

	// Count query
	if status != "" {
		countQuery = `SELECT COUNT(*) FROM "Feedback" WHERE status = $1`
		err := r.db.QueryRow(countQuery, status).Scan(&total)
		if err != nil {
			return nil, 0, err
		}
	} else {
		countQuery = `SELECT COUNT(*) FROM "Feedback"`
		err := r.db.QueryRow(countQuery).Scan(&total)
		if err != nil {
			return nil, 0, err
		}
	}

	// Calculate offset
	offset := (page - 1) * limit

	// Get paginated data - simple query without complex CASE
	var query string
	var rows *sql.Rows
	var err error

	if status != "" {
		query = `SELECT f.id, COALESCE(f.member_id, 0), COALESCE(m.full_name, 'Unknown'), COALESCE(f.processor_id, 0), COALESCE(f.equipment_id, 0), COALESCE(f.content, ''), f.sent_at, COALESCE(f.resolution_note, ''), COALESCE(f.status, ''), COALESCE(f.rating, 0)
			FROM "Feedback" f
			LEFT JOIN "Member" m ON f.member_id = m.id
			WHERE f.status = $1 
			ORDER BY f.id DESC 
			LIMIT $2 OFFSET $3`
		rows, err = r.db.Query(query, status, limit, offset)
	} else {
		query = `SELECT f.id, COALESCE(f.member_id, 0), COALESCE(m.full_name, 'Unknown'), COALESCE(f.processor_id, 0), COALESCE(f.equipment_id, 0), COALESCE(f.content, ''), f.sent_at, COALESCE(f.resolution_note, ''), COALESCE(f.status, ''), COALESCE(f.rating, 0)
			FROM "Feedback" f
			LEFT JOIN "Member" m ON f.member_id = m.id
			ORDER BY f.id DESC 
			LIMIT $1 OFFSET $2`
		rows, err = r.db.Query(query, limit, offset)
	}

	if err != nil {
		return nil, 0, err
	}
	defer rows.Close()

	var feedbacks []*entity.Feedback
	for rows.Next() {
		feedback := &entity.Feedback{}
		err := rows.Scan(&feedback.ID, &feedback.MemberID, &feedback.MemberName, &feedback.ProcessorID, &feedback.EquipmentID, &feedback.Content, &feedback.SentAt, &feedback.ResolutionNote, &feedback.Status, &feedback.Rating)
		if err != nil {
			return nil, 0, err
		}
		feedbacks = append(feedbacks, feedback)
	}
	return feedbacks, total, nil
}

func (r *feedbackRepository) GetByMemberID(memberID int) ([]*entity.Feedback, error) {
	query := `SELECT f.id, COALESCE(f.member_id, 0), COALESCE(m.full_name, 'Unknown'), COALESCE(f.processor_id, 0), COALESCE(f.equipment_id, 0), COALESCE(f.content, ''), f.sent_at, COALESCE(f.resolution_note, ''), COALESCE(f.status, ''), COALESCE(f.rating, 0)
	FROM "Feedback" f
	LEFT JOIN "Member" m ON f.member_id = m.id
	WHERE f.member_id = $1
	ORDER BY f.sent_at DESC`
	rows, err := r.db.Query(query, memberID)
	if err != nil {
		return nil, err
	}
	defer rows.Close()
	var feedbacks []*entity.Feedback
	for rows.Next() {
		feedback := &entity.Feedback{}
		err := rows.Scan(&feedback.ID, &feedback.MemberID, &feedback.MemberName, &feedback.ProcessorID, &feedback.EquipmentID, &feedback.Content, &feedback.SentAt, &feedback.ResolutionNote, &feedback.Status, &feedback.Rating)
		if err != nil {
			return nil, err
		}
		feedbacks = append(feedbacks, feedback)
	}
	return feedbacks, nil
}

func (r *feedbackRepository) Update(feedback *entity.Feedback) error {
	var equipmentID interface{} = feedback.EquipmentID
	if feedback.EquipmentID == 0 {
		equipmentID = nil
	}
	var processorID interface{} = feedback.ProcessorID
	if feedback.ProcessorID == 0 {
		processorID = nil
	}
	var memberID interface{} = feedback.MemberID
	if feedback.MemberID == 0 {
		memberID = nil
	}

	query := `UPDATE "Feedback" SET member_id = $1, processor_id = $2, equipment_id = $3, content = $4, sent_at = $5, resolution_note = $6, status = $7 WHERE id = $8`
	_, err := r.db.Exec(query, memberID, processorID, equipmentID, feedback.Content, feedback.SentAt, feedback.ResolutionNote, feedback.Status, feedback.ID)
	return err
}

func (r *feedbackRepository) Delete(id int) error {
	_, err := r.db.Exec(`DELETE FROM "Feedback" WHERE id = $1`, id)
	return err
}

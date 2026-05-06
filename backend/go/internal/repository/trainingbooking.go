package repository

import (
	"database/sql"
	"gym-management/internal/domain/entity"
)

type TrainingBookingRepository interface {
	Create(trainingBooking *entity.TrainingBooking) error
	GetByID(id int) (*entity.TrainingBooking, error)
	GetAll() ([]*entity.TrainingBooking, error)
	Update(trainingBooking *entity.TrainingBooking) error
	Delete(id int) error
}

type trainingBookingRepository struct {
	db *sql.DB
}

func NewTrainingBookingRepository(db *sql.DB) TrainingBookingRepository {
	return &trainingBookingRepository{db: db}
}

func (r *trainingBookingRepository) Create(trainingBooking *entity.TrainingBooking) error {
	query := `INSERT INTO "TrainingBooking" (member_id, pt_id, requested_start, requested_end, training_plan_note, status, intensity, roadmap_goal, member_free_schedule) VALUES ($1, $2, $3, $4, $5, $6, $7, $8, $9) RETURNING id`
	return r.db.QueryRow(query, trainingBooking.MemberID, trainingBooking.PTID, trainingBooking.RequestedStart, trainingBooking.RequestedEnd, trainingBooking.TrainingPlanNote, trainingBooking.Status, trainingBooking.Intensity, trainingBooking.RoadmapGoal, trainingBooking.MemberFreeSchedule).Scan(&trainingBooking.ID)
}

func (r *trainingBookingRepository) GetByID(id int) (*entity.TrainingBooking, error) {
	query := `SELECT id, member_id, pt_id, requested_start, requested_end, training_plan_note, status, COALESCE(intensity, ''), COALESCE(roadmap_goal, ''), COALESCE(member_free_schedule, ''), COALESCE(rejection_reason, '') FROM "TrainingBooking" WHERE id = $1`
	row := r.db.QueryRow(query, id)

	var trainingBooking entity.TrainingBooking
	err := row.Scan(&trainingBooking.ID, &trainingBooking.MemberID, &trainingBooking.PTID, &trainingBooking.RequestedStart, &trainingBooking.RequestedEnd, &trainingBooking.TrainingPlanNote, &trainingBooking.Status, &trainingBooking.Intensity, &trainingBooking.RoadmapGoal, &trainingBooking.MemberFreeSchedule, &trainingBooking.RejectionReason)
	if err != nil {
		return nil, err
	}

	return &trainingBooking, nil
}

func (r *trainingBookingRepository) GetAll() ([]*entity.TrainingBooking, error) {
	query := `SELECT id, member_id, pt_id, requested_start, requested_end, training_plan_note, status, COALESCE(intensity, ''), COALESCE(roadmap_goal, ''), COALESCE(member_free_schedule, ''), COALESCE(rejection_reason, '') FROM "TrainingBooking"`
	rows, err := r.db.Query(query)
	if err != nil {
		return nil, err
	}
	defer rows.Close()

	var trainingBookings []*entity.TrainingBooking
	for rows.Next() {
		var trainingBooking entity.TrainingBooking
		err := rows.Scan(&trainingBooking.ID, &trainingBooking.MemberID, &trainingBooking.PTID, &trainingBooking.RequestedStart, &trainingBooking.RequestedEnd, &trainingBooking.TrainingPlanNote, &trainingBooking.Status, &trainingBooking.Intensity, &trainingBooking.RoadmapGoal, &trainingBooking.MemberFreeSchedule, &trainingBooking.RejectionReason)
		if err != nil {
			return nil, err
		}
		trainingBookings = append(trainingBookings, &trainingBooking)
	}

	return trainingBookings, nil
}

func (r *trainingBookingRepository) Update(trainingBooking *entity.TrainingBooking) error {
	query := `UPDATE "TrainingBooking" SET member_id = $1, pt_id = $2, requested_start = $3, requested_end = $4, training_plan_note = $5, status = $6, intensity = $7, roadmap_goal = $8, member_free_schedule = $9, rejection_reason = $10 WHERE id = $11`
	_, err := r.db.Exec(query, trainingBooking.MemberID, trainingBooking.PTID, trainingBooking.RequestedStart, trainingBooking.RequestedEnd, trainingBooking.TrainingPlanNote, trainingBooking.Status, trainingBooking.Intensity, trainingBooking.RoadmapGoal, trainingBooking.MemberFreeSchedule, trainingBooking.RejectionReason, trainingBooking.ID)
	return err
}

func (r *trainingBookingRepository) Delete(id int) error {
	query := `DELETE FROM "TrainingBooking" WHERE id = $1`
	_, err := r.db.Exec(query, id)
	return err
}

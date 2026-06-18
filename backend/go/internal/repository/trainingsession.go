package repository

import (
	"database/sql"
	"fmt"
	"gym-management/internal/domain/adapter"
	"gym-management/internal/domain/entity"
)

type trainingSessionRepository struct {
	db *sql.DB
}

func NewTrainingSessionRepository(db *sql.DB) adapter.TrainingSessionRepository {
	return &trainingSessionRepository{db: db}
}

func (r *trainingSessionRepository) Create(trainingSession *entity.TrainingSession) error {
	var facilityID interface{}
	if trainingSession.FacilityID != 0 {
		facilityID = trainingSession.FacilityID
	}
	query := `INSERT INTO "TrainingSession" (booking_id, facility_id, session_time, attendance_status, pt_feedback, member_confirmed_at, physical_condition, session_result, nutrition_advice) VALUES ($1, $2, $3, $4, $5, $6, $7, $8, $9) RETURNING id`
	return r.db.QueryRow(query, trainingSession.BookingID, facilityID, trainingSession.SessionTime, trainingSession.AttendanceStatus, trainingSession.PTFeedback, trainingSession.MemberConfirmedAt, trainingSession.PhysicalCondition, trainingSession.SessionResult, trainingSession.NutritionAdvice).Scan(&trainingSession.ID)
}

func (r *trainingSessionRepository) GetByID(id int) (*entity.TrainingSession, error) {
	query := `SELECT id, booking_id, facility_id, session_time, attendance_status, COALESCE(pt_feedback, ''), member_confirmed_at, COALESCE(physical_condition, ''), COALESCE(session_result, ''), COALESCE(nutrition_advice, '') FROM "TrainingSession" WHERE id = $1`
	row := r.db.QueryRow(query, id)

	var trainingSession entity.TrainingSession
	var facilityID sql.NullInt64
	err := row.Scan(&trainingSession.ID, &trainingSession.BookingID, &facilityID, &trainingSession.SessionTime, &trainingSession.AttendanceStatus, &trainingSession.PTFeedback, &trainingSession.MemberConfirmedAt, &trainingSession.PhysicalCondition, &trainingSession.SessionResult, &trainingSession.NutritionAdvice)
	if err != nil {
		return nil, err
	}
	if facilityID.Valid {
		trainingSession.FacilityID = int(facilityID.Int64)
	}


	return &trainingSession, nil
}
func (r *trainingSessionRepository) GetAll() ([]*entity.TrainingSession, error) {
	query := `SELECT id, booking_id, facility_id, session_time, attendance_status, COALESCE(pt_feedback, ''), member_confirmed_at, COALESCE(physical_condition, ''), COALESCE(session_result, ''), COALESCE(nutrition_advice, '') FROM "TrainingSession"`
	rows, err := r.db.Query(query)
	if err != nil {
		return nil, err
	}
	defer rows.Close()

	var trainingSessions []*entity.TrainingSession
	for rows.Next() {
		var trainingSession entity.TrainingSession
		var facilityID sql.NullInt64
		err := rows.Scan(&trainingSession.ID, &trainingSession.BookingID, &facilityID, &trainingSession.SessionTime, &trainingSession.AttendanceStatus, &trainingSession.PTFeedback, &trainingSession.MemberConfirmedAt, &trainingSession.PhysicalCondition, &trainingSession.SessionResult, &trainingSession.NutritionAdvice)
		if err != nil {
			return nil, err
		}
		if facilityID.Valid {
			trainingSession.FacilityID = int(facilityID.Int64)
		}
		trainingSessions = append(trainingSessions, &trainingSession)
	}

	return trainingSessions, nil
}

func (r *trainingSessionRepository) Update(trainingSession *entity.TrainingSession) error {
	var facilityID interface{}
	if trainingSession.FacilityID != 0 {
		facilityID = trainingSession.FacilityID
	}
	query := `UPDATE "TrainingSession" SET booking_id = $1, facility_id = $2, session_time = $3, attendance_status = $4, pt_feedback = $5, member_confirmed_at = $6, physical_condition = $7, session_result = $8, nutrition_advice = $9 WHERE id = $10`
	_, err := r.db.Exec(query, trainingSession.BookingID, facilityID, trainingSession.SessionTime, trainingSession.AttendanceStatus, trainingSession.PTFeedback, trainingSession.MemberConfirmedAt, trainingSession.PhysicalCondition, trainingSession.SessionResult, trainingSession.NutritionAdvice, trainingSession.ID)
	return err
}

func (r *trainingSessionRepository) GetByPTEmployeeID(employeeID int) ([]*entity.TrainingSession, error) {
	query := `SELECT ts.id, ts.booking_id, ts.facility_id, ts.session_time, ts.attendance_status,
	          COALESCE(ts.pt_feedback, ''), ts.member_confirmed_at, COALESCE(ts.physical_condition, ''),
	          COALESCE(ts.session_result, ''), COALESCE(ts.nutrition_advice, '')
	          FROM "TrainingSession" ts
	          JOIN "TrainingBooking" tb ON ts.booking_id = tb.id
	          WHERE tb.pt_id = $1`
	rows, err := r.db.Query(query, employeeID)
	if err != nil {
		return nil, err
	}
	defer rows.Close()

	var sessions []*entity.TrainingSession
	for rows.Next() {
		var ts entity.TrainingSession
		var facilityID sql.NullInt64
		err := rows.Scan(&ts.ID, &ts.BookingID, &facilityID, &ts.SessionTime, &ts.AttendanceStatus,
			&ts.PTFeedback, &ts.MemberConfirmedAt, &ts.PhysicalCondition, &ts.SessionResult, &ts.NutritionAdvice)
		if err != nil {
			return nil, err
		}
		if facilityID.Valid {
			ts.FacilityID = int(facilityID.Int64)
		}
		sessions = append(sessions, &ts)
	}
	return sessions, nil
}

func (r *trainingSessionRepository) Delete(id int) error {
	query := `DELETE FROM "TrainingSession" WHERE id = $1`
	_, err := r.db.Exec(query, id)
	return err
}
func (r *trainingSessionRepository) ConfirmAttendance(id int, memberID int) error {
	tx, err := r.db.Begin()
	if err != nil {
		return err
	}
	defer tx.Rollback()

	// Check if already confirmed
	var confirmedAt sql.NullTime
	err = tx.QueryRow(`SELECT member_confirmed_at FROM "TrainingSession" WHERE id = $1`, id).Scan(&confirmedAt)
	if err != nil {
		return err
	}

	if confirmedAt.Valid {
		return fmt.Errorf("session already confirmed")
	}

	query := `UPDATE "TrainingSession" 
	          SET member_confirmed_at = CURRENT_TIMESTAMP 
	          WHERE id = $1 AND EXISTS (
	              SELECT 1 FROM "TrainingBooking" b 
	              WHERE b.id = "TrainingSession".booking_id AND b.member_id = $2
	          )`
	res, err := tx.Exec(query, id, memberID)
	if err != nil {
		return err
	}
	rows, _ := res.RowsAffected()
	if rows == 0 {
		return fmt.Errorf("session not found or not belongs to member")
	}

	// Deduct remaining_sessions for session_based packages
	deductQuery := `
		UPDATE "Subscription"
		SET remaining_sessions = GREATEST(0, remaining_sessions - 1)
		WHERE member_id = $1 AND status = 'active' AND remaining_sessions > 0
		  AND EXISTS (
			  SELECT 1 FROM "MembershipPackage" mp
			  WHERE mp.id = "Subscription".package_id AND mp.pricing_type = 'session_based'
		  )
	`
	_, err = tx.Exec(deductQuery, memberID)
	if err != nil {
		return err
	}

	// Also insert into CheckInHistory
	checkInQuery := `
		INSERT INTO "CheckInHistory" ("member_id", "facility_id", "check_in_time", "booking_id")
		SELECT $1, ts.facility_id, CURRENT_TIMESTAMP, ts.booking_id
		FROM "TrainingSession" ts
		WHERE ts.id = $2
	`
	_, err = tx.Exec(checkInQuery, memberID, id)
	if err != nil {
		return err
	}

	return tx.Commit()
}

func (r *trainingSessionRepository) GetMyHistory(memberID int) ([]*entity.CheckInHistory, error) {
	query := `
		SELECT ch.id, COALESCE(ch.booking_id, 0), COALESCE(f.facility_name, ''), ch.check_in_time, ch.check_in_time, COALESCE(e.full_name, ''),
		       COALESCE(ts.attendance_status, ''), COALESCE(ts.pt_feedback, ''), COALESCE(ts.physical_condition, ''), COALESCE(ts.session_result, ''), COALESCE(ts.nutrition_advice, ''),
		       COALESCE(tb.training_plan_note, ''), COALESCE(tb.intensity, ''), tb.requested_start, tb.requested_end
		FROM "CheckInHistory" ch
		LEFT JOIN "TrainingBooking" tb ON ch.booking_id = tb.id
		LEFT JOIN "TrainingSession" ts ON tb.id = ts.booking_id
		LEFT JOIN "Facility" f ON ch.facility_id = f.id
		LEFT JOIN "Employee" e ON tb.pt_id = e.id
		WHERE ch.member_id = $1
		ORDER BY ch.check_in_time DESC
	`
	rows, err := r.db.Query(query, memberID)
	if err != nil {
		return nil, err
	}
	defer rows.Close()

	var histories []*entity.CheckInHistory
	for rows.Next() {
		var h entity.CheckInHistory
		err := rows.Scan(
			&h.SessionID, &h.BookingID, &h.FacilityName, &h.SessionTime, &h.MemberConfirmedAt, &h.PTName,
			&h.AttendanceStatus, &h.PTFeedback, &h.PhysicalCondition, &h.SessionResult, &h.NutritionAdvice,
			&h.TrainingPlanNote, &h.Intensity, &h.RequestedStart, &h.RequestedEnd,
		)
		if err != nil {
			return nil, err
		}
		histories = append(histories, &h)
	}
	return histories, nil
}

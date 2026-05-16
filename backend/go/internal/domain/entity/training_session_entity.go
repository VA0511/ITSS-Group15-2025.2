package entity

import "time"

type TrainingSession struct {
	ID                int        `json:"id"`
	BookingID         int        `json:"booking_id"`
	FacilityID        int        `json:"facility_id"`
	SessionTime       time.Time  `json:"session_time"`
	AttendanceStatus  string     `json:"attendance_status"`
	PTFeedback        string     `json:"pt_feedback"`
	MemberConfirmedAt *time.Time `json:"member_confirmed_at"`
	PhysicalCondition string     `json:"physical_condition"`
	SessionResult     string     `json:"session_result"`
	NutritionAdvice   string     `json:"nutrition_advice"`
}

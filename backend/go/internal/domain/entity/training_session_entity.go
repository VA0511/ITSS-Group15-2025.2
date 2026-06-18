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

type CheckInHistory struct {
	SessionID         int        `json:"session_id"`
	BookingID         int        `json:"booking_id"`
	FacilityName      string     `json:"facility_name"`
	SessionTime       *time.Time `json:"session_time"`
	MemberConfirmedAt *time.Time `json:"member_confirmed_at"`
	PTName            string     `json:"pt_name"`
	AttendanceStatus  string     `json:"attendance_status"`
	PTFeedback        string     `json:"pt_feedback"`
	PhysicalCondition string     `json:"physical_condition"`
	SessionResult     string     `json:"session_result"`
	NutritionAdvice   string     `json:"nutrition_advice"`
	TrainingPlanNote  string     `json:"training_plan_note"`
	Intensity         string     `json:"intensity"`
	RequestedStart    *time.Time `json:"requested_start"`
	RequestedEnd      *time.Time `json:"requested_end"`
}


package entity

import "time"

type TrainingBooking struct {
	ID                 int       `json:"id"`
	MemberID           int       `json:"member_id"`
	PTID               int       `json:"pt_id"`
	RequestedStart     time.Time `json:"requested_start"`
	RequestedEnd       time.Time `json:"requested_end"`
	TrainingPlanNote   string    `json:"training_plan_note"`
	Status             string    `json:"status"`
	Intensity          string    `json:"intensity"`
	RoadmapGoal        string    `json:"roadmap_goal"`
	MemberFreeSchedule string    `json:"member_free_schedule"`
	RejectionReason    string    `json:"rejection_reason"`
}

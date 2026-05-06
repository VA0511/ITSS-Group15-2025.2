package entity

import "time"

type Feedback struct {
	ID             int       `json:"id"`
	MemberID       int       `json:"member_id"`
	MemberName     string    `json:"member_name"`
	ProcessorID    int       `json:"processor_id"`
	EquipmentID    int       `json:"equipment_id"`
	Content        string    `json:"content"`
	SentAt         time.Time `json:"sent_at"`
	ResolutionNote string    `json:"resolution_note"`
	Status         string    `json:"status"`
	Rating         int       `json:"rating"`
}

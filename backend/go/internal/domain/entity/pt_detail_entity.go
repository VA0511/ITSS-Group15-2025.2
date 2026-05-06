package entity

import "time"

type PTDetail struct {
	EmployeeID          int       `json:"employee_id"`
	FullName            string    `json:"full_name"`
	Phone               string    `json:"phone"`
	Email               string    `json:"email"`
	DOB                 time.Time `json:"dob"`
	ProfessionalProfile string    `json:"professional_profile"`
	BodyIndex           string    `json:"body_index"`
	ExperienceYears     string    `json:"experience_years"`
	Achievements        string    `json:"achievements"`
	AvailableSchedule   string    `json:"available_schedule"`
}

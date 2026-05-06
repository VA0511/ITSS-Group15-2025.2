package entity

import "time"

type Employee struct {
	ID        int       `json:"id"`
	FullName  string    `json:"full_name"`
	Phone     string    `json:"phone"`
	Position  string    `json:"position"`
	Salary    float64   `json:"salary"`
	AccountID int       `json:"account_id"`
	Gender    string    `json:"gender"`
	DOB       time.Time `json:"dob"`
	Email     string    `json:"email"`
	Address   string    `json:"address"`
}

package entity

import "time"

type Subscription struct {
	ID               int       `json:"id"`
	MemberID         int       `json:"member_id"`
	PackageID        int       `json:"package_id"`
	RegistrationDate time.Time `json:"registration_date"`
	StartDate        time.Time `json:"start_date"`
	EndDate          time.Time `json:"end_date"`
	Status           string    `json:"status"`
}

type SubscriptionHistory struct {
	ID               int       `json:"id"`
	PackageName      string    `json:"package_name"`
	RegistrationDate time.Time `json:"registration_date"`
	StartDate        time.Time `json:"start_date"`
	EndDate          time.Time `json:"end_date"`
	Status           string    `json:"status"`
	Price            float64   `json:"price"`
}

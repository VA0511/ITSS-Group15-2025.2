package entity

import "time"

type Equipment struct {
	ID                  int       `json:"id"`
	FacilityID          int       `json:"facility_id"`
	FacilityName        string    `json:"facility_name"`
	EquipmentName       string    `json:"equipment_name"`
	SerialNumber        string    `json:"serial_number"`
	Quantity            int       `json:"quantity"`
	Origin              string    `json:"origin"`
	PurchaseDate        time.Time `json:"purchase_date"`
	MaintenanceDeadline time.Time `json:"maintenance_deadline"`
	Status              string    `json:"status"`
}

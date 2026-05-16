package entity

type MembershipPackage struct {
	ID            int     `json:"id"`
	CategoryID    int     `json:"category_id"`
	CategoryName  string  `json:"category_name"`
	PackageName   string  `json:"package_name"`
	DurationDays  int     `json:"duration_days"`
	Price         float64 `json:"price"`
	IsActive      bool    `json:"is_active"`
	Description   string  `json:"description"`
	AllowedGender string  `json:"allowed_gender"`
}

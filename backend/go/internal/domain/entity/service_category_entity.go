package entity

type ServiceCategory struct {
	ID                  int    `json:"id"`
	CategoryName        string `json:"category_name"`
	BenefitsDescription string `json:"benefits_description"`
	AllowedGender       string `json:"allowed_gender"`
}

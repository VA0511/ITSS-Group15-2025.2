package dto

import "time"

type AccountRequest struct {
	Username string `json:"username"`
	Password string `json:"password"`
	RoleID   int    `json:"role_id"`
}

type AccountResponse struct {
	ID       int    `json:"id"`
	Username string `json:"username"`
	RoleID   int    `json:"role_id"`
}

type EmployeeRequest struct {
	FullName  string  `json:"full_name"`
	Phone     string  `json:"phone"`
	Position  string  `json:"position"`
	Salary    float64 `json:"salary"`
	AccountID int     `json:"account_id"`
}

type EmployeeResponse struct {
	ID        int     `json:"id"`
	FullName  string  `json:"full_name"`
	Phone     string  `json:"phone"`
	Position  string  `json:"position"`
	Salary    float64 `json:"salary"`
	AccountID int     `json:"account_id"`
}

type EquipmentRequest struct {
	FacilityID          int       `json:"facility_id"`
	EquipmentName       string    `json:"equipment_name"`
	Origin              string    `json:"origin"`
	MaintenanceDeadline time.Time `json:"maintenance_deadline"`
	Status              string    `json:"status"`
}

type EquipmentResponse struct {
	ID                  int       `json:"id"`
	FacilityID          int       `json:"facility_id"`
	EquipmentName       string    `json:"equipment_name"`
	Origin              string    `json:"origin"`
	MaintenanceDeadline time.Time `json:"maintenance_deadline"`
	Status              string    `json:"status"`
}

type FacilityRequest struct {
	FacilityName string `json:"facility_name"`
	FacilityType string `json:"facility_type"`
	Status       string `json:"status"`
}

type FacilityResponse struct {
	ID           int    `json:"id"`
	FacilityName string `json:"facility_name"`
	FacilityType string `json:"facility_type"`
	Status       string `json:"status"`
}

type FeedbackRequest struct {
	MemberID    int    `json:"member_id"`
	ProcessorID int    `json:"processor_id"`
	EquipmentID int    `json:"equipment_id"`
	Content     string `json:"content"`
	Status      string `json:"status"`
}

type FeedbackResponse struct {
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

type MemberRequest struct {
	FullName  string    `json:"full_name"`
	Phone     string    `json:"phone"`
	Email     string    `json:"email"`
	Gender    string    `json:"gender"`
	DOB       time.Time `json:"dob"`
	Address   string    `json:"address"`
	AccountID int       `json:"account_id"`
}

type MemberResponse struct {
	ID        int       `json:"id"`
	FullName  string    `json:"full_name"`
	Phone     string    `json:"phone"`
	Email     string    `json:"email"`
	Gender    string    `json:"gender"`
	DOB       time.Time `json:"dob"`
	Address   string    `json:"address"`
	AccountID int       `json:"account_id"`
}

type PackageRequest struct {
	CategoryID   int     `json:"category_id"`
	PackageName  string  `json:"package_name"`
	DurationDays int     `json:"duration_days"`
	Price        float64 `json:"price"`
}

type PackageResponse struct {
	ID           int     `json:"id"`
	CategoryID   int     `json:"category_id"`
	PackageName  string  `json:"package_name"`
	DurationDays int     `json:"duration_days"`
	Price        float64 `json:"price"`
	Description  string  `json:"description"`
}

type PTDetailRequest struct {
	EmployeeID          int    `json:"employee_id"`
	ProfessionalProfile string `json:"professional_profile"`
	BodyIndex           string `json:"body_index"`
	ExperienceYears     string `json:"experience_years"`
}

type PTDetailResponse struct {
	EmployeeID          int    `json:"employee_id"`
	ProfessionalProfile string `json:"professional_profile"`
	BodyIndex           string `json:"body_index"`
	ExperienceYears     string `json:"experience_years"`
}

type RoleRequest struct {
	RoleName string `json:"role_name"`
}

type RoleResponse struct {
	ID       int    `json:"id"`
	RoleName string `json:"role_name"`
}

type ServiceCategoryRequest struct {
	CategoryName        string `json:"category_name"`
	BenefitsDescription string `json:"benefits_description"`
	AllowedGender       string `json:"allowed_gender"`
}

type ServiceCategoryResponse struct {
	ID                  int    `json:"id"`
	CategoryName        string `json:"category_name"`
	BenefitsDescription string `json:"benefits_description"`
	AllowedGender       string `json:"allowed_gender"`
}

type SubscriptionRequest struct {
	MemberID         int       `json:"member_id"`
	PackageID        int       `json:"package_id"`
	RegistrationDate time.Time `json:"registration_date"`
	StartDate        time.Time `json:"start_date"`
	EndDate          time.Time `json:"end_date"`
	Status           string    `json:"status"`
}

type SubscriptionResponse struct {
	ID               int       `json:"id"`
	MemberID         int       `json:"member_id"`
	PackageID        int       `json:"package_id"`
	RegistrationDate time.Time `json:"registration_date"`
	StartDate        time.Time `json:"start_date"`
	EndDate          time.Time `json:"end_date"`
	Status           string    `json:"status"`
}

type TrainingBookingRequest struct {
	MemberID           int       `json:"member_id"`
	PTID               int       `json:"pt_id"`
	RequestedStart     time.Time `json:"requested_start"`
	RequestedEnd       time.Time `json:"requested_end"`
	TrainingPlanNote   string    `json:"training_plan_note"`
	Status             string    `json:"status"`
	Intensity          string    `json:"intensity"`
	RoadmapGoal        string    `json:"roadmap_goal"`
	MemberFreeSchedule string    `json:"member_free_schedule"`
}

type TrainingBookingResponse struct {
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
}

type TrainingSessionRequest struct {
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

type TrainingSessionResponse struct {
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

// Pagination Request
type PaginationRequest struct {
	Page  int `json:"page"`
	Limit int `json:"limit"`
}

// Pagination Response
type PaginationResponse struct {
	Data       interface{} `json:"data"`
	Page       int         `json:"page"`
	Limit      int         `json:"limit"`
	TotalItems int         `json:"total_items"`
	TotalPages int         `json:"total_pages"`
}

// Feedback Filter Request
type FeedbackFilterRequest struct {
	Status string `json:"status"`
}

package dto

// MemberListItemDTO - dữ liệu hiển thị trong danh sách member
type MemberListItemDTO struct {
	ID                int    `json:"id"`
	Name              string `json:"name"`              // từ Member.full_name
	Phone             string `json:"phone"`             // từ Member.phone
	Package           string `json:"package"`           // từ MembershipPackage.package_name
	Status            string `json:"status"`            // từ Member.is_active (true->active, false->inactive)
	ExpiryDate        string `json:"expiryDate"`        // từ Subscription.end_date
	JoinDate          string `json:"joinDate"`          // từ Subscription.start_date
	SessionsRemaining int    `json:"sessionsRemaining"` // số ngày còn lại = end_date - today
	RoadmapGoal       string `json:"roadmap_goal"`      // từ Member.roadmap_goal
}

// MemberDetailDTO - dữ liệu chi tiết member
type MemberDetailDTO struct {
	ID         int    `json:"id"`
	FullName   string `json:"full_name"`
	Phone      string `json:"phone"`
	Email      string `json:"email"`
	Gender     string `json:"gender"`
	DOB        string `json:"dob"`
	Address    string `json:"address"`
	Package    string `json:"package"`
	Status     string `json:"status"`
	ExpiryDate string `json:"expiryDate"`
	JoinDate   string `json:"joinDate"`
	IsActive   bool   `json:"is_active"`
}

package mappers

import (
	"gym-management/internal/domain/entity"
	"gym-management/internal/infra/api/dto"
)

func AccountRequestToEntity(req *dto.AccountRequest) *entity.Account {
	return &entity.Account{Username: req.Username, Password: req.Password, RoleID: req.RoleID}
}

func AccountEntityToResponse(ent *entity.Account) *dto.AccountResponse {
	return &dto.AccountResponse{ID: ent.ID, Username: ent.Username, RoleID: ent.RoleID}
}

func EmployeeRequestToEntity(req *dto.EmployeeRequest) *entity.Employee {
	return &entity.Employee{FullName: req.FullName, Phone: req.Phone, Position: req.Position, Salary: req.Salary, AccountID: req.AccountID}
}

func EmployeeEntityToResponse(ent *entity.Employee) *dto.EmployeeResponse {
	return &dto.EmployeeResponse{ID: ent.ID, FullName: ent.FullName, Phone: ent.Phone, Position: ent.Position, Salary: ent.Salary, AccountID: ent.AccountID}
}

func EquipmentRequestToEntity(req *dto.EquipmentRequest) *entity.Equipment {
	return &entity.Equipment{FacilityID: req.FacilityID, EquipmentName: req.EquipmentName, Origin: req.Origin, MaintenanceDeadline: req.MaintenanceDeadline, Status: req.Status}
}

func EquipmentEntityToResponse(ent *entity.Equipment) *dto.EquipmentResponse {
	return &dto.EquipmentResponse{ID: ent.ID, FacilityID: ent.FacilityID, EquipmentName: ent.EquipmentName, Origin: ent.Origin, MaintenanceDeadline: ent.MaintenanceDeadline, Status: ent.Status}
}

func FacilityRequestToEntity(req *dto.FacilityRequest) *entity.Facility {
	return &entity.Facility{FacilityName: req.FacilityName, FacilityType: req.FacilityType, Status: req.Status}
}

func FacilityEntityToResponse(ent *entity.Facility) *dto.FacilityResponse {
	return &dto.FacilityResponse{ID: ent.ID, FacilityName: ent.FacilityName, FacilityType: ent.FacilityType, Status: ent.Status}
}

func FeedbackRequestToEntity(req *dto.FeedbackRequest) *entity.Feedback {
	return &entity.Feedback{MemberID: req.MemberID, ProcessorID: req.ProcessorID, EquipmentID: req.EquipmentID, Content: req.Content, Status: req.Status}
}

func FeedbackEntityToResponse(ent *entity.Feedback) *dto.FeedbackResponse {
	return &dto.FeedbackResponse{ID: ent.ID, MemberID: ent.MemberID, MemberName: ent.MemberName, ProcessorID: ent.ProcessorID, EquipmentID: ent.EquipmentID, Content: ent.Content, SentAt: ent.SentAt, ResolutionNote: ent.ResolutionNote, Status: ent.Status, Rating: ent.Rating}
}

func MemberRequestToEntity(req *dto.MemberRequest) *entity.Member {
	return &entity.Member{FullName: req.FullName, Phone: req.Phone, Email: req.Email, Gender: req.Gender, DOB: req.DOB, Address: req.Address, AccountID: req.AccountID}
}

func MemberEntityToResponse(ent *entity.Member) *dto.MemberResponse {
	return &dto.MemberResponse{ID: ent.ID, FullName: ent.FullName, Phone: ent.Phone, Email: ent.Email, Gender: ent.Gender, DOB: ent.DOB, Address: ent.Address, AccountID: ent.AccountID}
}

func PackageRequestToEntity(req *dto.PackageRequest) *entity.MembershipPackage {
	return &entity.MembershipPackage{CategoryID: req.CategoryID, PackageName: req.PackageName, DurationDays: req.DurationDays, Price: req.Price}
}

func PackageEntityToResponse(ent *entity.MembershipPackage) *dto.PackageResponse {
	return &dto.PackageResponse{ID: ent.ID, CategoryID: ent.CategoryID, PackageName: ent.PackageName, DurationDays: ent.DurationDays, Price: ent.Price, Description: ent.Description}
}

func PTDetailRequestToEntity(req *dto.PTDetailRequest) *entity.PTDetail {
	return &entity.PTDetail{EmployeeID: req.EmployeeID, ProfessionalProfile: req.ProfessionalProfile, BodyIndex: req.BodyIndex, ExperienceYears: req.ExperienceYears}
}

func PTDetailEntityToResponse(ent *entity.PTDetail) *dto.PTDetailResponse {
	return &dto.PTDetailResponse{EmployeeID: ent.EmployeeID, ProfessionalProfile: ent.ProfessionalProfile, BodyIndex: ent.BodyIndex, ExperienceYears: ent.ExperienceYears}
}

func RoleRequestToEntity(req *dto.RoleRequest) *entity.Role {
	return &entity.Role{RoleName: req.RoleName}
}

func RoleEntityToResponse(ent *entity.Role) *dto.RoleResponse {
	return &dto.RoleResponse{ID: ent.ID, RoleName: ent.RoleName}
}

func ServiceCategoryRequestToEntity(req *dto.ServiceCategoryRequest) *entity.ServiceCategory {
	return &entity.ServiceCategory{CategoryName: req.CategoryName, BenefitsDescription: req.BenefitsDescription, AllowedGender: req.AllowedGender}
}

func ServiceCategoryEntityToResponse(ent *entity.ServiceCategory) *dto.ServiceCategoryResponse {
	return &dto.ServiceCategoryResponse{ID: ent.ID, CategoryName: ent.CategoryName, BenefitsDescription: ent.BenefitsDescription, AllowedGender: ent.AllowedGender}
}

func SubscriptionRequestToEntity(req *dto.SubscriptionRequest) *entity.Subscription {
	return &entity.Subscription{MemberID: req.MemberID, PackageID: req.PackageID, RegistrationDate: req.RegistrationDate, StartDate: req.StartDate, EndDate: req.EndDate, Status: req.Status}
}

func SubscriptionEntityToResponse(ent *entity.Subscription) *dto.SubscriptionResponse {
	return &dto.SubscriptionResponse{ID: ent.ID, MemberID: ent.MemberID, PackageID: ent.PackageID, RegistrationDate: ent.RegistrationDate, StartDate: ent.StartDate, EndDate: ent.EndDate, Status: ent.Status}
}

func TrainingBookingRequestToEntity(req *dto.TrainingBookingRequest) *entity.TrainingBooking {
	return &entity.TrainingBooking{
		MemberID:           req.MemberID,
		PTID:               req.PTID,
		RequestedStart:     req.RequestedStart,
		RequestedEnd:       req.RequestedEnd,
		TrainingPlanNote:   req.TrainingPlanNote,
		Status:             req.Status,
		Intensity:          req.Intensity,
		RoadmapGoal:        req.RoadmapGoal,
		MemberFreeSchedule: req.MemberFreeSchedule,
	}
}

func TrainingBookingEntityToResponse(ent *entity.TrainingBooking) *dto.TrainingBookingResponse {
	return &dto.TrainingBookingResponse{
		ID:                 ent.ID,
		MemberID:           ent.MemberID,
		PTID:               ent.PTID,
		RequestedStart:     ent.RequestedStart,
		RequestedEnd:       ent.RequestedEnd,
		TrainingPlanNote:   ent.TrainingPlanNote,
		Status:             ent.Status,
		Intensity:          ent.Intensity,
		RoadmapGoal:        ent.RoadmapGoal,
		MemberFreeSchedule: ent.MemberFreeSchedule,
	}
}

func TrainingSessionRequestToEntity(req *dto.TrainingSessionRequest) *entity.TrainingSession {
	return &entity.TrainingSession{
		BookingID:         req.BookingID,
		FacilityID:        req.FacilityID,
		SessionTime:       req.SessionTime,
		AttendanceStatus:  req.AttendanceStatus,
		PTFeedback:        req.PTFeedback,
		MemberConfirmedAt: req.MemberConfirmedAt,
		PhysicalCondition: req.PhysicalCondition,
		SessionResult:     req.SessionResult,
		NutritionAdvice:   req.NutritionAdvice,
	}
}

func TrainingSessionEntityToResponse(ent *entity.TrainingSession) *dto.TrainingSessionResponse {
	return &dto.TrainingSessionResponse{
		ID:                ent.ID,
		BookingID:         ent.BookingID,
		FacilityID:        ent.FacilityID,
		SessionTime:       ent.SessionTime,
		AttendanceStatus:  ent.AttendanceStatus,
		PTFeedback:        ent.PTFeedback,
		MemberConfirmedAt: ent.MemberConfirmedAt,
		PhysicalCondition: ent.PhysicalCondition,
		SessionResult:     ent.SessionResult,
		NutritionAdvice:   ent.NutritionAdvice,
	}
}

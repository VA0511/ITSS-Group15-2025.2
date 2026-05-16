package handlers

import (
	"encoding/json"
	"fmt"
	"net/http"
	"strconv"

	"gym-management/internal/domain/entity"
	"gym-management/internal/domain/usecase/employee_usecase"
	"gym-management/internal/domain/usecase/member_usecase"
	"gym-management/internal/domain/usecase/training_booking_usecase"
	"gym-management/internal/domain/usecase/training_session_usecase"
	"gym-management/internal/infra/api/middleware"
	"gym-management/internal/infra/notification"

	"github.com/gorilla/mux"
)

type TrainingBookingHandler struct {
	usecase                training_booking_usecase.TrainingBookingUsecase
	memberUsecase          member_usecase.MemberUsecase
	employeeUsecase        employee_usecase.EmployeeUsecase
	trainingSessionUsecase training_session_usecase.TrainingSessionUsecase
	hub                    *notification.Hub
}

func NewTrainingBookingHandler(
	u training_booking_usecase.TrainingBookingUsecase,
	mu member_usecase.MemberUsecase,
	eu employee_usecase.EmployeeUsecase,
	su training_session_usecase.TrainingSessionUsecase,
	hub *notification.Hub,
) *TrainingBookingHandler {
	return &TrainingBookingHandler{usecase: u, memberUsecase: mu, employeeUsecase: eu, trainingSessionUsecase: su, hub: hub}
}

func (h *TrainingBookingHandler) Create(w http.ResponseWriter, r *http.Request) {
	var trainingBooking entity.TrainingBooking
	if err := json.NewDecoder(r.Body).Decode(&trainingBooking); err != nil {
		http.Error(w, err.Error(), http.StatusBadRequest)
		return
	}

	currentUser, ok := middleware.GetAuthenticatedUser(r)
	if ok && currentUser.Role == "MEMBER" {
		member, err := h.memberUsecase.GetMemberByAccountID(currentUser.AccountID)
		if err != nil {
			http.Error(w, "member not found", http.StatusNotFound)
			return
		}
		trainingBooking.MemberID = member.ID
		trainingBooking.RoadmapGoal = member.RoadmapGoal
		trainingBooking.MemberFreeSchedule = member.MemberFreeSchedule
	}

	if trainingBooking.Status == "" {
		trainingBooking.Status = "Pending"
	}

	if err := h.usecase.CreateTrainingBooking(&trainingBooking); err != nil {
		http.Error(w, err.Error(), http.StatusInternalServerError)
		return
	}

	// Notify the PT about the new booking request
	if h.hub != nil {
		go h.notifyPTNewBooking(trainingBooking.PTID, trainingBooking.MemberID)
	}

	w.Header().Set("Content-Type", "application/json")
	w.WriteHeader(http.StatusCreated)
	json.NewEncoder(w).Encode(trainingBooking)
}

func (h *TrainingBookingHandler) GetByID(w http.ResponseWriter, r *http.Request) {
	vars := mux.Vars(r)
	id, err := strconv.Atoi(vars["id"])
	if err != nil {
		http.Error(w, "Invalid ID", http.StatusBadRequest)
		return
	}

	trainingBooking, err := h.usecase.GetTrainingBookingByID(id)
	if err != nil {
		http.Error(w, err.Error(), http.StatusNotFound)
		return
	}

	w.Header().Set("Content-Type", "application/json")
	json.NewEncoder(w).Encode(trainingBooking)
}

func (h *TrainingBookingHandler) GetAll(w http.ResponseWriter, r *http.Request) {
	trainingBookings, err := h.usecase.GetAllTrainingBookings()
	if err != nil {
		http.Error(w, err.Error(), http.StatusInternalServerError)
		return
	}

	currentUser, ok := middleware.GetAuthenticatedUser(r)
	if ok && currentUser.Role == "MEMBER" {
		member, err := h.memberUsecase.GetMemberByAccountID(currentUser.AccountID)
		if err == nil {
			var filtered []*entity.TrainingBooking
			for _, b := range trainingBookings {
				if b.MemberID == member.ID {
					filtered = append(filtered, b)
				}
			}
			trainingBookings = filtered
		}
	} else if ok && currentUser.Role == "PT" {
		employee, err := h.employeeUsecase.GetEmployeeByAccountID(currentUser.AccountID)
		if err == nil {
			var filtered []*entity.TrainingBooking
			for _, b := range trainingBookings {
				if b.PTID == employee.ID {
					filtered = append(filtered, b)
				}
			}
			trainingBookings = filtered
		}
	}

	if trainingBookings == nil {
		trainingBookings = []*entity.TrainingBooking{}
	}
	w.Header().Set("Content-Type", "application/json")
	json.NewEncoder(w).Encode(trainingBookings)
}

func (h *TrainingBookingHandler) Update(w http.ResponseWriter, r *http.Request) {
	vars := mux.Vars(r)
	id, err := strconv.Atoi(vars["id"])
	if err != nil {
		http.Error(w, "Invalid ID", http.StatusBadRequest)
		return
	}

	// Fetch existing booking so we have MemberID and PTID for notifications
	existing, _ := h.usecase.GetTrainingBookingByID(id)

	var trainingBooking entity.TrainingBooking
	if err := json.NewDecoder(r.Body).Decode(&trainingBooking); err != nil {
		http.Error(w, err.Error(), http.StatusBadRequest)
		return
	}
	trainingBooking.ID = id

	if err := h.usecase.UpdateTrainingBooking(&trainingBooking); err != nil {
		http.Error(w, err.Error(), http.StatusInternalServerError)
		return
	}

	if trainingBooking.Status == "Accepted" {
		session := &entity.TrainingSession{
			BookingID:        trainingBooking.ID,
			SessionTime:      trainingBooking.RequestedStart,
			AttendanceStatus: "Absent",
		}
		h.trainingSessionUsecase.CreateTrainingSession(session)
	}

	// Send notifications based on new status
	if h.hub != nil && existing != nil {
		go h.notifyBookingStatusChange(existing, trainingBooking.Status, trainingBooking.RejectionReason)
	}

	w.Header().Set("Content-Type", "application/json")
	json.NewEncoder(w).Encode(trainingBooking)
}

func (h *TrainingBookingHandler) Delete(w http.ResponseWriter, r *http.Request) {
	vars := mux.Vars(r)
	id, err := strconv.Atoi(vars["id"])
	if err != nil {
		http.Error(w, "Invalid ID", http.StatusBadRequest)
		return
	}

	if err := h.usecase.DeleteTrainingBooking(id); err != nil {
		http.Error(w, err.Error(), http.StatusInternalServerError)
		return
	}

	w.WriteHeader(http.StatusNoContent)
}

// notifyPTNewBooking sends a notification to the PT when a member creates a booking request.
func (h *TrainingBookingHandler) notifyPTNewBooking(ptEmployeeID, memberID int) {
	pt, err := h.employeeUsecase.GetEmployeeByID(ptEmployeeID)
	if err != nil || pt.AccountID == 0 {
		return
	}
	memberName := "Hội viên"
	if member, err := h.memberUsecase.GetMemberByID(memberID); err == nil && member.FullName != "" {
		memberName = member.FullName
	}
	h.hub.Push(pt.AccountID, "booking_request", "Yêu cầu đặt lịch mới",
		fmt.Sprintf("%s đã gửi yêu cầu đặt lịch tập", memberName))
}

// notifyBookingStatusChange sends notifications after a booking status update.
func (h *TrainingBookingHandler) notifyBookingStatusChange(booking *entity.TrainingBooking, newStatus, rejectionReason string) {
	// Look up member account
	member, _ := h.memberUsecase.GetMemberByID(booking.MemberID)
	pt, _ := h.employeeUsecase.GetEmployeeByID(booking.PTID)

	ptName := "PT"
	if pt != nil && pt.FullName != "" {
		ptName = pt.FullName
	}
	memberName := "Hội viên"
	if member != nil && member.FullName != "" {
		memberName = member.FullName
	}

	switch newStatus {
	case "Accepted":
		if member != nil && member.AccountID != 0 {
			h.hub.Push(member.AccountID, "booking_accepted", "Lịch tập đã được chấp nhận",
				fmt.Sprintf("PT %s đã chấp nhận lịch tập của bạn", ptName))
		}
	case "Rejected":
		if member != nil && member.AccountID != 0 {
			body := fmt.Sprintf("PT %s đã từ chối lịch tập của bạn", ptName)
			if rejectionReason != "" {
				body += ": " + rejectionReason
			}
			h.hub.Push(member.AccountID, "booking_rejected", "Lịch tập bị từ chối", body)
		}
	case "Cancelled":
		if member != nil && member.AccountID != 0 {
			h.hub.Push(member.AccountID, "booking_cancelled", "Lịch tập đã bị hủy",
				"Một lịch tập của bạn đã bị hủy")
		}
		if pt != nil && pt.AccountID != 0 {
			h.hub.Push(pt.AccountID, "booking_cancelled", "Lịch tập đã bị hủy",
				fmt.Sprintf("Lịch tập với hội viên %s đã bị hủy", memberName))
		}
	}
}

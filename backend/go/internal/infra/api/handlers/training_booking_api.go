package handlers

import (
	"encoding/json"
	"net/http"
	"strconv"

	"gym-management/internal/domain/entity"
	"gym-management/internal/domain/usecase/employee_usecase"
	"gym-management/internal/domain/usecase/member_usecase"
	"gym-management/internal/domain/usecase/training_booking_usecase"
	"gym-management/internal/domain/usecase/training_session_usecase"
	"gym-management/internal/infra/api/middleware"

	"github.com/gorilla/mux"
)

type TrainingBookingHandler struct {
	usecase                training_booking_usecase.TrainingBookingUsecase
	memberUsecase          member_usecase.MemberUsecase
	employeeUsecase        employee_usecase.EmployeeUsecase
	trainingSessionUsecase training_session_usecase.TrainingSessionUsecase
}

func NewTrainingBookingHandler(u training_booking_usecase.TrainingBookingUsecase, mu member_usecase.MemberUsecase, eu employee_usecase.EmployeeUsecase, su training_session_usecase.TrainingSessionUsecase) *TrainingBookingHandler {
	return &TrainingBookingHandler{usecase: u, memberUsecase: mu, employeeUsecase: eu, trainingSessionUsecase: su}
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

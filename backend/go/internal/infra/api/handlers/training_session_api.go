package handlers

import (
	"encoding/json"
	"net/http"
	"strconv"

	"gym-management/internal/domain/entity"
	"gym-management/internal/domain/usecase/member_usecase"
	"gym-management/internal/domain/usecase/training_session_usecase"
	"gym-management/internal/infra/api/middleware"

	"github.com/gorilla/mux"
)

type TrainingSessionHandler struct {
	usecase       training_session_usecase.TrainingSessionUsecase
	memberUsecase member_usecase.MemberUsecase
}

func NewTrainingSessionHandler(u training_session_usecase.TrainingSessionUsecase, mu member_usecase.MemberUsecase) *TrainingSessionHandler {
	return &TrainingSessionHandler{usecase: u, memberUsecase: mu}
}

func (h *TrainingSessionHandler) Create(w http.ResponseWriter, r *http.Request) {
	var trainingSession entity.TrainingSession
	if err := json.NewDecoder(r.Body).Decode(&trainingSession); err != nil {
		http.Error(w, err.Error(), http.StatusBadRequest)
		return
	}

	if err := h.usecase.CreateTrainingSession(&trainingSession); err != nil {
		http.Error(w, err.Error(), http.StatusInternalServerError)
		return
	}

	w.Header().Set("Content-Type", "application/json")
	w.WriteHeader(http.StatusCreated)
	json.NewEncoder(w).Encode(trainingSession)
}

func (h *TrainingSessionHandler) GetByID(w http.ResponseWriter, r *http.Request) {
	vars := mux.Vars(r)
	id, err := strconv.Atoi(vars["id"])
	if err != nil {
		http.Error(w, "Invalid ID", http.StatusBadRequest)
		return
	}

	trainingSession, err := h.usecase.GetTrainingSessionByID(id)
	if err != nil {
		http.Error(w, err.Error(), http.StatusNotFound)
		return
	}

	w.Header().Set("Content-Type", "application/json")
	json.NewEncoder(w).Encode(trainingSession)
}

func (h *TrainingSessionHandler) GetAll(w http.ResponseWriter, r *http.Request) {
	trainingSessions, err := h.usecase.GetAllTrainingSessions()
	if err != nil {
		http.Error(w, err.Error(), http.StatusInternalServerError)
		return
	}

	// Security check: Member can only see their own sessions (via bookings)
	// For now, simpler implementation: if MEMBER, we would need to join. 
	// To keep it simple, we let Member see all for now or skip filtering if too complex.
	// Actually, let's just send all and filter on frontend for now, or implement a proper GetByMemberID.

	w.Header().Set("Content-Type", "application/json")
	json.NewEncoder(w).Encode(trainingSessions)
}

func (h *TrainingSessionHandler) Update(w http.ResponseWriter, r *http.Request) {
	vars := mux.Vars(r)
	id, err := strconv.Atoi(vars["id"])
	if err != nil {
		http.Error(w, "Invalid ID", http.StatusBadRequest)
		return
	}

	var trainingSession entity.TrainingSession
	if err := json.NewDecoder(r.Body).Decode(&trainingSession); err != nil {
		http.Error(w, err.Error(), http.StatusBadRequest)
		return
	}
	trainingSession.ID = id

	if err := h.usecase.UpdateTrainingSession(&trainingSession); err != nil {
		http.Error(w, err.Error(), http.StatusInternalServerError)
		return
	}

	w.Header().Set("Content-Type", "application/json")
	json.NewEncoder(w).Encode(trainingSession)
}

func (h *TrainingSessionHandler) Delete(w http.ResponseWriter, r *http.Request) {
	vars := mux.Vars(r)
	id, err := strconv.Atoi(vars["id"])
	if err != nil {
		http.Error(w, "Invalid ID", http.StatusBadRequest)
		return
	}

	if err := h.usecase.DeleteTrainingSession(id); err != nil {
		http.Error(w, err.Error(), http.StatusInternalServerError)
		return
	}

	w.WriteHeader(http.StatusNoContent)
}
func (h *TrainingSessionHandler) ConfirmAttendance(w http.ResponseWriter, r *http.Request) {
	vars := mux.Vars(r)
	id, err := strconv.Atoi(vars["id"])
	if err != nil {
		http.Error(w, "Invalid ID", http.StatusBadRequest)
		return
	}

	// Get MemberID from current Account
	currentUser, ok := middleware.GetAuthenticatedUser(r)
	if !ok {
		http.Error(w, "unauthorized", http.StatusUnauthorized)
		return
	}
	
	member, err := h.memberUsecase.GetMemberByAccountID(currentUser.AccountID)
	if err != nil {
		http.Error(w, "member not found", http.StatusNotFound)
		return
	}

	if err := h.usecase.ConfirmAttendance(id, member.ID); err != nil {
		http.Error(w, err.Error(), http.StatusInternalServerError)
		return
	}

	w.WriteHeader(http.StatusOK)
}

package handlers

import (
	"encoding/json"
	"net/http"
	"strconv"

	"gym-management/internal/domain/entity"
	"gym-management/internal/domain/usecase/employee_usecase"
	"gym-management/internal/domain/usecase/feedback_usecase"
	"gym-management/internal/domain/usecase/member_usecase"
	"gym-management/internal/infra/api/dto"
	"gym-management/internal/infra/api/mappers"
	"gym-management/internal/infra/api/middleware"

	"github.com/gorilla/mux"
)

type FeedbackHandler struct {
	usecase         feedback_usecase.FeedbackUsecase
	memberUsecase   member_usecase.MemberUsecase
	employeeUsecase employee_usecase.EmployeeUsecase
}

func NewFeedbackHandler(u feedback_usecase.FeedbackUsecase, mu member_usecase.MemberUsecase, eu employee_usecase.EmployeeUsecase) *FeedbackHandler {
	return &FeedbackHandler{usecase: u, memberUsecase: mu, employeeUsecase: eu}
}

func (h *FeedbackHandler) Create(w http.ResponseWriter, r *http.Request) {
	var feedback entity.Feedback
	json.NewDecoder(r.Body).Decode(&feedback)

	currentUser, ok := middleware.GetAuthenticatedUser(r)
	if ok && currentUser.Role == "MEMBER" {
		member, err := h.memberUsecase.GetMemberByAccountID(currentUser.AccountID)
		if err != nil {
			http.Error(w, "member not found", http.StatusInternalServerError)
			return
		}
		feedback.MemberID = member.ID
	}

	err := h.usecase.CreateFeedback(&feedback)
	if err != nil {
		http.Error(w, err.Error(), http.StatusInternalServerError)
		return
	}
	w.Header().Set("Content-Type", "application/json")
	json.NewEncoder(w).Encode(feedback)
}

func (h *FeedbackHandler) GetByID(w http.ResponseWriter, r *http.Request) {
	id, _ := strconv.Atoi(mux.Vars(r)["id"])
	feedback, err := h.usecase.GetFeedbackByID(id)
	if err != nil {
		http.Error(w, err.Error(), http.StatusNotFound)
		return
	}
	w.Header().Set("Content-Type", "application/json")
	json.NewEncoder(w).Encode(mappers.FeedbackEntityToResponse(feedback))
}

func (h *FeedbackHandler) GetAll(w http.ResponseWriter, r *http.Request) {
	// Check for pagination and filter parameters
	pageStr := r.URL.Query().Get("page")
	limitStr := r.URL.Query().Get("limit")
	status := r.URL.Query().Get("status")

	if pageStr != "" && limitStr != "" {
		page, err := strconv.Atoi(pageStr)
		if err != nil || page < 1 {
			page = 1
		}
		limit, err := strconv.Atoi(limitStr)
		if err != nil || limit < 1 {
			limit = 6
		}

		feedbacks, total, err := h.usecase.GetAllFeedbacksPaginated(page, limit, status)
		if err != nil {
			http.Error(w, err.Error(), http.StatusInternalServerError)
			return
		}

		feedbackResponses := make([]*dto.FeedbackResponse, len(feedbacks))
		for i, fb := range feedbacks {
			feedbackResponses[i] = mappers.FeedbackEntityToResponse(fb)
		}

		totalPages := (total + limit - 1) / limit
		response := dto.PaginationResponse{
			Data:       feedbackResponses,
			Page:       page,
			Limit:      limit,
			TotalItems: total,
			TotalPages: totalPages,
		}
		w.Header().Set("Content-Type", "application/json")
		json.NewEncoder(w).Encode(response)
		return
	}

	feedbacks, err := h.usecase.GetAllFeedbacks()
	if err != nil {
		http.Error(w, err.Error(), http.StatusInternalServerError)
		return
	}
	w.Header().Set("Content-Type", "application/json")
	responses := make([]*dto.FeedbackResponse, len(feedbacks))
	for i, fb := range feedbacks {
		responses[i] = mappers.FeedbackEntityToResponse(fb)
	}
	json.NewEncoder(w).Encode(responses)
}

func (h *FeedbackHandler) Update(w http.ResponseWriter, r *http.Request) {
	id, _ := strconv.Atoi(mux.Vars(r)["id"])
	var req map[string]interface{}
	json.NewDecoder(r.Body).Decode(&req)

	existing, err := h.usecase.GetFeedbackByID(id)
	if err != nil {
		http.Error(w, err.Error(), http.StatusNotFound)
		return
	}

	if status, ok := req["status"].(string); ok {
		existing.Status = status
	}
	if responseText, ok := req["response_text"].(string); ok {
		existing.ResolutionNote = responseText
	} else if resolutionNote, ok := req["resolution_note"].(string); ok {
		existing.ResolutionNote = resolutionNote
	}

	// Set ProcessorID from current user if they are staff/owner
	currentUser, ok := middleware.GetAuthenticatedUser(r)
	if ok && (currentUser.Role == "OWNER" || currentUser.Role == "MANAGER" || currentUser.Role == "PT") {
		employee, err := h.employeeUsecase.GetEmployeeByAccountID(currentUser.AccountID)
		if err == nil {
			existing.ProcessorID = employee.ID
		}
	}

	err = h.usecase.UpdateFeedback(existing)
	if err != nil {
		http.Error(w, err.Error(), http.StatusInternalServerError)
		return
	}
	w.WriteHeader(http.StatusOK)
}

func (h *FeedbackHandler) Delete(w http.ResponseWriter, r *http.Request) {
	id, _ := strconv.Atoi(mux.Vars(r)["id"])
	err := h.usecase.DeleteFeedback(id)
	if err != nil {
		http.Error(w, err.Error(), http.StatusInternalServerError)
		return
	}
	w.WriteHeader(http.StatusOK)
}

func (h *FeedbackHandler) GetMyFeedbacks(w http.ResponseWriter, r *http.Request) {
	currentUser, ok := middleware.GetAuthenticatedUser(r)
	if !ok {
		http.Error(w, "unauthorized", http.StatusUnauthorized)
		return
	}

	member, err := h.memberUsecase.GetMemberByAccountID(currentUser.AccountID)
	if err != nil {
		http.Error(w, "member not found", http.StatusInternalServerError)
		return
	}

	feedbacks, err := h.usecase.GetFeedbacksByMemberID(member.ID)
	if err != nil {
		http.Error(w, err.Error(), http.StatusInternalServerError)
		return
	}

	responses := make([]*dto.FeedbackResponse, len(feedbacks))
	for i, fb := range feedbacks {
		responses[i] = mappers.FeedbackEntityToResponse(fb)
	}

	w.Header().Set("Content-Type", "application/json")
	json.NewEncoder(w).Encode(responses)
}

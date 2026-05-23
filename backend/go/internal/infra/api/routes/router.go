package routes

import (
	"net/http"

	"gym-management/internal/infra/api/handlers"
	"gym-management/internal/infra/api/middleware"

	"github.com/gorilla/mux"
)

func NewRouter(
	authHandler *handlers.AuthHandler,
	memberHandler *handlers.MemberHandler,
	employeeHandler *handlers.EmployeeHandler,
	packageHandler *handlers.PackageHandler,
	equipmentHandler *handlers.EquipmentHandler,
	feedbackHandler *handlers.FeedbackHandler,
	invoiceHandler *handlers.InvoiceHandler,
	roleHandler *handlers.RoleHandler,
	facilityHandler *handlers.FacilityHandler,
	accountHandler *handlers.AccountHandler,
	serviceCategoryHandler *handlers.ServiceCategoryHandler,
	subscriptionHandler *handlers.SubscriptionHandler,
	trainingBookingHandler *handlers.TrainingBookingHandler,
	trainingSessionHandler *handlers.TrainingSessionHandler,
	ptDetailHandler *handlers.PTDetailHandler,
	notificationHandler *handlers.NotificationHandler,
	memberRegHandler *handlers.MemberRegistrationHandler,
) *mux.Router {
	r := mux.NewRouter()
	r.Use(middleware.LoggingMiddleware)
	r.Use(middleware.RecoveryMiddleware)
	RegisterAuthRoutes(r, authHandler)

	authenticated := r.PathPrefix("").Subrouter()
	authenticated.Use(middleware.AuthJWTMiddleware)

	// Authorization levels
	isOwnerManager := middleware.Authorize("OWNER", "MANAGER")
	isStaff := middleware.Authorize("OWNER", "MANAGER", "PT")
	isAnyRole := middleware.Authorize("OWNER", "MANAGER", "PT", "MEMBER")

	// Helper to apply middleware to a handler
	auth := func(mw mux.MiddlewareFunc, handler http.HandlerFunc) http.Handler {
		return mw(handler)
	}

	// These routes must be registered BEFORE subrouters.
	// ownerManager subrouter has routes (e.g. GET /members, GET /feedbacks, POST /subscriptions)
	// whose middleware (isOwnerManager) will 403 PT/MEMBER users before they can reach allRoles.
	// Pre-registering here with isAnyRole lets them match first.
	authenticated.Handle("/members", auth(isAnyRole, memberHandler.GetAll)).Methods("GET")
	authenticated.Handle("/feedbacks", auth(isAnyRole, feedbackHandler.GetAll)).Methods("GET")
	authenticated.Handle("/subscriptions", auth(isAnyRole, subscriptionHandler.Create)).Methods("POST")
	authenticated.Handle("/pt-details/me", auth(isAnyRole, ptDetailHandler.GetMe)).Methods("GET")
	authenticated.Handle("/pt-details/me", auth(isAnyRole, ptDetailHandler.UpdateMe)).Methods("PUT")
	authenticated.Handle("/members/me/subscriptions", auth(isAnyRole, subscriptionHandler.GetMySubscriptions)).Methods("GET")
	authenticated.Handle("/members/me/feedbacks", auth(isAnyRole, feedbackHandler.GetMyFeedbacks)).Methods("GET")
	// Member self-update: handler internally restricts MEMBER to their own profile only
	authenticated.Handle("/members/{id}", auth(isAnyRole, memberHandler.Update)).Methods("PUT")

	// Change password — available to all authenticated users
	authenticated.Handle("/auth/change-password", auth(isAnyRole, authHandler.ChangePassword)).Methods("PUT")

	// Facilities GET — readable by all roles (PT needs it for session evaluation)
	authenticated.Handle("/facilities", auth(isAnyRole, facilityHandler.GetAll)).Methods("GET")
	authenticated.Handle("/facilities/{id}", auth(isAnyRole, facilityHandler.GetByID)).Methods("GET")

	// Owner/Manager only routes (admin and configuration)
	ownerManager := authenticated.PathPrefix("").Subrouter()
	ownerManager.Use(isOwnerManager)

	ownerManager.HandleFunc("/employees", employeeHandler.Create).Methods("POST")
	ownerManager.HandleFunc("/employees", employeeHandler.GetAll).Methods("GET")
	ownerManager.HandleFunc("/employees/{id}", employeeHandler.GetByID).Methods("GET")
	ownerManager.HandleFunc("/employees/{id}", employeeHandler.Update).Methods("PUT")
	ownerManager.HandleFunc("/employees/{id}", employeeHandler.Delete).Methods("DELETE")

	ownerManager.HandleFunc("/roles", roleHandler.Create).Methods("POST")
	ownerManager.HandleFunc("/roles", roleHandler.GetAll).Methods("GET")
	ownerManager.HandleFunc("/roles/{id}", roleHandler.GetByID).Methods("GET")
	ownerManager.HandleFunc("/roles/{id}", roleHandler.Update).Methods("PUT")
	ownerManager.HandleFunc("/roles/{id}", roleHandler.Delete).Methods("DELETE")

	ownerManager.HandleFunc("/facilities", facilityHandler.Create).Methods("POST")
	ownerManager.HandleFunc("/facilities", facilityHandler.GetAll).Methods("GET")
	ownerManager.HandleFunc("/facilities/{id}", facilityHandler.GetByID).Methods("GET")
	ownerManager.HandleFunc("/facilities/{id}", facilityHandler.Update).Methods("PUT")
	ownerManager.HandleFunc("/facilities/{id}/status", facilityHandler.UpdateStatus).Methods("PATCH")
	ownerManager.HandleFunc("/facilities/{id}", facilityHandler.Delete).Methods("DELETE")

	ownerManager.HandleFunc("/equipments", equipmentHandler.Create).Methods("POST")
	ownerManager.HandleFunc("/equipments", equipmentHandler.GetAll).Methods("GET")
	ownerManager.HandleFunc("/equipments/{id}", equipmentHandler.GetByID).Methods("GET")
	ownerManager.HandleFunc("/equipments/{id}", equipmentHandler.Update).Methods("PUT")
	ownerManager.HandleFunc("/equipments/{id}", equipmentHandler.Delete).Methods("DELETE")

	ownerManager.HandleFunc("/accounts", accountHandler.Create).Methods("POST")
	ownerManager.HandleFunc("/accounts", accountHandler.GetAll).Methods("GET")
	ownerManager.HandleFunc("/accounts/{id}", accountHandler.GetByID).Methods("GET")
	ownerManager.HandleFunc("/accounts/{id}", accountHandler.Update).Methods("PUT")
	ownerManager.HandleFunc("/accounts/{id}/reveal", accountHandler.RevealPassword).Methods("POST")
	ownerManager.HandleFunc("/accounts/{id}", accountHandler.Delete).Methods("DELETE")

	ownerManager.HandleFunc("/service-categories", serviceCategoryHandler.Create).Methods("POST")
	ownerManager.HandleFunc("/service-categories", serviceCategoryHandler.GetAll).Methods("GET")
	ownerManager.HandleFunc("/service-categories/{id}", serviceCategoryHandler.GetByID).Methods("GET")
	ownerManager.HandleFunc("/service-categories/{id}", serviceCategoryHandler.Update).Methods("PUT")
	ownerManager.HandleFunc("/service-categories/{id}", serviceCategoryHandler.Delete).Methods("DELETE")

	ownerManager.HandleFunc("/packages", packageHandler.Create).Methods("POST")
	ownerManager.HandleFunc("/packages/{id}", packageHandler.Update).Methods("PUT")
	ownerManager.HandleFunc("/packages/{id}/status", packageHandler.UpdateStatus).Methods("PATCH")
	ownerManager.HandleFunc("/packages/{id}", packageHandler.Delete).Methods("DELETE")

	ownerManager.HandleFunc("/members/create-with-account", memberRegHandler.CreateMemberWithAccount).Methods("POST")
	ownerManager.HandleFunc("/members", memberHandler.Create).Methods("POST")
	ownerManager.HandleFunc("/members", memberHandler.GetAll).Methods("GET")
	ownerManager.HandleFunc("/members/{id}", memberHandler.Update).Methods("PUT")
	ownerManager.HandleFunc("/members/{id}/status", memberHandler.UpdateStatus).Methods("PUT")
	ownerManager.HandleFunc("/members/{id}", memberHandler.Delete).Methods("DELETE")

	ownerManager.HandleFunc("/feedbacks", feedbackHandler.GetAll).Methods("GET")
	ownerManager.HandleFunc("/feedbacks/{id}", feedbackHandler.Update).Methods("PUT")
	ownerManager.HandleFunc("/feedbacks/{id}", feedbackHandler.Delete).Methods("DELETE")
	ownerManager.HandleFunc("/transactions", invoiceHandler.GetTransactions).Methods("GET")

	ownerManager.HandleFunc("/subscriptions", subscriptionHandler.Create).Methods("POST")
	ownerManager.HandleFunc("/subscriptions/{id}", subscriptionHandler.Update).Methods("PUT")
	ownerManager.HandleFunc("/subscriptions/{id}", subscriptionHandler.Delete).Methods("DELETE")
	ownerManager.HandleFunc("/members/{memberId}/subscriptions", subscriptionHandler.GetHistoryByMemberID).Methods("GET")

	ownerManager.HandleFunc("/pt-details", ptDetailHandler.Create).Methods("POST")
	ownerManager.HandleFunc("/pt-details/{employeeID}", ptDetailHandler.Update).Methods("PUT")
	ownerManager.HandleFunc("/pt-details/{employeeID}", ptDetailHandler.Delete).Methods("DELETE")

	// Shared routes for Staff (Owner/Manager/PT) - Only define what's NOT in allRoles
	staff := authenticated.PathPrefix("").Subrouter()
	staff.Use(isStaff)

	staff.HandleFunc("/subscriptions", subscriptionHandler.GetAll).Methods("GET")
	staff.HandleFunc("/training-bookings/{id}", trainingBookingHandler.Update).Methods("PUT")
	staff.HandleFunc("/training-bookings/{id}", trainingBookingHandler.Delete).Methods("DELETE")
	staff.HandleFunc("/training-sessions", trainingSessionHandler.Create).Methods("POST")
	staff.HandleFunc("/training-sessions/{id}", trainingSessionHandler.Update).Methods("PUT")
	staff.HandleFunc("/training-sessions/{id}", trainingSessionHandler.Delete).Methods("DELETE")

	// All authenticated roles (Owner/Manager/PT/Member)
	// These must not overlap in a way that blocks specific methods in earlier groups
	allRoles := authenticated.PathPrefix("").Subrouter()
	allRoles.Use(isAnyRole)

	// IMPORTANT: Use specific handlers for shared paths to avoid Method conflicts
	allRoles.HandleFunc("/members", memberHandler.GetAll).Methods("GET")
	allRoles.HandleFunc("/packages", packageHandler.GetAll).Methods("GET")
	allRoles.HandleFunc("/packages/{id}", packageHandler.GetByID).Methods("GET")

	// Member-specific: specific paths first
	allRoles.HandleFunc("/members/me/subscriptions", subscriptionHandler.GetMySubscriptions).Methods("GET")
	allRoles.HandleFunc("/members/me/feedbacks", feedbackHandler.GetMyFeedbacks).Methods("GET")
	allRoles.HandleFunc("/members/account/{id}", memberHandler.GetByAccountID).Methods("GET")
	allRoles.HandleFunc("/members/{id}", memberHandler.GetByID).Methods("GET")
	allRoles.HandleFunc("/members/{id}", memberHandler.Update).Methods("PUT")
	allRoles.HandleFunc("/members/{memberId}/subscriptions", subscriptionHandler.GetHistoryByMemberID).Methods("GET")

	// Subscription routes
	allRoles.HandleFunc("/subscriptions", subscriptionHandler.Create).Methods("POST")
	allRoles.HandleFunc("/subscriptions/{id}", subscriptionHandler.GetByID).Methods("GET")
	allRoles.HandleFunc("/subscriptions/{id}/renew", subscriptionHandler.Renew).Methods("PATCH")

	// PT details (GET/PUT /pt-details/me registered early above to beat the wildcard)
	allRoles.HandleFunc("/pt-details/{employeeID}", ptDetailHandler.GetByID).Methods("GET")
	allRoles.HandleFunc("/pt-details", ptDetailHandler.GetAll).Methods("GET")

	// Training routes
	allRoles.HandleFunc("/training-bookings", trainingBookingHandler.GetAll).Methods("GET")
	allRoles.HandleFunc("/training-bookings", trainingBookingHandler.Create).Methods("POST")
	allRoles.HandleFunc("/training-bookings/{id}", trainingBookingHandler.GetByID).Methods("GET")
	allRoles.HandleFunc("/training-sessions", trainingSessionHandler.GetAll).Methods("GET")
	allRoles.HandleFunc("/training-sessions/{id}", trainingSessionHandler.GetByID).Methods("GET")
	allRoles.HandleFunc("/training-sessions/{id}/confirm", trainingSessionHandler.ConfirmAttendance).Methods("POST")

	// Feedback routes
	allRoles.HandleFunc("/feedbacks", feedbackHandler.GetAll).Methods("GET")
	allRoles.Handle("/feedbacks", auth(isAnyRole, feedbackHandler.Create)).Methods("POST")
	allRoles.Handle("/feedbacks/{id}", auth(isAnyRole, feedbackHandler.GetByID)).Methods("GET")
	allRoles.Handle("/feedbacks/{id}", auth(isStaff, feedbackHandler.Update)).Methods("PUT")

	// Notification routes
	// SSE stream uses ?token= query param auth (EventSource can't set headers)
	r.HandleFunc("/notifications/stream", notificationHandler.Stream).Methods("GET")
	allRoles.HandleFunc("/notifications", notificationHandler.GetHistory).Methods("GET")
	allRoles.HandleFunc("/notifications/read-all", notificationHandler.MarkAllRead).Methods("POST")

	return r
}

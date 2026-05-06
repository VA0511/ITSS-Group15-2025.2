package routes

import (
	"gym-management/internal/infra/api/handlers"
	"gym-management/internal/infra/api/middleware"

	"github.com/gorilla/mux"
)

func RegisterAuthRoutes(r *mux.Router, authHandler *handlers.AuthHandler) {
	r.HandleFunc("/auth/login", authHandler.Login).Methods("POST")
	r.HandleFunc("/auth/refresh", authHandler.Refresh).Methods("POST")
	r.HandleFunc("/auth/logout", authHandler.Logout).Methods("POST")

	protected := r.PathPrefix("/auth").Subrouter()
	protected.Use(middleware.AuthJWTMiddleware)
	protected.HandleFunc("/me", authHandler.Me).Methods("GET")
}

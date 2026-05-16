package handlers

import (
	"encoding/json"
	"fmt"
	"net/http"
	"os"
	"strconv"
	"strings"
	"time"

	"gym-management/internal/infra/api/middleware"
	"gym-management/internal/infra/notification"

	"github.com/golang-jwt/jwt/v5"
)

type NotificationHandler struct {
	hub *notification.Hub
}

func NewNotificationHandler(hub *notification.Hub) *NotificationHandler {
	return &NotificationHandler{hub: hub}
}

// parseSSEToken validates JWT from ?token= query param (used by EventSource which can't set headers).
func parseSSEToken(r *http.Request) (int, error) {
	raw := r.URL.Query().Get("token")
	if raw == "" {
		return 0, fmt.Errorf("missing token")
	}
	secret := os.Getenv("JWT_SECRET")
	if strings.TrimSpace(secret) == "" {
		secret = "dev-only-secret-change-me"
	}
	claims := jwt.MapClaims{}
	token, err := jwt.ParseWithClaims(raw, claims, func(t *jwt.Token) (interface{}, error) {
		if t.Method != jwt.SigningMethodHS256 {
			return nil, fmt.Errorf("unexpected signing method")
		}
		return []byte(secret), nil
	})
	if err != nil || !token.Valid {
		return 0, fmt.Errorf("invalid token")
	}
	sub, ok := claims["sub"].(string)
	if !ok {
		return 0, fmt.Errorf("missing sub")
	}
	id, err := strconv.Atoi(sub)
	if err != nil || id <= 0 {
		return 0, fmt.Errorf("invalid sub")
	}
	return id, nil
}

// GET /notifications/stream?token=<jwt>  (SSE — no Authorization header because EventSource can't set one)
func (h *NotificationHandler) Stream(w http.ResponseWriter, r *http.Request) {
	accountID, err := parseSSEToken(r)
	if err != nil {
		http.Error(w, "unauthorized", http.StatusUnauthorized)
		return
	}

	flusher, ok := w.(http.Flusher)
	if !ok {
		http.Error(w, "streaming unsupported", http.StatusInternalServerError)
		return
	}

	w.Header().Set("Content-Type", "text/event-stream")
	w.Header().Set("Cache-Control", "no-cache")
	w.Header().Set("Connection", "keep-alive")
	w.Header().Set("X-Accel-Buffering", "no")

	ch := h.hub.Subscribe(accountID)
	defer h.hub.Unsubscribe(accountID, ch)

	fmt.Fprintf(w, ": connected\n\n")
	flusher.Flush()

	heartbeat := time.NewTicker(30 * time.Second)
	defer heartbeat.Stop()

	for {
		select {
		case <-r.Context().Done():
			return
		case <-heartbeat.C:
			fmt.Fprintf(w, ": ping\n\n")
			flusher.Flush()
		case n := <-ch:
			data, _ := json.Marshal(n)
			fmt.Fprintf(w, "data: %s\n\n", data)
			flusher.Flush()
		}
	}
}

// GET /notifications  (requires standard JWT middleware)
func (h *NotificationHandler) GetHistory(w http.ResponseWriter, r *http.Request) {
	user, ok := middleware.GetAuthenticatedUser(r)
	if !ok {
		http.Error(w, "unauthorized", http.StatusUnauthorized)
		return
	}
	history := h.hub.GetHistory(user.AccountID)
	if history == nil {
		history = []notification.Notification{}
	}
	w.Header().Set("Content-Type", "application/json")
	json.NewEncoder(w).Encode(history)
}

// POST /notifications/read-all  (requires standard JWT middleware)
func (h *NotificationHandler) MarkAllRead(w http.ResponseWriter, r *http.Request) {
	user, ok := middleware.GetAuthenticatedUser(r)
	if !ok {
		http.Error(w, "unauthorized", http.StatusUnauthorized)
		return
	}
	h.hub.MarkAllRead(user.AccountID)
	w.WriteHeader(http.StatusNoContent)
}

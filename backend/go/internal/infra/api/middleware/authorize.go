package middleware

import (
	"net/http"
	"strings"

	"github.com/gorilla/mux"
)

func Authorize(roles ...string) mux.MiddlewareFunc {
	allowedRoles := make(map[string]struct{}, len(roles))
	for _, role := range roles {
		allowedRoles[strings.ToUpper(strings.TrimSpace(role))] = struct{}{}
	}

	return func(next http.Handler) http.Handler {
		return http.HandlerFunc(func(w http.ResponseWriter, r *http.Request) {
			user, ok := GetAuthenticatedUser(r)
			if !ok {
				http.Error(w, "unauthorized", http.StatusUnauthorized)
				return
			}

			if len(allowedRoles) == 0 {
				next.ServeHTTP(w, r)
				return
			}

			roleKey := strings.ToUpper(strings.TrimSpace(user.Role))
			if _, found := allowedRoles[roleKey]; !found {
				http.Error(w, "forbidden", http.StatusForbidden)
				return
			}

			next.ServeHTTP(w, r)
		})
	}
}

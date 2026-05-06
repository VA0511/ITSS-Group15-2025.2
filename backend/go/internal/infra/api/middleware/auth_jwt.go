package middleware

import (
	"context"
	"errors"
	"fmt"
	"net/http"
	"os"
	"strconv"
	"strings"

	"github.com/golang-jwt/jwt/v5"
)

type authContextKey string

const authenticatedUserKey authContextKey = "authenticated_user"

type AuthenticatedUser struct {
	AccountID int
	Username  string
	Role      string
}

func AuthJWTMiddleware(next http.Handler) http.Handler {
	return http.HandlerFunc(func(w http.ResponseWriter, r *http.Request) {
		authHeader := r.Header.Get("Authorization")
		if authHeader == "" {
			http.Error(w, "missing authorization header", http.StatusUnauthorized)
			return
		}

		parts := strings.SplitN(authHeader, " ", 2)
		if len(parts) != 2 || !strings.EqualFold(parts[0], "Bearer") {
			http.Error(w, "invalid authorization header", http.StatusUnauthorized)
			return
		}

		rawToken := strings.TrimSpace(parts[1])
		claims := jwt.MapClaims{}
		token, err := jwt.ParseWithClaims(rawToken, claims, func(token *jwt.Token) (interface{}, error) {
			if token.Method != jwt.SigningMethodHS256 {
				return nil, fmt.Errorf("unexpected signing method")
			}
			return []byte(getJWTSecret()), nil
		})
		if err != nil || !token.Valid {
			http.Error(w, "invalid token", http.StatusUnauthorized)
			return
		}

		tokenType, ok := claims["token_type"].(string)
		if !ok || tokenType != "access" {
			http.Error(w, "invalid token type", http.StatusUnauthorized)
			return
		}

		user, err := userFromClaims(claims)
		if err != nil {
			http.Error(w, "invalid token claims", http.StatusUnauthorized)
			return
		}

		ctx := context.WithValue(r.Context(), authenticatedUserKey, user)
		r = r.WithContext(ctx)
		next.ServeHTTP(w, r)
	})
}

func GetAuthenticatedUser(r *http.Request) (*AuthenticatedUser, bool) {
	value := r.Context().Value(authenticatedUserKey)
	user, ok := value.(*AuthenticatedUser)
	return user, ok
}

func userFromClaims(claims jwt.MapClaims) (*AuthenticatedUser, error) {
	sub, ok := claims["sub"].(string)
	if !ok || strings.TrimSpace(sub) == "" {
		return nil, errors.New("missing sub")
	}
	accountID, err := strconv.Atoi(sub)
	if err != nil || accountID <= 0 {
		return nil, errors.New("invalid sub")
	}

	username, ok := claims["username"].(string)
	if !ok || strings.TrimSpace(username) == "" {
		return nil, errors.New("missing username")
	}

	role, ok := claims["role"].(string)
	if !ok || strings.TrimSpace(role) == "" {
		return nil, errors.New("missing role")
	}

	return &AuthenticatedUser{
		AccountID: accountID,
		Username:  username,
		Role:      role,
	}, nil
}

func getJWTSecret() string {
	secret := os.Getenv("JWT_SECRET")
	if strings.TrimSpace(secret) == "" {
		return "dev-only-secret-change-me"
	}
	return secret
}

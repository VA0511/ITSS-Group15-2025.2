package auth_usecase

import (
	"crypto/rand"
	"crypto/sha256"
	"encoding/hex"
	"errors"
	"fmt"
	"strconv"
	"strings"
	"time"

	"github.com/golang-jwt/jwt/v5"
)

type parsedRefreshClaims struct {
	AccountID int
	Username  string
	Role      string
}

func (u *authUsecase) generateAuthTokens(accountID int, username, role string) (*AuthResult, time.Time, error) {
	now := time.Now().UTC()
	accessExpiry := now.Add(u.accessTTL)
	refreshExpiry := now.Add(u.refreshTTL)

	accessJTI, err := generateJTI()
	if err != nil {
		return nil, time.Time{}, err
	}
	refreshJTI, err := generateJTI()
	if err != nil {
		return nil, time.Time{}, err
	}

	accessClaims := jwt.MapClaims{
		"sub":        strconv.Itoa(accountID),
		"username":   username,
		"role":       role,
		"token_type": "access",
		"iat":        now.Unix(),
		"exp":        accessExpiry.Unix(),
		"jti":        accessJTI,
	}
	refreshClaims := jwt.MapClaims{
		"sub":        strconv.Itoa(accountID),
		"username":   username,
		"role":       role,
		"token_type": "refresh",
		"iat":        now.Unix(),
		"exp":        refreshExpiry.Unix(),
		"jti":        refreshJTI,
	}

	accessToken, err := jwt.NewWithClaims(jwt.SigningMethodHS256, accessClaims).SignedString(u.jwtSecret)
	if err != nil {
		return nil, time.Time{}, err
	}
	refreshToken, err := jwt.NewWithClaims(jwt.SigningMethodHS256, refreshClaims).SignedString(u.jwtSecret)
	if err != nil {
		return nil, time.Time{}, err
	}

	return &AuthResult{
		AccountID:     accountID,
		Username:      username,
		Role:          role,
		AccessToken:   accessToken,
		RefreshToken:  refreshToken,
		TokenType:     "Bearer",
		ExpiresInSecs: int64(u.accessTTL.Seconds()),
	}, refreshExpiry, nil
}

func (u *authUsecase) parseRefreshToken(rawToken string) (*parsedRefreshClaims, error) {
	if strings.TrimSpace(rawToken) == "" {
		return nil, ErrInvalidInput
	}

	claims := jwt.MapClaims{}
	token, err := jwt.ParseWithClaims(rawToken, claims, func(token *jwt.Token) (interface{}, error) {
		if token.Method != jwt.SigningMethodHS256 {
			return nil, fmt.Errorf("unexpected signing method")
		}
		return u.jwtSecret, nil
	})
	if err != nil || !token.Valid {
		return nil, ErrUnauthorized
	}

	typeValue, ok := claims["token_type"].(string)
	if !ok || typeValue != "refresh" {
		return nil, ErrUnauthorized
	}

	sub, ok := claims["sub"].(string)
	if !ok || sub == "" {
		return nil, ErrUnauthorized
	}
	accountID, err := strconv.Atoi(sub)
	if err != nil || accountID <= 0 {
		return nil, ErrUnauthorized
	}

	username, ok := claims["username"].(string)
	if !ok || strings.TrimSpace(username) == "" {
		return nil, ErrUnauthorized
	}
	role, ok := claims["role"].(string)
	if !ok || strings.TrimSpace(role) == "" {
		return nil, ErrUnauthorized
	}

	return &parsedRefreshClaims{AccountID: accountID, Username: username, Role: role}, nil
}

func hashRefreshToken(rawToken string) (string, error) {
	if strings.TrimSpace(rawToken) == "" {
		return "", errors.New("refresh token cannot be empty")
	}
	sum := sha256.Sum256([]byte(rawToken))
	return hex.EncodeToString(sum[:]), nil
}

func generateJTI() (string, error) {
	buf := make([]byte, 16)
	if _, err := rand.Read(buf); err != nil {
		return "", err
	}
	return hex.EncodeToString(buf), nil
}

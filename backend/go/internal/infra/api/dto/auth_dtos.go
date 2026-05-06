package dto

type LoginRequest struct {
	Username string `json:"username"`
	Email    string `json:"email"`
	Password string `json:"password"`
}

type RefreshRequest struct {
	RefreshToken string `json:"refresh_token"`
}

type LogoutRequest struct {
	RefreshToken string `json:"refresh_token"`
}

type AuthUserResponse struct {
	ID       int    `json:"id"`
	Email    string `json:"email"`
	Role     string `json:"role"`
	Username string `json:"username,omitempty"`
}

type AuthResponse struct {
	AccountID     int               `json:"account_id"`
	Username      string            `json:"username"`
	Role          string            `json:"role"`
	AccessToken   string            `json:"access_token"`
	RefreshToken  string            `json:"refresh_token,omitempty"`
	TokenType     string            `json:"token_type"`
	ExpiresInSecs int64             `json:"expires_in_secs"`
	User          *AuthUserResponse `json:"user,omitempty"`
	Token         string            `json:"token,omitempty"`
}

package entity

type Account struct {
	ID           int    `json:"id"`
	Username     string `json:"username"`
	Password     string `json:"-"`
	RoleID       int    `json:"role_id"`
	Email        string `json:"email"`
	IsFirstLogin bool   `json:"is_first_login"`
}

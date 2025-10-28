package config

type SignupRequest struct {
	Email    string `json:"email" binding:"required,email"`
	Password string `json:"password" binding:"required"`
}

type ApprovePayload struct {
	UserID string `json:"user_id"`
	RoleID string `json:"role_id"`
	Action string `json:"action,omitempty"` // "approve" | "reject" | "deactivate"
}

type RoleData struct {
	Name string `json:"name" binding:"required"`
}

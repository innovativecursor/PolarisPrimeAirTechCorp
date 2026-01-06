package config

type CreateProjectRequest struct {
	ProjectName string `json:"project_name" binding:"required"`
	CustomerID  string `json:"customer_id" binding:"required"`
	Notes       string `json:"notes"`
}

type UpdateProjectRequest struct {
	ProjectName string `json:"project_name"`
	CustomerID  string `json:"customer_id"`
	Notes       string `json:"notes"`
}

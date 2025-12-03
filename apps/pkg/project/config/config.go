package config

type ProjectRequest struct {
	ProjectName          string `json:"project_name"`
	CustomerID           string `json:"customer_id"`
	CustomerOrganization string `json:"customer_organization"`
	CustomerAddress      string `json:"customer_address"`
	Notes                string `json:"notes"`
}

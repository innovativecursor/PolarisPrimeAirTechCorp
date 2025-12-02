package config

type ReportRequest struct {
	ReportType string `json:"reportType"` // "customer", "supplier", "sales", etc.
	StartDate  string `json:"startDate"`
	EndDate    string `json:"endDate"`
	ExportType string `json:"exportType"` // "pdf", "excel", "csv"
}

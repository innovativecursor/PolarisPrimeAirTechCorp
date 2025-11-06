package config

type UpsertQuotation struct {
	QuotationID string          `json:"quotationId,omitempty"` // Only used during update
	CustomerID  string          `json:"customerId"`
	Items       []QuotationItem `json:"items"`
}

type QuotationItem struct {
	Description string  `json:"description"`
	Quantity    int     `json:"quantity"`
	Rate        float64 `json:"rate"`
}

type ToggleQuotationStatus struct {
	QuotationID string `json:"quotationId"`
}

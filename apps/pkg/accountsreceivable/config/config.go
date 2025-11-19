package config

type CreateInvoicePayload struct {
	ProjectID    string               `json:"project_id" binding:"required"`
	CustomerID   string               `json:"customer_id" binding:"required"`
	SalesOrderID string               `json:"sales_order_id" binding:"required"`
	Items        []InvoiceItemPayload `json:"items" binding:"required,dive"`
}

type InvoiceItemPayload struct {
	SKU      string `json:"sku" binding:"required"`
	Quantity int    `json:"quantity" binding:"required,min=1"`
}

type CreateDeliveryReceiptPayload struct {
	ProjectID      string `json:"project_id" binding:"required"`
	CustomerID     string `json:"customer_id" binding:"required"`
	SalesOrderID   string `json:"sales_order_id" binding:"required"`
	SalesInvoiceID string `json:"sales_invoice_id" binding:"required"`
}

type UpdateDeliveryReceiptPayload struct {
	Status string `json:"status,omitempty"`
}

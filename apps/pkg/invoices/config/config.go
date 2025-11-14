package config

// For Create/Update API
type InvoicePayload struct {
	ProjectID    string        `json:"projectId" binding:"required"`
	CustomerID   string        `json:"customerId" binding:"required"`
	SalesOrderID string        `json:"salesOrderId" binding:"required"`
	Items        []InvoiceItem `json:"items" binding:"required,dive"`
}

//  Item
type InvoiceItem struct {
	SKUNumber string `bson:"sku_number" json:"sku_number"`
	Qty       int    `bson:"qty" json:"qty"`
	UOM       string `bson:"uom" json:"uom"`
}

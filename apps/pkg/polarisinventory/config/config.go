package config

type AddUpdateInventory struct {
	SKU               string  `json:"sku" binding:"required"`
	Barcode           string  `json:"barcode,omitempty"`
	AirconModelNumber string  `json:"aircon_model_number" binding:"required"`
	AirconName        string  `json:"aircon_name" binding:"required"`
	HP                string  `json:"hp" binding:"required"`
	TypeOfAircon      string  `json:"type_of_aircon" binding:"required"`
	IndoorOutdoorUnit string  `json:"indoor_outdoor_unit" binding:"required"`
	Quantity          int     `json:"quantity" binding:"required,min=1"`
	Price             float64 `json:"price" binding:"required"`
}

type AddUpdateInventoryRR struct {
	ID                string  `json:"id,omitempty"`
	SKU               string  `json:"sku"`
	Barcode           string  `json:"barcode,omitempty"`
	AirconModelNumber string  `json:"aircon_model_number"`
	AirconName        string  `json:"aircon_name"`
	HP                string  `json:"hp"`
	TypeOfAircon      string  `json:"type_of_aircon"`
	IndoorOutdoorUnit string  `json:"indoor_outdoor_unit"`
	Quantity          int     `json:"quantity"`
	Price             float64 `json:"price" binding:"required"`

	// Receiving Report links
	SupplierDRID      string `json:"supplier_dr_id,omitempty"`
	SupplierInvoiceID string `json:"supplier_invoice_id,omitempty"`
	PurchaseOrderID   string `json:"purchase_order_id,omitempty"`
	SalesOrderID      string `json:"sales_order_id,omitempty"`
}

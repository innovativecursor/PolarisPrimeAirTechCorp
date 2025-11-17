package config

type SupplierInvoiceData struct {
	SupplierID      string                `json:"supplier_id"`
	InvoiceNo       string                `json:"invoice_no"`
	InvoiceDate     string                `json:"invoice_date"` // yyyy-mm-dd
	DeliveryNo      string                `json:"delivery_no"`
	SAPRefNo        string                `json:"sap_ref_no"`
	PurchaseOrderNo string                `json:"purchase_order_no"`
	DueDate         string                `json:"due_date"` // yyyy-mm-dd
	DeliveryAddress string                `json:"delivery_address"`
	Items           []SupplierInvoiceItem `json:"items"`
	TotalSales      float64               `json:"total_sales"`
	VAT             float64               `json:"vat"`
	GrandTotal      float64               `json:"grand_total"`
}

type SupplierInvoiceItem struct {
	Description string  `json:"description"`
	Qty         int     `json:"qty"`
	Unit        string  `json:"unit"`
	UnitPrice   float64 `json:"unit_price"`
	Amount      float64 `json:"amount"`
}

type EditSupplierInvoice struct {
	ID              string                `json:"id"`
	SupplierID      string                `json:"supplier_id"`
	InvoiceNo       string                `json:"invoice_no"`
	InvoiceDate     string                `json:"invoice_date"`
	DeliveryNo      string                `json:"delivery_no"`
	SAPRefNo        string                `json:"sap_ref_no"`
	PurchaseOrderNo string                `json:"purchase_order_no"`
	DueDate         string                `json:"due_date"`
	DeliveryAddress string                `json:"delivery_address"`
	Items           []SupplierInvoiceItem `json:"items"`
	TotalSales      float64               `json:"total_sales"`
	VAT             float64               `json:"vat"`
	GrandTotal      float64               `json:"grand_total"`
}

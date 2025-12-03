package config

type SupplierDRData struct {
	SupplierID   string           `json:"supplier_id"`
	ProjectID    string           `json:"project_id"`
	SupplierDRNo string           `json:"supplier_dr_no"`
	YourPONo     string           `json:"your_po_no"`
	Date         string           `json:"date"`
	Items        []SupplierDRItem `json:"items"`
}

type SupplierDRItem struct {
	Description string `json:"description"`
	Qty         int    `json:"qty"`
	Unit        string `json:"unit"`
}

type EditSupplierDR struct {
	ID           string           `json:"id"`
	SupplierID   string           `json:"supplier_id"`
	ProjectID    string           `json:"project_id"`
	SupplierDRNo string           `json:"supplier_dr_no"`
	YourPONo     string           `json:"your_po_no"`
	Date         string           `json:"date"`
	Items        []SupplierDRItem `json:"items"`
}

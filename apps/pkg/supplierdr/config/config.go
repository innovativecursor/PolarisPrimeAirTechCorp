package config

type SupplierDRData struct {
	SupplierID   string           `json:"supplier_id"`
	ProjectID    string           `json:"project_id"`
	SupplierDRNo string           `json:"supplier_dr_no"`
	YourPONo     string           `json:"your_po_no"`
	DispatchDate string           `json:"dispatch_date"`
	ShipTo       string           `json:"ship_to"`
	Reference    string           `json:"reference"` // Pick Up / Delivery
	Date         string           `json:"date"`
	Items        []SupplierDRItem `json:"items"`
}

type SupplierDRItem struct {
	LineNo      int      `json:"line_no"`
	Model       string   `json:"model"`
	Description string   `json:"description"`
	Plant       string   `json:"plant"`
	StorLoc     string   `json:"stor_loc"`
	Unit        string   `json:"unit"`
	ShipQty     int      `json:"ship_qty"`
	TotalCBM    float64  `json:"total_cbm"`
	TotalKGS    float64  `json:"total_kgs"`
	SerialNos   []string `json:"serial_nos"`
}

type EditSupplierDR struct {
	ID           string           `json:"id"`
	SupplierID   string           `json:"supplier_id"`
	ProjectID    string           `json:"project_id"`
	SupplierDRNo string           `json:"supplier_dr_no"`
	YourPONo     string           `json:"your_po_no"`
	DispatchDate string           `json:"dispatch_date"`
	ShipTo       string           `json:"ship_to"`
	Reference    string           `json:"reference"`
	Date         string           `json:"date"`
	Items        []SupplierDRItem `json:"items"`
}

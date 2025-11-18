package config

type SupplierData struct {
	SupplierCode string `json:"supplier_code"`
	SupplierName string `json:"supplier_name"`
	TINNumber    string `json:"tin_number"`
	Organization string `json:"organization"`
	Location     string `json:"location"`
}

type EditSupplier struct {
	ID           string `json:"id"`
	SupplierCode string `json:"supplier_code"`
	SupplierName string `json:"supplier_name"`
	TINNumber    string `json:"tin_number"`
	Organization string `json:"organization"`
	Location     string `json:"location"`
}

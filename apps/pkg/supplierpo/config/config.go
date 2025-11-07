package config

type AddSupplierPO struct {
	ProjectID     string             `json:"projectId" binding:"required"`
	SupplierID    string             `json:"supplierId" binding:"required"`
	CustomerPOIDs []string           `json:"customerPoIds,omitempty"` // multiple Customer POs linked
	Items         []SupplierPOItemIn `json:"items" binding:"required"`
}

type UpdateSupplierPO struct {
	SupplierPOID string             `json:"supplierPOId" binding:"required"`
	Items        []SupplierPOItemIn `json:"items" binding:"required"`
}

type ToggleSupplierPOStatus struct {
	SupplierPOID string `json:"supplierPOId" binding:"required"`
	Status       string `json:"status" binding:"required"`
}

type SupplierPOItemIn struct {
	Description string  `json:"description" binding:"required"`
	Quantity    int     `json:"quantity" binding:"required"`
	Rate        float64 `json:"rate" binding:"required"`
}

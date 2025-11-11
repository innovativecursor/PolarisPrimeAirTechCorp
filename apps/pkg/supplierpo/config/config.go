package config

// AddSupplierPO is the request payload for creating a new Supplier Purchase Order
type AddSupplierPO struct {
	ProjectID     string             `json:"projectId" binding:"required"`  // Selected project
	SupplierID    string             `json:"supplierId" binding:"required"` // Selected supplier
	SOID          string             `json:"soId,omitempty"`                // Selected Sales Order
	CustomerPOIDs []string           `json:"customerPoIds,omitempty"`       // Linked Customer POs if any (need to confirm from fe)
	Items         []SupplierPOItemIn `json:"items" binding:"required"`      // Items to purchase
}

type UpdateSupplierPO struct {
	SupplierPOID string             `json:"supplierPOId" binding:"required"`
	Items        []SupplierPOItemIn `json:"items" binding:"required"`
}

// SupplierPOItemIn represents an item being added/updated in a Supplier PO
type SupplierPOItemIn struct {
	Description string  `json:"description" binding:"required"` // Item description
	Quantity    int     `json:"quantity" binding:"required"`    // Quantity
	UOM         string  `json:"uom" binding:"required"`         // Unit of Measurement
	Rate        float64 `json:"rate" binding:"required"`        // Rate per unit
}

// Not in use yet
type ToggleSupplierPOStatus struct {
	SupplierPOID string `json:"supplierPOId" binding:"required"`
	Status       string `json:"status" binding:"required"`
}

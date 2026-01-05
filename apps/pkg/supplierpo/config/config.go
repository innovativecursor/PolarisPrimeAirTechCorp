package config

// AddSupplierPO is the request payload for creating a new Supplier Purchase Order
type AddSupplierPO struct {
	ProjectID  string             `json:"projectId" binding:"required"`  // Selected project
	SupplierID string             `json:"supplierId" binding:"required"` // Selected supplier
	SOID       string             `json:"soId,omitempty"`                // Selected Sales Order
	Items      []SupplierPOItemIn `json:"items" binding:"required"`      // Items to purchase
}

type UpdateSupplierPO struct {
	SupplierPOID string             `json:"supplierPOId" binding:"required"`
	Items        []SupplierPOItemIn `json:"items" binding:"required"`
	Status       string             `json:"status" binding:"required"`
}

// SupplierPOItemIn represents an item being added/updated in a Supplier PO
type SupplierPOItemIn struct {
	Description string `json:"description" binding:"required"` // Item description
	Quantity    int    `json:"quantity" binding:"required"`    // Quantity
	UOM         string `json:"uom" binding:"required"`         // Unit of Measurement
}

package models

import (
	"time"

	"go.mongodb.org/mongo-driver/bson/primitive"
	"go.mongodb.org/mongo-driver/mongo"
)

// Migrator interface for performing database schema migration
type Migrator interface {
	Migrate(db *mongo.Database) error
}

type Role struct {
	ID   primitive.ObjectID `bson:"_id,omitempty" json:"id,omitempty"`
	Name string             `bson:"name" json:"name"`
}

type PendingUser struct {
	ID          primitive.ObjectID `bson:"_id,omitempty" json:"id,omitempty"`
	Email       string             `bson:"email" json:"email"`
	Password    string             `bson:"password" json:"password"` // store hashed password
	RequestedAt time.Time          `bson:"requestedAt" json:"requestedAt"`
	Status      string             `bson:"status" json:"status"` // "pending", "approved", "rejected"
}

type User struct {
	ID           primitive.ObjectID `bson:"_id,omitempty" json:"id,omitempty"`
	Email        string             `bson:"email" json:"email"`
	Password     string             `bson:"password" json:"password"`
	Roles        primitive.ObjectID `bson:"roles,omitempty" json:"roles,omitempty"`
	IsSuperAdmin bool               `bson:"isSuperAdmin,omitempty" json:"isSuperAdmin,omitempty"`
	Status       string             `bson:"status" json:"status"` // e.g. "active", "suspended"
}

type Project struct {
	ID                   primitive.ObjectID   `bson:"_id,omitempty" json:"id"`
	ProjectName          string               `bson:"project_name" json:"project_name"`
	CustomerID           primitive.ObjectID   `bson:"customer_id,omitempty" json:"customer_id"`
	AddressID            primitive.ObjectID   `bson:"address_id,omitempty" json:"address_id"`
	CustomerOrganization string               `bson:"customer_organization,omitempty" json:"customer_organization"` // read-only field
	SalesInvoiceID       primitive.ObjectID   `bson:"sales_invoice_id,omitempty" json:"sales_invoice_id"`
	SupplierPOIDs        []primitive.ObjectID `bson:"supplier_po_ids,omitempty" json:"supplier_po_ids"`
	CustomerPOID         primitive.ObjectID   `bson:"customer_po_id,omitempty" json:"customer_po_id"`
	QuotationID          primitive.ObjectID   `bson:"quotation_id,omitempty" json:"quotation_id"`
	IsQuotationApproved  bool                 `bson:"is_quotation_approved" json:"is_quotation_approved"`
	SupplierIDs          []primitive.ObjectID `bson:"supplier_ids,omitempty" json:"supplier_ids"`
	SkuIDs               []primitive.ObjectID `bson:"sku_ids,omitempty" json:"sku_ids"`
	SupplierReceiptID    primitive.ObjectID   `bson:"supplier_receipt_id,omitempty" json:"supplier_receipt_id"`
	CreatedAt            int64                `bson:"created_at,omitempty" json:"created_at"`
	UpdatedAt            int64                `bson:"updated_at,omitempty" json:"updated_at"`
}

type Customer struct {
	ID           primitive.ObjectID `bson:"_id,omitempty" json:"id,omitempty"`
	CustomerName string             `bson:"customername" json:"customername"`
	Address      string             `bson:"address" json:"address"`
}

type Quotation struct {
	ID          primitive.ObjectID  `bson:"_id,omitempty" json:"id,omitempty"`
	CustomerID  primitive.ObjectID  `bson:"customerId" json:"customerId"`
	Items       []QuotationItem     `bson:"items" json:"items"`
	TotalAmount float64             `bson:"totalAmount" json:"totalAmount"`
	CreatedAt   time.Time           `bson:"createdAt" json:"createdAt"`
	Status      string              `bson:"status" json:"status"` // "pending", "approved", "rejected"
	ApprovedAt  *time.Time          `bson:"approvedAt,omitempty" json:"approvedAt,omitempty"`
	ApprovedBy  *primitive.ObjectID `bson:"approvedBy,omitempty" json:"approvedBy,omitempty"` // user who approved
}

type QuotationItem struct {
	Description string  `bson:"description" json:"description"`
	Quantity    int     `bson:"quantity" json:"quantity"`
	Rate        float64 `bson:"rate" json:"rate"`
	Amount      float64 `bson:"amount" json:"amount"`
}

// SupplierPO represents a Purchase Order sent to a supplier
type SupplierPO struct {
	ID            primitive.ObjectID   `bson:"_id,omitempty" json:"id,omitempty"`
	ProjectID     primitive.ObjectID   `bson:"projectId" json:"projectId"`
	SupplierID    primitive.ObjectID   `bson:"supplierId" json:"supplierId"`
	SOID          *primitive.ObjectID  `bson:"soId,omitempty" json:"soId,omitempty"`                   // Added: for “Select SO” field
	CustomerPOIDs []primitive.ObjectID `bson:"customerPoIds,omitempty" json:"customerPoIds,omitempty"` //need to confirm from fe
	Items         []SupplierPOItem     `bson:"items" json:"items"`
	TotalAmount   float64              `bson:"totalAmount" json:"totalAmount"`
	Status        string               `bson:"status" json:"status"` // draft, approved, sent, closed
	CreatedAt     time.Time            `bson:"createdAt" json:"createdAt"`
	UpdatedAt     *time.Time           `bson:"updatedAt,omitempty" json:"updatedAt,omitempty"`
	ApprovedAt    *time.Time           `bson:"approvedAt,omitempty" json:"approvedAt,omitempty"`
	ApprovedBy    *primitive.ObjectID  `bson:"approvedBy,omitempty" json:"approvedBy,omitempty"`
}

// SupplierPOItem represents a single item in a Supplier PO
type SupplierPOItem struct {
	Description string  `bson:"description" json:"description"`
	Quantity    int     `bson:"quantity" json:"quantity"`
	UOM         string  `bson:"uom" json:"uom"` // Added for “UOM” field
	Rate        float64 `bson:"rate" json:"rate"`
	Amount      float64 `bson:"amount" json:"amount"`
}

// PolarisInventory represents an item in Polaris warehouse inventory.
type PolarisInventory struct {
	ID                primitive.ObjectID `bson:"_id,omitempty" json:"id,omitempty"`
	SKU               string             `bson:"sku" json:"sku"`                             // Unique item SKU
	Barcode           string             `bson:"barcode,omitempty" json:"barcode,omitempty"` // Optional: for scanned code
	AirconModelNumber string             `bson:"aircon_model_number" json:"aircon_model_number"`
	AirconName        string             `bson:"aircon_name" json:"aircon_name"`
	HP                string             `bson:"hp" json:"hp"`
	TypeOfAircon      string             `bson:"type_of_aircon" json:"type_of_aircon"`           // Split, Window, Cassette, etc.
	IndoorOutdoorUnit string             `bson:"indoor_outdoor_unit" json:"indoor_outdoor_unit"` // Indoor or Outdoor
	Quantity          int                `bson:"quantity" json:"quantity"`                       // Optional: for stock tracking
	CreatedBy         primitive.ObjectID `bson:"created_by,omitempty" json:"created_by,omitempty"`
	CreatedAt         time.Time          `bson:"created_at" json:"created_at"`
	UpdatedAt         time.Time          `bson:"updated_at" json:"updated_at"`
}

type Invoice struct {
	ID           primitive.ObjectID `bson:"_id,omitempty" json:"id,omitempty"`
	ProjectID    primitive.ObjectID `bson:"projectId" json:"projectId"`
	CustomerID   primitive.ObjectID `bson:"customerId" json:"customerId"`
	SalesOrderID primitive.ObjectID `bson:"salesOrderId" json:"salesOrderId"`
	Items        []InvoiceItem      `bson:"items" json:"items"`
	CreatedAt    time.Time          `bson:"created_at" json:"created_at"`
	UpdatedAt    time.Time          `bson:"updated_at" json:"updated_at"`
}

type InvoiceItem struct {
	SKUNumber string `bson:"sku_number" json:"sku_number"`
	Qty       int    `bson:"qty" json:"qty"`
	UOM       string `bson:"uom" json:"uom"`
}

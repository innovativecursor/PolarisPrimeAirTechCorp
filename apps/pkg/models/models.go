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

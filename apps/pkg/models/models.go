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
	ProjectID            string               `bson:"project_id,omitempty" json:"project_id"`
	ProjectName          string               `bson:"project_name" json:"project_name"`
	CustomerID           primitive.ObjectID   `bson:"customer_id,omitempty" json:"customer_id"`
	AddressCustomer      string               `bson:"addresscustomer" json:"addresscustomer"`
	CustomerOrganization string               `bson:"customer_organization,omitempty" json:"customer_organization"` // read-only field
	SalesOrderID         primitive.ObjectID   `bson:"sales_order_id,omitempty" json:"sales_order_id"`
	SupplierPOIDs        []primitive.ObjectID `bson:"supplier_po_ids,omitempty" json:"supplier_po_ids"`
	SupplierReceiptID    primitive.ObjectID   `bson:"supplier_receipt_id,omitempty" json:"supplier_receipt_id"`
	SupplierInvoiceID    primitive.ObjectID   `bson:"supplier_invoice_id,omitempty" json:"supplier_invoice_id"`
	SupplierIDs          []primitive.ObjectID `bson:"supplier_ids,omitempty" json:"supplier_ids"`
	SalesInvoiceID       primitive.ObjectID   `bson:"sales_invoice_id,omitempty" json:"sales_invoice_id"`
	SalesDrID            primitive.ObjectID   `bson:"sales_dr_id,omitempty" json:"sales_dr_id"`
	Notes                string               `bson:"notes,omitempty" json:"notes"`
	CreatedAt            int64                `bson:"created_at,omitempty" json:"created_at"`
	UpdatedAt            int64                `bson:"updated_at,omitempty" json:"updated_at"`
}

type Customer struct {
	ID           primitive.ObjectID `bson:"_id,omitempty" json:"id,omitempty"`
	CustomerName string             `bson:"customername" json:"customername"`
	CustomerOrg  string             `bson:"customerorg" json:"customerorg"`
	Address      string             `bson:"address" json:"address"`
	TINNumber    string             `bson:"tinnumber" json:"tinnumber"`
	CreatedAt    time.Time          `bson:"createdat" json:"createdat"`
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
type PolarisReceivingReport struct {
	ID                primitive.ObjectID  `bson:"_id,omitempty" json:"id,omitempty"`
	SKU               string              `bson:"sku" json:"sku"`                             // Unique item SKU
	Barcode           string              `bson:"barcode,omitempty" json:"barcode,omitempty"` // Optional: for scanned code
	AirconModelNumber string              `bson:"aircon_model_number" json:"aircon_model_number"`
	AirconName        string              `bson:"aircon_name" json:"aircon_name"`
	Price             float64             `bson:"price" json:"price"`
	HP                string              `bson:"hp" json:"hp"`
	TypeOfAircon      string              `bson:"type_of_aircon" json:"type_of_aircon"`           // Split, Window, Cassette, etc.
	IndoorOutdoorUnit string              `bson:"indoor_outdoor_unit" json:"indoor_outdoor_unit"` // Indoor or Outdoor
	Quantity          int                 `bson:"quantity" json:"quantity"`                       // Optional: for stock tracking
	SupplierDRID      *primitive.ObjectID `bson:"supplier_dr_id,omitempty" json:"supplier_dr_id,omitempty"`
	SupplierInvoiceID *primitive.ObjectID `bson:"supplier_invoice_id,omitempty" json:"supplier_invoice_id,omitempty"`
	PurchaseOrderID   *primitive.ObjectID `bson:"purchase_order_id,omitempty" json:"purchase_order_id,omitempty"`
	SalesOrderID      *primitive.ObjectID `bson:"sales_order_id,omitempty" json:"sales_order_id,omitempty"`
	CreatedBy         primitive.ObjectID  `bson:"created_by,omitempty" json:"created_by,omitempty"`
	CreatedAt         time.Time           `bson:"created_at" json:"created_at"`
	UpdatedAt         time.Time           `bson:"updated_at" json:"updated_at"`
}

type PolarisInventory struct {
	ID                primitive.ObjectID `bson:"_id,omitempty" json:"id"`
	SKU               string             `bson:"sku" json:"sku"`
	Barcode           string             `bson:"barcode,omitempty" json:"barcode,omitempty"`
	AirconModelNumber string             `bson:"aircon_model_number" json:"aircon_model_number"`
	AirconName        string             `bson:"aircon_name" json:"aircon_name"`
	HP                string             `bson:"hp" json:"hp"`
	TypeOfAircon      string             `bson:"type_of_aircon" json:"type_of_aircon"`
	IndoorOutdoorUnit string             `bson:"indoor_outdoor_unit" json:"indoor_outdoor_unit"`
	Quantity          int                `bson:"quantity" json:"quantity"`
	Price             float64            `bson:"price" json:"price"`
	CreatedBy         primitive.ObjectID `bson:"created_by" json:"created_by"`
	CreatedAt         time.Time          `bson:"created_at" json:"created_at"`
	UpdatedAt         time.Time          `bson:"updated_at" json:"updated_at"`
}

type SalesOrder struct {
	ID           primitive.ObjectID `bson:"_id,omitempty" json:"id,omitempty"`
	SalesOrderID string             `bson:"salesOrderId" json:"salesOrderId"`
	ProjectID    primitive.ObjectID `bson:"projectId,omitempty" json:"projectId,omitempty"`
	CustomerID   primitive.ObjectID `bson:"customerId,omitempty" json:"customerId,omitempty"`
	Items        []SalesOrderItem   `bson:"items" json:"items"`
	TotalAmount  float64            `bson:"totalAmount" json:"totalAmount"`
	CreatedBy    primitive.ObjectID `bson:"createdBy,omitempty" json:"createdBy,omitempty"`
	CreatedAt    time.Time          `bson:"createdAt" json:"createdAt"`
	UpdatedAt    time.Time          `bson:"updatedAt" json:"updatedAt"`
	Status       string             `bson:"status" json:"status"`
}

type SalesOrderItem struct {
	AirconID primitive.ObjectID `bson:"airconId,omitempty" json:"airconId,omitempty"`
	Qty      int                `bson:"qty" json:"qty"`
	UOM      string             `bson:"uom" json:"uom"`
	Price    float64            `bson:"price" json:"price"`
	Subtotal float64            `bson:"subtotal" json:"subtotal"`
}

type Aircon struct {
	ID       primitive.ObjectID `bson:"_id,omitempty" json:"id,omitempty"`
	Name     string             `bson:"name" json:"name"`
	Model    string             `bson:"model" json:"model"`
	Brand    string             `bson:"brand" json:"brand"`
	Capacity string             `bson:"capacity" json:"capacity"`
	Price    float64            `bson:"price" json:"price"`
}

type SupplierDeliveryReceiptItem struct {
	LineNo      int      `bson:"line_no" json:"line_no"`
	Model       string   `bson:"model" json:"model"`
	Description string   `bson:"description" json:"description"`
	Plant       string   `bson:"plant" json:"plant"`
	StorLoc     string   `bson:"stor_loc" json:"stor_loc"`
	Unit        string   `bson:"unit" json:"unit"`
	ShipQty     int      `bson:"ship_qty" json:"ship_qty"`
	TotalCBM    float64  `bson:"total_cbm" json:"total_cbm"`
	TotalKGS    float64  `bson:"total_kgs" json:"total_kgs"`
	SerialNos   []string `bson:"serial_nos" json:"serial_nos"`
}

type SupplierDeliveryReceipt struct {
	ID           primitive.ObjectID            `bson:"_id,omitempty" json:"id"`
	SupplierID   primitive.ObjectID            `bson:"supplier_id" json:"supplier_id"`
	ProjectID    primitive.ObjectID            `bson:"project_id" json:"project_id"`
	SupplierDRNo string                        `bson:"supplier_dr_no" json:"supplier_dr_no"`
	YourPONo     string                        `bson:"your_po_no" json:"your_po_no"`
	DispatchDate time.Time                     `bson:"dispatch_date" json:"dispatch_date"`
	ShipTo       string                        `bson:"ship_to" json:"ship_to"`
	Reference    string                        `bson:"reference" json:"reference"`
	Date         time.Time                     `bson:"date" json:"date"`
	Items        []SupplierDeliveryReceiptItem `bson:"items" json:"items"`

	ReceivedBy primitive.ObjectID `bson:"received_by" json:"received_by"`
	CreatedAt  time.Time          `bson:"created_at" json:"created_at"`
}

type SupplierInvoice struct {
	ID              primitive.ObjectID    `bson:"_id,omitempty" json:"id,omitempty"`
	SupplierID      primitive.ObjectID    `bson:"supplier_id" json:"supplier_id"`
	ProjectID       primitive.ObjectID    `bson:"project_id" json:"project_id"`
	InvoiceNo       string                `bson:"invoice_no" json:"invoice_no"`
	InvoiceDate     time.Time             `bson:"invoice_date" json:"invoice_date"`
	DeliveryNo      string                `bson:"delivery_no" json:"delivery_no"`
	PurchaseOrderNo string                `bson:"purchase_order_no" json:"purchase_order_no"`
	DueDate         time.Time             `bson:"due_date" json:"due_date"`
	DeliveryAddress string                `bson:"delivery_address" json:"delivery_address"`
	Items           []SupplierInvoiceItem `bson:"items" json:"items"`
	TotalSales      float64               `bson:"total_sales" json:"total_sales"`
	VAT             float64               `bson:"vat" json:"vat"`
	GrandTotal      float64               `bson:"grand_total" json:"grand_total"`
	CreatedAt       time.Time             `bson:"created_at" json:"created_at"`
	CreatedBy       primitive.ObjectID    `bson:"created_by" json:"created_by"`
}

type SupplierInvoiceItem struct {
	Description string  `bson:"description" json:"description"`
	Qty         int     `bson:"qty" json:"qty"`
	Unit        string  `bson:"unit" json:"unit"`
	UnitPrice   float64 `bson:"unit_price" json:"unit_price"`
	Amount      float64 `bson:"amount" json:"amount"`
}

type Supplier struct {
	ID           primitive.ObjectID `bson:"_id,omitempty" json:"id,omitempty"`
	SupplierCode string             `bson:"supplier_code" json:"supplier_code"`
	SupplierName string             `bson:"supplier_name" json:"supplier_name"`
	TINNumber    string             `bson:"tin_number" json:"tin_number"`
	Organization string             `bson:"organization" json:"organization"`
	Location     string             `bson:"location" json:"location"`
	CreatedAt    time.Time          `bson:"created_at" json:"created_at"`
	CreatedBy    primitive.ObjectID `bson:"created_by" json:"created_by"`
}
type SalesInvoice struct {
	ID           primitive.ObjectID `bson:"_id" json:"id"`
	InvoiceID    string             `bson:"invoice_id" json:"invoice_id"`
	ProjectID    primitive.ObjectID `bson:"project_id" json:"project_id"`
	CustomerID   primitive.ObjectID `bson:"customer_id" json:"customer_id"`
	SalesOrderID primitive.ObjectID `bson:"sales_order_id" json:"sales_order_id"`

	Items []InvoiceItemSales `bson:"items" json:"items"`

	TotalAmount float64   `bson:"total_amount" json:"total_amount"`
	CreatedAt   time.Time `bson:"created_at" json:"created_at"`
	UpdatedAt   time.Time `bson:"updated_at" json:"updated_at"`
}

type InvoiceItemSales struct {
	SKU       string  `bson:"sku" json:"sku"`
	Quantity  int     `bson:"quantity" json:"quantity"`
	UnitPrice float64 `bson:"unit_price" json:"unit_price"`
	Amount    float64 `bson:"amount" json:"amount"`
}

type DeliveryReceipt struct {
	ID       primitive.ObjectID `bson:"_id" json:"id"`
	DRNumber string             `bson:"dr_number" json:"dr_number"`

	ProjectID      primitive.ObjectID `bson:"project_id" json:"project_id"`
	CustomerID     primitive.ObjectID `bson:"customer_id" json:"customer_id"`
	SalesOrderID   primitive.ObjectID `bson:"sales_order_id" json:"sales_order_id"`
	SalesInvoiceID primitive.ObjectID `bson:"sales_invoice_id" json:"sales_invoice_id"`

	CustomerName     string `bson:"customer_name" json:"customer_name"`
	CustomerOrg      string `bson:"customer_org" json:"customer_org"`
	CustomerTIN      string `bson:"customer_tin" json:"customer_tin"`
	CustomerLocation string `bson:"customer_location" json:"customer_location"`

	Items []DeliveryItem `bson:"items" json:"items"`

	Status    string    `bson:"status" json:"status"` // Ready | Issued
	CreatedAt time.Time `bson:"created_at" json:"created_at"`
	UpdatedAt time.Time `bson:"updated_at" json:"updated_at"`
}

type DeliveryItem struct {
	SKU      string `bson:"sku" json:"sku"`
	Quantity int    `bson:"quantity" json:"quantity"`
}

//done

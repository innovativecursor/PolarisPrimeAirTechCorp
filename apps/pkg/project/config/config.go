package config

import "go.mongodb.org/mongo-driver/bson/primitive"

type ProjectRequest struct {
	ProjectName          string             `json:"project_name" binding:"required"`
	CustomerID           primitive.ObjectID `json:"customer_id" binding:"required"`
	AddressID            primitive.ObjectID `json:"address_id" binding:"required"`
	CustomerOrganization string             `json:"customer_organization,omitempty"`
	//QuotationID          primitive.ObjectID `json:"quotation_id,omitempty"`
	//IsQuotationApproved  bool               `json:"is_quotation_approved"`
}

// // UpdateProjectRequest defines the structure expected when updating an existing project.
// type UpdateProjectRequest struct {
// 	ProjectName          string               `json:"project_name,omitempty"`
// 	CustomerID           primitive.ObjectID   `json:"customer_id,omitempty"`
// 	AddressID            primitive.ObjectID   `json:"address_id,omitempty"`
// 	CustomerOrganization string               `json:"customer_organization,omitempty"`
// 	QuotationID          primitive.ObjectID   `json:"quotation_id,omitempty"`
// 	IsQuotationApproved  bool                 `json:"is_quotation_approved,omitempty"` //pending,approved,rejected
// 	SupplierIDs          []primitive.ObjectID `json:"supplier_ids,omitempty"`
// 	SkuIDs               []primitive.ObjectID `json:"sku_ids,omitempty"`
// 	SupplierPOIDs        []primitive.ObjectID `json:"supplier_po_ids,omitempty"`
// 	CustomerPOID         primitive.ObjectID   `json:"customer_po_id,omitempty"`
// 	SupplierReceiptID    primitive.ObjectID   `json:"supplier_receipt_id,omitempty"`
// 	SalesInvoiceID       primitive.ObjectID   `json:"sales_invoice_id,omitempty"`
// }

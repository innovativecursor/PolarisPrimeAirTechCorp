package invoices

import (
	"context"
	"net/http"
	"time"

	"github.com/gin-gonic/gin"
	"github.com/innovativecursor/PolarisPrimeAirTechCorp/apps/pkg/invoices/config"
	"github.com/innovativecursor/PolarisPrimeAirTechCorp/apps/pkg/models"
	"go.mongodb.org/mongo-driver/bson"
	"go.mongodb.org/mongo-driver/bson/primitive"
	"go.mongodb.org/mongo-driver/mongo"
)

// CreateInvoice handles creating a new invoice in the database.
func CreateInvoice(c *gin.Context, db *mongo.Database) {
	user, exists := c.Get("user")
	if !exists {
		c.JSON(http.StatusUnauthorized, gin.H{"error": "User not found"})
		return
	}
	_, ok := user.(*models.User)
	if !ok {
		c.JSON(http.StatusUnauthorized, gin.H{"error": "Invalid user object"})
		return
	}

	var payload config.InvoicePayload
	if err := c.ShouldBindJSON(&payload); err != nil {
		c.JSON(http.StatusBadRequest, gin.H{"error": err.Error()})
		return
	}

	// convert string ids
	projectObjID, err := primitive.ObjectIDFromHex(payload.ProjectID)
	customerObjID, err2 := primitive.ObjectIDFromHex(payload.CustomerID)
	soObjID, err3 := primitive.ObjectIDFromHex(payload.SalesOrderID)
	if err != nil || err2 != nil || err3 != nil {
		c.JSON(http.StatusBadRequest, gin.H{"error": "Invalid ObjectID format"})
		return
	}

	// map items payload
	var items []models.InvoiceItem
	for _, it := range payload.Items {
		items = append(items, models.InvoiceItem{
			SKUNumber: it.SKUNumber,
			Qty:       it.Qty,
			UOM:       it.UOM,
		})
	}
	// Build invoice object to insert
	invoice := models.Invoice{
		ID:           primitive.NewObjectID(),
		ProjectID:    projectObjID,
		CustomerID:   customerObjID,
		SalesOrderID: soObjID,
		Items:        items,
		CreatedAt:    time.Now(),
		UpdatedAt:    time.Now(),
	}

	_, err = db.Collection("invoices").InsertOne(context.Background(), invoice)
	if err != nil {
		c.JSON(http.StatusInternalServerError, gin.H{"error": "Failed to create invoice"})
		return
	}

	c.JSON(http.StatusCreated, gin.H{
		"message": "Invoice created successfully",
		"invoice": invoice,
	})
}

// UpdateInvoice updates an existing invoice by its ID.
func UpdateInvoice(c *gin.Context, db *mongo.Database) {
	invoiceID := c.Param("id")
	objID, err := primitive.ObjectIDFromHex(invoiceID)
	if err != nil {
		c.JSON(http.StatusBadRequest, gin.H{"error": "Invalid invoice ID"})
		return
	}

	var payload config.InvoicePayload
	if err := c.ShouldBindJSON(&payload); err != nil {
		c.JSON(http.StatusBadRequest, gin.H{"error": err.Error()})
		return
	}

	// update fields value
	update := bson.M{
		"$set": bson.M{
			"projectId":    payload.ProjectID,
			"customerId":   payload.CustomerID,
			"salesOrderId": payload.SalesOrderID,
			"items":        payload.Items,
			"updated_at":   time.Now(),
		},
	}
	_, err = db.Collection("invoices").UpdateByID(context.TODO(), objID, update)
	if err != nil {
		c.JSON(http.StatusInternalServerError, gin.H{"error": err.Error()})
		return
	}

	c.JSON(http.StatusOK, gin.H{"message": "Invoice updated successfully"})
}

// GetAllInvoices fetches all invoices from the database.
func GetAllInvoices(c *gin.Context, db *mongo.Database) {
	user, exists := c.Get("user")
	if !exists {
		c.JSON(http.StatusUnauthorized, gin.H{"error": "User not found"})
		return
	}
	_, ok := user.(*models.User)
	if !ok {
		c.JSON(http.StatusUnauthorized, gin.H{"error": "Invalid user object"})
		return
	}

	// Fetch all invoice records
	cursor, err := db.Collection("invoices").Find(context.Background(), bson.M{})
	if err != nil {
		c.JSON(http.StatusInternalServerError, gin.H{"error": "Failed to fetch invoices"})
		return
	}
	defer cursor.Close(context.Background())

	// Decode documents into list
	var invoices []models.Invoice
	if err := cursor.All(context.Background(), &invoices); err != nil {
		c.JSON(http.StatusInternalServerError, gin.H{"error": err.Error()})
		return
	}

	c.JSON(http.StatusOK, gin.H{"invoices": invoices})
}

// GetInvoiceByID returns a single invoice with project, customer, and sales order populated.
func GetInvoiceByID(c *gin.Context, db *mongo.Database) {
	user, exists := c.Get("user")
	if !exists {
		c.JSON(http.StatusUnauthorized, gin.H{"error": "User not found"})
		return
	}
	_, ok := user.(*models.User)
	if !ok {
		c.JSON(http.StatusUnauthorized, gin.H{"error": "Invalid user object"})
		return
	}

	// Convert path parameter to ObjectID
	id := c.Param("id")
	objID, err := primitive.ObjectIDFromHex(id)
	if err != nil {
		c.JSON(http.StatusBadRequest, gin.H{"error": "Invalid invoice ID"})
		return
	}

	// MongoDB aggregation pipeline to join related collections
	pipeline := mongo.Pipeline{
		{{Key: "$match", Value: bson.M{"_id": objID}}},

		{
			{Key: "$lookup", Value: bson.M{
				"from":         "project", // ✅ correct collection name
				"localField":   "projectId",
				"foreignField": "_id",
				"as":           "project",
			}},
		},
		{
			{Key: "$lookup", Value: bson.M{
				"from":         "customer", // ✅ correct collection name
				"localField":   "customerId",
				"foreignField": "_id",
				"as":           "customer",
			}},
		},
		{
			{Key: "$lookup", Value: bson.M{
				"from":         "salesorder", // ✅ correct collection name
				"localField":   "salesOrderId",
				"foreignField": "_id",
				"as":           "sales_order",
			}},
		},

		{
			{Key: "$addFields", Value: bson.M{
				"project":     bson.M{"$arrayElemAt": bson.A{"$project", 0}},
				"customer":    bson.M{"$arrayElemAt": bson.A{"$customer", 0}},
				"sales_order": bson.M{"$arrayElemAt": bson.A{"$sales_order", 0}},
			}},
		},
	}

	// Run pipeline
	cursor, err := db.Collection("invoices").Aggregate(context.Background(), pipeline)
	if err != nil {
		c.JSON(http.StatusInternalServerError, gin.H{"error": "Failed to fetch invoice"})
		return
	}
	defer cursor.Close(context.Background())

	// Decode result
	var results []bson.M
	if err := cursor.All(context.Background(), &results); err != nil {
		c.JSON(http.StatusInternalServerError, gin.H{"error": "Error parsing results"})
		return
	}

	// If no result found
	if len(results) == 0 {
		c.JSON(http.StatusNotFound, gin.H{"error": "Invoice not found"})
		return
	}

	c.JSON(http.StatusOK, results[0])
}

// DeleteInvoice removes an invoice by its ID.
func DeleteInvoice(c *gin.Context, db *mongo.Database) {
	user, exists := c.Get("user")
	if !exists {
		c.JSON(http.StatusUnauthorized, gin.H{"error": "User not found"})
		return
	}
	_, ok := user.(*models.User)
	if !ok {
		c.JSON(http.StatusUnauthorized, gin.H{"error": "Invalid user object"})
		return
	}

	// Convert ID parameter to ObjectID
	id := c.Param("id")
	objID, err := primitive.ObjectIDFromHex(id)
	if err != nil {
		c.JSON(http.StatusBadRequest, gin.H{"error": "Invalid invoice ID"})
		return
	}

	// Delete invoice from database
	result, err := db.Collection("invoices").DeleteOne(context.Background(), bson.M{"_id": objID})
	if err != nil {
		c.JSON(http.StatusInternalServerError, gin.H{"error": "Failed to delete invoice"})
		return
	}

	// If nothing was deleted
	if result.DeletedCount == 0 {
		c.JSON(http.StatusNotFound, gin.H{"error": "Invoice not found"})
		return
	}

	c.JSON(http.StatusOK, gin.H{"message": "Invoice deleted successfully"})
}

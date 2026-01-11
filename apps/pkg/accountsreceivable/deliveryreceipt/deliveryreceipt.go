package deliveryreceipt

import (
	"context"
	"net/http"
	"strconv"
	"time"

	"github.com/gin-gonic/gin"
	"github.com/innovativecursor/PolarisPrimeAirTechCorp/apps/pkg/accountsreceivable/config"
	"github.com/innovativecursor/PolarisPrimeAirTechCorp/apps/pkg/models"
	"go.mongodb.org/mongo-driver/bson"
	"go.mongodb.org/mongo-driver/bson/primitive"
	"go.mongodb.org/mongo-driver/mongo"
)

func CreateDeliveryReceipt(c *gin.Context, db *mongo.Database) {
	// Authenticate user
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

	var payload config.CreateDeliveryReceiptPayload
	if err := c.ShouldBindJSON(&payload); err != nil {
		c.JSON(http.StatusBadRequest, gin.H{"error": err.Error()})
		return
	}

	projectID, _ := primitive.ObjectIDFromHex(payload.ProjectID)
	customerID, _ := primitive.ObjectIDFromHex(payload.CustomerID)
	salesOrderID, _ := primitive.ObjectIDFromHex(payload.SalesOrderID)
	invoiceID, _ := primitive.ObjectIDFromHex(payload.SalesInvoiceID)

	// Fetch invoice
	var invoice models.SalesInvoice
	err := db.Collection("sales_invoices").
		FindOne(context.Background(), bson.M{"_id": invoiceID}).
		Decode(&invoice)

	if err != nil {
		c.JSON(http.StatusNotFound, gin.H{"error": "Sales invoice not found"})
		return
	}

	// Fetch customer
	var customer models.Customer
	err = db.Collection("customer").
		FindOne(context.Background(), bson.M{"_id": customerID}).
		Decode(&customer)

	if err != nil {
		c.JSON(http.StatusNotFound, gin.H{"error": "Customer not found"})
		return
	}

	// Convert items for DR
	items := []models.DeliveryItem{}
	for _, item := range invoice.Items {
		items = append(items, models.DeliveryItem{
			SKU:      item.SKU,
			Quantity: item.Quantity,
		})
	}

	// Build DR object
	dr := models.DeliveryReceipt{
		DRNumber:         "DR-" + time.Now().Format("20060102150405"),
		ProjectID:        projectID,
		CustomerID:       customerID,
		SalesOrderID:     salesOrderID,
		SalesInvoiceID:   invoiceID,
		CustomerName:     customer.CustomerName,
		CustomerOrg:      customer.CustomerOrg,
		CustomerTIN:      customer.TINNumber,
		CustomerLocation: customer.Address,
		Items:            items,
		Status:           "Ready",
		CreatedAt:        time.Now(),
		UpdatedAt:        time.Now(),
	}

	_, err = db.Collection("delivery_receipts").
		InsertOne(context.Background(), dr)

	if err != nil {
		c.JSON(http.StatusInternalServerError, gin.H{"error": "Failed to create DR"})
		return
	}

	c.JSON(http.StatusCreated, gin.H{
		"message": "Delivery receipt created successfully",
		"data":    dr,
	})
}

type DeliveryReceiptListResponse struct {
	ID        primitive.ObjectID `bson:"_id" json:"id"`
	DRNumber  string             `bson:"dr_number" json:"dr_number"`
	Status    string             `bson:"status" json:"status"`
	CreatedAt time.Time          `bson:"created_at" json:"created_at"`
	UpdatedAt time.Time          `bson:"updated_at" json:"updated_at"`
	Project   struct {
		ID   primitive.ObjectID `bson:"id" json:"id"`
		Name string             `bson:"name" json:"name"`
	} `bson:"project" json:"project"`
	SalesOrder struct {
		ID   primitive.ObjectID `bson:"id" json:"id"`
		Name string             `bson:"name" json:"name"`
	} `bson:"sales_order" json:"sales_order"`
	SalesInvoice struct {
		ID   primitive.ObjectID `bson:"id" json:"id"`
		Name string             `bson:"name" json:"name"` // InvoiceID
	} `bson:"sales_invoice" json:"sales_invoice"`
	Customer struct {
		ID       primitive.ObjectID `bson:"id" json:"id"`
		Name     string             `bson:"name" json:"name"`
		Org      string             `bson:"org" json:"org"`
		TIN      string             `bson:"tin" json:"tin"`
		Location string             `bson:"location" json:"location"`
	} `bson:"customer" json:"customer"`
}

func GetAllDeliveryReceipts(c *gin.Context, db *mongo.Database) {
	// Auth
	user, exists := c.Get("user")
	if !exists {
		c.JSON(http.StatusUnauthorized, gin.H{"error": "User not found"})
		return
	}
	if _, ok := user.(*models.User); !ok {
		c.JSON(http.StatusUnauthorized, gin.H{"error": "Invalid user"})
		return
	}

	// Pagination
	page := int64(1)
	limit := int64(10)
	if p := c.Query("page"); p != "" {
		if v, err := strconv.ParseInt(p, 10, 64); err == nil && v > 0 {
			page = v
		}
	}
	if l := c.Query("limit"); l != "" {
		if v, err := strconv.ParseInt(l, 10, 64); err == nil && v > 0 {
			limit = v
		}
	}
	skip := (page - 1) * limit

	collection := db.Collection("delivery_receipts")

	pipeline := mongo.Pipeline{
		// Sort by latest
		{{Key: "$sort", Value: bson.M{"created_at": -1}}},

		// Pagination
		{{Key: "$skip", Value: skip}},
		{{Key: "$limit", Value: limit}},

		// Lookup Project
		{{
			Key: "$lookup",
			Value: bson.M{
				"from":         "project",
				"localField":   "project_id",
				"foreignField": "_id",
				"as":           "project",
			},
		}},
		{{Key: "$unwind", Value: bson.M{"path": "$project", "preserveNullAndEmptyArrays": true}}},

		// Lookup Sales Order
		{{
			Key: "$lookup",
			Value: bson.M{
				"from":         "salesorder",
				"localField":   "sales_order_id",
				"foreignField": "_id",
				"as":           "sales_order",
			},
		}},
		{{Key: "$unwind", Value: bson.M{"path": "$sales_order", "preserveNullAndEmptyArrays": true}}},

		// Lookup Sales Invoice
		{{
			Key: "$lookup",
			Value: bson.M{
				"from":         "sales_invoices",
				"localField":   "sales_invoice_id",
				"foreignField": "_id",
				"as":           "sales_invoice",
			},
		}},
		{{Key: "$unwind", Value: bson.M{"path": "$sales_invoice", "preserveNullAndEmptyArrays": true}}},

		// Shape final response
		{{
			Key: "$project",
			Value: bson.M{
				"_id":        1,
				"dr_number":  1,
				"status":     1,
				"created_at": 1,
				"updated_at": 1,

				"project": bson.M{
					"id":   "$project._id",
					"name": "$project.project_name",
				},
				"sales_order": bson.M{
					"id":   "$sales_order._id",
					"name": "$sales_order.salesOrderId",
				},
				"sales_invoice": bson.M{
					"id":   "$sales_invoice._id",
					"name": "$sales_invoice.invoice_id",
				},
				"customer": bson.M{
					"id":       "$customer_id",
					"name":     "$customer_name",
					"org":      "$customer_org",
					"tin":      "$customer_tin",
					"location": "$customer_location",
				},
			},
		}},
	}

	cursor, err := collection.Aggregate(c, pipeline)
	if err != nil {
		c.JSON(http.StatusInternalServerError, gin.H{"error": "Failed to fetch delivery receipts"})
		return
	}
	defer cursor.Close(c)

	var receipts []DeliveryReceiptListResponse
	if err := cursor.All(c, &receipts); err != nil {
		c.JSON(http.StatusInternalServerError, gin.H{"error": "Failed to decode delivery receipts"})
		return
	}

	total, _ := collection.CountDocuments(c, bson.M{})

	c.JSON(http.StatusOK, gin.H{
		"data":  receipts,
		"page":  page,
		"limit": limit,
		"total": total,
	})
}

func GetDeliveryReceiptByID(c *gin.Context, db *mongo.Database) {
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
	id := c.Param("id")
	oid, err := primitive.ObjectIDFromHex(id)

	if err != nil {
		c.JSON(http.StatusBadRequest, gin.H{"error": "Invalid DR ID"})
		return
	}

	var dr models.DeliveryReceipt
	err = db.Collection("delivery_receipts").
		FindOne(context.Background(), bson.M{"_id": oid}).
		Decode(&dr)

	if err != nil {
		c.JSON(http.StatusNotFound, gin.H{"error": "Delivery receipt not found"})
		return
	}

	c.JSON(http.StatusOK, gin.H{"data": dr})
}

func UpdateDeliveryReceipt(c *gin.Context, db *mongo.Database) {
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
	// Parse ID from URL
	id := c.Param("id")
	drID, err := primitive.ObjectIDFromHex(id)
	if err != nil {
		c.JSON(http.StatusBadRequest, gin.H{"error": "Invalid delivery receipt ID"})
		return
	}

	// Parse request body
	var payload config.UpdateDeliveryReceiptPayload
	if err := c.ShouldBindJSON(&payload); err != nil {
		c.JSON(http.StatusBadRequest, gin.H{"error": err.Error()})
		return
	}

	// Update in DB
	update := bson.M{
		"status":     payload.Status,
		"updated_at": time.Now(),
	}

	_, err = db.Collection("delivery_receipts").UpdateOne(
		context.Background(),
		bson.M{"_id": drID},
		bson.M{"$set": update},
	)

	if err != nil {
		c.JSON(http.StatusInternalServerError, gin.H{"error": "Failed to update delivery receipt"})
		return
	}

	c.JSON(http.StatusOK, gin.H{"message": "Delivery receipt updated successfully"})
}

func DeleteDeliveryReceipt(c *gin.Context, db *mongo.Database) {
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
	// Parse ID from URL
	id := c.Param("id")
	drID, err := primitive.ObjectIDFromHex(id)
	if err != nil {
		c.JSON(http.StatusBadRequest, gin.H{"error": "Invalid delivery receipt ID"})
		return
	}

	// Perform delete
	result, err := db.Collection("delivery_receipts").DeleteOne(
		context.Background(),
		bson.M{"_id": drID},
	)

	if err != nil {
		c.JSON(http.StatusInternalServerError, gin.H{"error": "Failed to delete delivery receipt"})
		return
	}

	if result.DeletedCount == 0 {
		c.JSON(http.StatusNotFound, gin.H{"error": "Delivery receipt not found"})
		return
	}

	c.JSON(http.StatusOK, gin.H{
		"message": "Delivery receipt deleted successfully",
	})
}

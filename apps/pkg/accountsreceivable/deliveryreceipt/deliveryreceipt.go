package deliveryreceipt

import (
	"context"
	"net/http"
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
		ID:               primitive.NewObjectID(),
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

func GetAllDeliveryReceipts(c *gin.Context, db *mongo.Database) {
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

	cursor, err := db.Collection("delivery_receipts").Find(context.Background(), bson.M{})
	if err != nil {
		c.JSON(http.StatusInternalServerError, gin.H{"error": "Failed to fetch DRs"})
		return
	}
	defer cursor.Close(context.Background())

	var receipts []models.DeliveryReceipt
	if err := cursor.All(context.Background(), &receipts); err != nil {
		c.JSON(http.StatusInternalServerError, gin.H{"error": "Failed to decode DRs"})
		return
	}

	c.JSON(http.StatusOK, gin.H{"data": receipts})
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

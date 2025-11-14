package supplierdr

import (
	"net/http"
	"time"

	"github.com/gin-gonic/gin"
	"github.com/innovativecursor/PolarisPrimeAirTechCorp/apps/pkg/models"
	"github.com/innovativecursor/PolarisPrimeAirTechCorp/apps/pkg/supplierdr/config"
	"go.mongodb.org/mongo-driver/bson"
	"go.mongodb.org/mongo-driver/bson/primitive"
	"go.mongodb.org/mongo-driver/mongo"
)

func CreateSupplierDR(c *gin.Context, db *mongo.Database) {
	user, exists := c.Get("user")
	if !exists {
		c.JSON(http.StatusUnauthorized, gin.H{"error": "User not found"})
		return
	}
	authUser, ok := user.(*models.User)
	if !ok {
		c.JSON(http.StatusUnauthorized, gin.H{"error": "Invalid user object"})
		return
	}

	var payload config.SupplierDRData
	if err := c.ShouldBindJSON(&payload); err != nil {
		c.JSON(http.StatusBadRequest, gin.H{"error": "Invalid payload"})
		return
	}

	supplierID, err := primitive.ObjectIDFromHex(payload.SupplierID)
	if err != nil {
		c.JSON(http.StatusBadRequest, gin.H{"error": "Invalid supplier ID"})
		return
	}

	dateParsed, _ := time.Parse("2006-01-02", payload.Date)

	var items []models.SupplierDeliveryReceiptItem
	for _, it := range payload.Items {
		items = append(items, models.SupplierDeliveryReceiptItem{
			Description: it.Description,
			Qty:         it.Qty,
			Unit:        it.Unit,
		})
	}

	dr := models.SupplierDeliveryReceipt{
		SupplierID:      supplierID,
		SupplierDRNo:    payload.SupplierDRNo,
		SupplierInvoice: payload.SupplierInvoice,
		YourPONo:        payload.YourPONo,
		Items:           items,
		Date:            dateParsed,
		ReceivedBy:      authUser.ID,
		CreatedAt:       time.Now(),
	}

	_, err = db.Collection("supplierdeliveryreceipt").InsertOne(c, dr)
	if err != nil {
		c.JSON(http.StatusInternalServerError, gin.H{"error": "Failed to create supplier DR"})
		return
	}

	c.JSON(http.StatusOK, gin.H{"message": "Supplier Delivery Receipt created"})
}

func GetAllSupplierDR(c *gin.Context, db *mongo.Database) {
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
	cursor, err := db.Collection("supplierdeliveryreceipt").Find(c, bson.M{})
	if err != nil {
		c.JSON(http.StatusInternalServerError, gin.H{"error": "Failed to fetch DR"})
		return
	}
	defer cursor.Close(c)

	var list []models.SupplierDeliveryReceipt
	cursor.All(c, &list)

	c.JSON(http.StatusOK, gin.H{"supplierDR": list})
}

func GetSupplierDRByID(c *gin.Context, db *mongo.Database) {
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

	objID, err := primitive.ObjectIDFromHex(id)
	if err != nil {
		c.JSON(http.StatusBadRequest, gin.H{"error": "Invalid ID format"})
		return
	}

	var dr models.SupplierDeliveryReceipt
	err = db.Collection("supplierdeliveryreceipt").FindOne(c, bson.M{"_id": objID}).Decode(&dr)
	if err != nil {
		c.JSON(http.StatusNotFound, gin.H{"error": "DR not found"})
		return
	}

	c.JSON(http.StatusOK, gin.H{"supplierDR": dr})
}

func EditSupplierDR(c *gin.Context, db *mongo.Database) {
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
	var payload config.EditSupplierDR
	if err := c.ShouldBindJSON(&payload); err != nil {
		c.JSON(http.StatusBadRequest, gin.H{"error": "Invalid payload"})
		return
	}

	objID, _ := primitive.ObjectIDFromHex(payload.ID)
	supplierID, _ := primitive.ObjectIDFromHex(payload.SupplierID)
	dateParsed, _ := time.Parse("2006-01-02", payload.Date)

	var items []models.SupplierDeliveryReceiptItem
	for _, it := range payload.Items {
		items = append(items, models.SupplierDeliveryReceiptItem{
			Description: it.Description,
			Qty:         it.Qty,
			Unit:        it.Unit,
		})
	}

	update := bson.M{
		"$set": bson.M{
			"supplier_id":      supplierID,
			"supplier_dr_no":   payload.SupplierDRNo,
			"supplier_invoice": payload.SupplierInvoice,
			"your_po_no":       payload.YourPONo,
			"items":            items,
			"date":             dateParsed,
		},
	}

	_, err := db.Collection("supplierdeliveryreceipt").
		UpdateOne(c, bson.M{"_id": objID}, update)

	if err != nil {
		c.JSON(http.StatusInternalServerError, gin.H{"error": "Failed to update DR"})
		return
	}

	c.JSON(http.StatusOK, gin.H{"message": "Supplier DR updated"})
}

func DeleteSupplierDR(c *gin.Context, db *mongo.Database) {
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
	var payload struct {
		ID string `json:"id"`
	}
	c.ShouldBindJSON(&payload)

	objID, _ := primitive.ObjectIDFromHex(payload.ID)

	_, err := db.Collection("supplierdeliveryreceipt").
		DeleteOne(c, bson.M{"_id": objID})

	if err != nil {
		c.JSON(http.StatusInternalServerError, gin.H{"error": "Failed to delete DR"})
		return
	}

	c.JSON(http.StatusOK, gin.H{"message": "Supplier DR deleted"})
}

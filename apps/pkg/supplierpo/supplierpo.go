package supplierpo

import (
	"net/http"
	"strconv"
	"time"

	"github.com/gin-gonic/gin"
	"github.com/innovativecursor/PolarisPrimeAirTechCorp/apps/pkg/models"
	"github.com/innovativecursor/PolarisPrimeAirTechCorp/apps/pkg/supplierpo/config"
	"go.mongodb.org/mongo-driver/bson"
	"go.mongodb.org/mongo-driver/bson/primitive"
	"go.mongodb.org/mongo-driver/mongo"
	"go.mongodb.org/mongo-driver/mongo/options"
)

// Add Supplier Purchase Order
func AddSupplierPO(c *gin.Context, db *mongo.Database) {
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

	var payload config.AddSupplierPO
	if err := c.ShouldBindJSON(&payload); err != nil {
		c.JSON(http.StatusBadRequest, gin.H{"error": "Invalid request payload", "details": err.Error()})
		return
	}

	projectID, err := primitive.ObjectIDFromHex(payload.ProjectID)
	if err != nil {
		c.JSON(http.StatusBadRequest, gin.H{"error": "Invalid Project ID"})
		return
	}

	supplierID, err := primitive.ObjectIDFromHex(payload.SupplierID)
	if err != nil {
		c.JSON(http.StatusBadRequest, gin.H{"error": "Invalid Supplier ID"})
		return
	}

	var soID *primitive.ObjectID
	if payload.SOID != "" {
		tmp, err := primitive.ObjectIDFromHex(payload.SOID)
		if err != nil {
			c.JSON(http.StatusBadRequest, gin.H{"error": "Invalid Sales Order ID"})
			return
		}
		soID = &tmp
	}

	// Build Items and Calculate Total
	var items []models.SupplierPOItem

	for _, item := range payload.Items {
		items = append(items, models.SupplierPOItem{
			Description: item.Description,
			Quantity:    item.Quantity,
			UOM:         item.UOM,
		})
	}

	po := models.SupplierPO{
		ID:         primitive.NewObjectID(),
		POID:       "PO-" + time.Now().Format("20060102150405"), // simple & readable
		ProjectID:  projectID,
		SupplierID: supplierID,
		SOID:       soID,
		Items:      items,
		Status:     "draft",
		CreatedAt:  time.Now(),
	}

	collection := db.Collection("supplier_purchase_orders")
	if _, err := collection.InsertOne(c, po); err != nil {
		c.JSON(http.StatusInternalServerError, gin.H{"error": "Failed to create Supplier PO", "details": err.Error()})
		return
	}

	c.JSON(http.StatusOK, gin.H{
		"message":    "Supplier PO created successfully",
		"supplierPO": po,
	})
}

func GetAllSupplierPO(c *gin.Context, db *mongo.Database) {
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

	// Hardcoded pagination
	page := int64(1)
	limit := int64(10)

	if p := c.Query("page"); p != "" {
		if v, err := strconv.ParseInt(p, 10, 64); err == nil && v > 0 {
			page = v
		}
	}

	skip := (page - 1) * limit

	collection := db.Collection("supplier_purchase_orders")

	cursor, err := collection.Find(
		c,
		bson.M{},
		options.Find().
			SetSkip(skip).
			SetLimit(limit).
			SetSort(bson.M{"createdAt": -1}),
	)
	if err != nil {
		c.JSON(http.StatusInternalServerError, gin.H{"error": "Failed to fetch Supplier POs"})
		return
	}
	defer cursor.Close(c)

	var pos []models.SupplierPO
	if err := cursor.All(c, &pos); err != nil {
		c.JSON(http.StatusInternalServerError, gin.H{"error": "Failed to decode Supplier POs"})
		return
	}

	total, err := collection.CountDocuments(c, bson.M{})
	if err != nil {
		c.JSON(http.StatusInternalServerError, gin.H{"error": "Failed to count Supplier POs"})
		return
	}

	c.JSON(http.StatusOK, gin.H{
		"data":  pos,
		"page":  page,
		"limit": limit, // always 10
		"total": total,
	})
}

func GetSupplierPOByID(c *gin.Context, db *mongo.Database) {
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

	poID, err := primitive.ObjectIDFromHex(id)
	if err != nil {
		c.JSON(http.StatusBadRequest, gin.H{"error": "Invalid Supplier PO ID"})
		return
	}

	collection := db.Collection("supplier_purchase_orders")

	var po models.SupplierPO
	err = collection.FindOne(c, bson.M{"_id": poID}).Decode(&po)
	if err != nil {
		if err == mongo.ErrNoDocuments {
			c.JSON(http.StatusNotFound, gin.H{"error": "Supplier PO not found"})
			return
		}
		c.JSON(http.StatusInternalServerError, gin.H{"error": "Failed to fetch Supplier PO"})
		return
	}

	c.JSON(http.StatusOK, gin.H{"supplierPO": po})
}

func UpdateSupplierPO(c *gin.Context, db *mongo.Database) {
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

	var payload config.UpdateSupplierPO
	if err := c.ShouldBindJSON(&payload); err != nil {
		c.JSON(http.StatusBadRequest, gin.H{"error": "Invalid request payload"})
		return
	}

	poID, err := primitive.ObjectIDFromHex(payload.SupplierPOID)
	if err != nil {
		c.JSON(http.StatusBadRequest, gin.H{"error": "Invalid Supplier PO ID"})
		return
	}

	var items []models.SupplierPOItem
	for _, item := range payload.Items {
		items = append(items, models.SupplierPOItem{
			Description: item.Description,
			Quantity:    item.Quantity,
			UOM:         item.UOM,
		})
	}

	update := bson.M{
		"$set": bson.M{
			"items":  items,
			"status": payload.Status,
		},
	}

	// Approval handling
	if payload.Status == "approved" {
		now := time.Now()
		update["$set"].(bson.M)["approvedAt"] = &now
	}

	collection := db.Collection("supplier_purchase_orders")

	res, err := collection.UpdateOne(c, bson.M{"_id": poID}, update)
	if err != nil {
		c.JSON(http.StatusInternalServerError, gin.H{"error": "Failed to update Supplier PO"})
		return
	}

	if res.MatchedCount == 0 {
		c.JSON(http.StatusNotFound, gin.H{"error": "Supplier PO not found"})
		return
	}

	c.JSON(http.StatusOK, gin.H{"message": "Supplier PO updated successfully"})
}

func DeleteSupplierPO(c *gin.Context, db *mongo.Database) {
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

	poID, err := primitive.ObjectIDFromHex(id)
	if err != nil {
		c.JSON(http.StatusBadRequest, gin.H{"error": "Invalid Supplier PO ID"})
		return
	}

	collection := db.Collection("supplier_purchase_orders")

	res, err := collection.DeleteOne(c, bson.M{"_id": poID})
	if err != nil {
		c.JSON(http.StatusInternalServerError, gin.H{"error": "Failed to delete Supplier PO"})
		return
	}

	if res.DeletedCount == 0 {
		c.JSON(http.StatusNotFound, gin.H{"error": "Supplier PO not found"})
		return
	}

	c.JSON(http.StatusOK, gin.H{"message": "Supplier PO deleted successfully"})
}

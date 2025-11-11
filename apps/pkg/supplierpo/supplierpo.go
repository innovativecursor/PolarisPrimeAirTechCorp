package supplierpo

import (
	"net/http"
	"time"

	"github.com/gin-gonic/gin"
	"github.com/innovativecursor/PolarisPrimeAirTechCorp/apps/pkg/models"
	"github.com/innovativecursor/PolarisPrimeAirTechCorp/apps/pkg/supplierpo/config"
	"go.mongodb.org/mongo-driver/bson"
	"go.mongodb.org/mongo-driver/bson/primitive"
	"go.mongodb.org/mongo-driver/mongo"
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

	// Convert CustomerPOIDs to ObjectIDs
	var customerPOIDs []primitive.ObjectID
	for _, id := range payload.CustomerPOIDs {
		if oid, err := primitive.ObjectIDFromHex(id); err == nil {
			customerPOIDs = append(customerPOIDs, oid)
		} else {
			c.JSON(http.StatusBadRequest, gin.H{"error": "Invalid Customer PO ID", "id": id})
			return
		}
	}

	// Build Items and Calculate Total
	var items []models.SupplierPOItem
	var total float64

	for _, item := range payload.Items {
		amount := float64(item.Quantity) * item.Rate
		items = append(items, models.SupplierPOItem{
			Description: item.Description,
			Quantity:    item.Quantity,
			UOM:         item.UOM,
			Rate:        item.Rate,
			Amount:      amount,
		})
		total += amount
	}

	po := models.SupplierPO{
		ID:            primitive.NewObjectID(),
		ProjectID:     projectID,
		SupplierID:    supplierID,
		SOID:          soID,
		CustomerPOIDs: customerPOIDs,
		Items:         items,
		TotalAmount:   total,
		Status:        "draft",
		CreatedAt:     time.Now(),
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

// Update Supplier Purchase Order
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
		c.JSON(http.StatusBadRequest, gin.H{"error": "Invalid request payload", "details": err.Error()})
		return
	}

	supplierPOID, err := primitive.ObjectIDFromHex(payload.SupplierPOID)
	if err != nil {
		c.JSON(http.StatusBadRequest, gin.H{"error": "Invalid Supplier PO ID"})
		return
	}

	collection := db.Collection("supplier_purchase_orders")

	var existing models.SupplierPO
	if err := collection.FindOne(c, bson.M{"_id": supplierPOID, "status": "draft"}).Decode(&existing); err != nil {
		c.JSON(http.StatusBadRequest, gin.H{"error": "Supplier PO not found or not editable"})
		return
	}

	// Rebuild Items and Calculate Total
	var items []models.SupplierPOItem
	var total float64

	for _, item := range payload.Items {
		amount := float64(item.Quantity) * item.Rate
		items = append(items, models.SupplierPOItem{
			Description: item.Description,
			Quantity:    item.Quantity,
			UOM:         item.UOM,
			Rate:        item.Rate,
			Amount:      amount,
		})
		total += amount
	}

	now := time.Now()
	update := bson.M{
		"$set": bson.M{
			"items":       items,
			"totalAmount": total,
			"updatedAt":   &now,
		},
	}

	if _, err := collection.UpdateOne(c, bson.M{"_id": supplierPOID}, update); err != nil {
		c.JSON(http.StatusInternalServerError, gin.H{"error": "Failed to update Supplier PO", "details": err.Error()})
		return
	}

	c.JSON(http.StatusOK, gin.H{"message": "Supplier PO updated successfully"})
}

// Get All Supplier POs by Supplier ID
func GetSupplierPOsBySupplier(c *gin.Context, db *mongo.Database) {
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

	supplierIDParam := c.Param("supplierId")
	supplierID, err := primitive.ObjectIDFromHex(supplierIDParam)
	if err != nil {
		c.JSON(http.StatusBadRequest, gin.H{"error": "Invalid Supplier ID"})
		return
	}

	collection := db.Collection("supplier_purchase_orders")

	// Enrich data with related Project, Supplier, and SO details
	pipeline := mongo.Pipeline{
		{{Key: "$match", Value: bson.D{{Key: "supplierId", Value: supplierID}}}},
		{{
			Key: "$lookup",
			Value: bson.D{
				{Key: "from", Value: "suppliers"},
				{Key: "localField", Value: "supplierId"},
				{Key: "foreignField", Value: "_id"},
				{Key: "as", Value: "supplierDetails"},
			},
		}},
		{{
			Key: "$lookup",
			Value: bson.D{
				{Key: "from", Value: "project"},
				{Key: "localField", Value: "projectId"},
				{Key: "foreignField", Value: "_id"},
				{Key: "as", Value: "projectDetails"},
			},
		}},
		{{
			Key: "$lookup",
			Value: bson.D{
				{Key: "from", Value: "sales_orders"},
				{Key: "localField", Value: "soId"},
				{Key: "foreignField", Value: "_id"},
				{Key: "as", Value: "salesOrderDetails"},
			},
		}},
		{{Key: "$sort", Value: bson.D{{Key: "createdAt", Value: -1}}}},
	}

	cursor, err := collection.Aggregate(c, pipeline)
	if err != nil {
		c.JSON(http.StatusInternalServerError, gin.H{"error": "Failed to fetch Supplier POs", "details": err.Error()})
		return
	}
	defer cursor.Close(c)

	var results []bson.M
	if err := cursor.All(c, &results); err != nil {
		c.JSON(http.StatusInternalServerError, gin.H{"error": "Failed to parse Supplier POs"})
		return
	}

	c.JSON(http.StatusOK, gin.H{"supplierPOs": results})
}

// Get Single Supplier PO by ID

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

	poIDParam := c.Param("supplierPOId")
	poID, err := primitive.ObjectIDFromHex(poIDParam)
	if err != nil {
		c.JSON(http.StatusBadRequest, gin.H{"error": "Invalid Supplier PO ID"})
		return
	}

	collection := db.Collection("supplier_purchase_orders")

	// Aggregate to bring all related info (Supplier, Project, SO, Linked Customer POs)
	pipeline := mongo.Pipeline{
		{{Key: "$match", Value: bson.D{{Key: "_id", Value: poID}}}},
		{{
			Key: "$lookup",
			Value: bson.D{
				{Key: "from", Value: "suppliers"},
				{Key: "localField", Value: "supplierId"},
				{Key: "foreignField", Value: "_id"},
				{Key: "as", Value: "supplierDetails"},
			},
		}},
		{{
			Key: "$lookup",
			Value: bson.D{
				{Key: "from", Value: "project"},
				{Key: "localField", Value: "projectId"},
				{Key: "foreignField", Value: "_id"},
				{Key: "as", Value: "projectDetails"},
			},
		}},
		{{
			Key: "$lookup",
			Value: bson.D{
				{Key: "from", Value: "sales_orders"},
				{Key: "localField", Value: "soId"},
				{Key: "foreignField", Value: "_id"},
				{Key: "as", Value: "salesOrderDetails"},
			},
		}},
		{{
			Key: "$lookup",
			Value: bson.D{
				{Key: "from", Value: "customer_purchase_orders"},
				{Key: "localField", Value: "customerPoIds"},
				{Key: "foreignField", Value: "_id"},
				{Key: "as", Value: "linkedCustomerPOs"},
			},
		}},
	}

	cursor, err := collection.Aggregate(c, pipeline)
	if err != nil {
		c.JSON(http.StatusInternalServerError, gin.H{"error": "Failed to fetch Supplier PO", "details": err.Error()})
		return
	}
	defer cursor.Close(c)

	var results []bson.M
	if err := cursor.All(c, &results); err != nil {
		c.JSON(http.StatusInternalServerError, gin.H{"error": "Failed to parse Supplier PO data"})
		return
	}

	if len(results) == 0 {
		c.JSON(http.StatusNotFound, gin.H{"error": "Supplier PO not found"})
		return
	}

	c.JSON(http.StatusOK, gin.H{"supplierPO": results[0]})
}

// Not in use yet
// Toggle Supplier PO Status
func ToggleSupplierPOStatus(c *gin.Context, db *mongo.Database) {
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

	var payload config.ToggleSupplierPOStatus
	if err := c.ShouldBindJSON(&payload); err != nil {
		c.JSON(http.StatusBadRequest, gin.H{"error": "Invalid request payload"})
		return
	}

	supplierPOID, err := primitive.ObjectIDFromHex(payload.SupplierPOID)
	if err != nil {
		c.JSON(http.StatusBadRequest, gin.H{"error": "Invalid Supplier PO ID"})
		return
	}

	collection := db.Collection("supplier_purchase_orders")

	validStatuses := map[string]bool{
		"draft":    true,
		"approved": true,
		"sent":     true,
		"closed":   true,
	}

	if !validStatuses[payload.Status] {
		c.JSON(http.StatusBadRequest, gin.H{"error": "Invalid status value"})
		return
	}

	update := bson.M{
		"$set": bson.M{
			"status":     payload.Status,
			"approvedBy": authUser.ID,
			"approvedAt": time.Now(),
		},
	}

	_, err = collection.UpdateOne(c, bson.M{"_id": supplierPOID}, update)
	if err != nil {
		c.JSON(http.StatusInternalServerError, gin.H{"error": "Failed to update status"})
		return
	}

	c.JSON(http.StatusOK, gin.H{"message": "Supplier PO status updated successfully", "newStatus": payload.Status})
}

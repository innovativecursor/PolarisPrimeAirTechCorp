package polarisinventory

import (
	"context"
	"net/http"
	"time"

	"github.com/gin-gonic/gin"
	"github.com/innovativecursor/PolarisPrimeAirTechCorp/apps/pkg/models"
	"github.com/innovativecursor/PolarisPrimeAirTechCorp/apps/pkg/polarisinventory/config"
	"go.mongodb.org/mongo-driver/bson"
	"go.mongodb.org/mongo-driver/bson/primitive"
	"go.mongodb.org/mongo-driver/mongo"
	"go.mongodb.org/mongo-driver/mongo/options"
)

func AddInventory(c *gin.Context, db *mongo.Database) {
	user, exists := c.Get("user")
	if !exists {
		c.JSON(http.StatusUnauthorized, gin.H{"error": "User not found"})
		return
	}
	userObj, ok := user.(*models.User)
	if !ok {
		c.JSON(http.StatusUnauthorized, gin.H{"error": "Invalid user object"})
		return
	}

	var payload config.AddUpdateInventory
	if err := c.ShouldBindJSON(&payload); err != nil {
		c.JSON(http.StatusBadRequest, gin.H{"error": err.Error()})
		return
	}

	inventory := models.PolarisInventory{
		ID:                primitive.NewObjectID(),
		SKU:               payload.SKU,
		Barcode:           payload.Barcode,
		AirconModelNumber: payload.AirconModelNumber,
		AirconName:        payload.AirconName,
		Price:             payload.Price,
		HP:                payload.HP,
		TypeOfAircon:      payload.TypeOfAircon,
		IndoorOutdoorUnit: payload.IndoorOutdoorUnit,
		Quantity:          payload.Quantity,
		CreatedBy:         userObj.ID,
		CreatedAt:         time.Now(),
		UpdatedAt:         time.Now(),
	}

	collection := db.Collection("polaris_inventory")
	_, err := collection.InsertOne(context.Background(), inventory)
	if err != nil {
		c.JSON(http.StatusInternalServerError, gin.H{"error": "Failed to add inventory", "details": err.Error()})
		return
	}

	c.JSON(http.StatusCreated, gin.H{"message": "Inventory added successfully", "data": inventory})
}

func GetAllInventory(c *gin.Context, db *mongo.Database) {
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

	collection := db.Collection("polaris_inventory")

	cursor, err := collection.Find(context.Background(), bson.M{})
	if err != nil {
		c.JSON(http.StatusInternalServerError, gin.H{"error": "Failed to fetch inventory"})
		return
	}
	defer cursor.Close(context.Background())

	var items []models.PolarisInventory
	if err := cursor.All(context.Background(), &items); err != nil {
		c.JSON(http.StatusInternalServerError, gin.H{"error": "Failed to parse inventory data"})
		return
	}

	c.JSON(http.StatusOK, gin.H{"inventory": items})
}

func GetInventoryByID(c *gin.Context, db *mongo.Database) {
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

	idParam := c.Param("id")
	objectID, err := primitive.ObjectIDFromHex(idParam)
	if err != nil {
		c.JSON(http.StatusBadRequest, gin.H{"error": "Invalid inventory ID"})
		return
	}

	collection := db.Collection("polaris_inventory")

	var item models.PolarisInventory
	err = collection.FindOne(context.Background(), bson.M{"_id": objectID}).Decode(&item)
	if err != nil {
		if err == mongo.ErrNoDocuments {
			c.JSON(http.StatusNotFound, gin.H{"error": "Inventory not found"})
			return
		}
		c.JSON(http.StatusInternalServerError, gin.H{"error": "Failed to fetch inventory"})
		return
	}

	c.JSON(http.StatusOK, gin.H{"inventory": item})
}

func UpdateInventory(c *gin.Context, db *mongo.Database) {
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

	idParam := c.Param("id")
	objectID, err := primitive.ObjectIDFromHex(idParam)
	if err != nil {
		c.JSON(http.StatusBadRequest, gin.H{"error": "Invalid inventory ID"})
		return
	}

	var payload config.AddUpdateInventory
	if err := c.ShouldBindJSON(&payload); err != nil {
		c.JSON(http.StatusBadRequest, gin.H{"error": err.Error()})
		return
	}

	update := bson.M{
		"$set": bson.M{
			"sku":                 payload.SKU,
			"barcode":             payload.Barcode,
			"aircon_model_number": payload.AirconModelNumber,
			"aircon_name":         payload.AirconName,
			"price":               payload.Price,
			"hp":                  payload.HP,
			"type_of_aircon":      payload.TypeOfAircon,
			"indoor_outdoor_unit": payload.IndoorOutdoorUnit,
			"quantity":            payload.Quantity,
			"updated_at":          time.Now(),
		},
	}

	collection := db.Collection("polaris_inventory")
	_, err = collection.UpdateByID(context.Background(), objectID, update)
	if err != nil {
		c.JSON(http.StatusInternalServerError, gin.H{"error": "Failed to update inventory"})
		return
	}

	c.JSON(http.StatusOK, gin.H{"message": "Inventory updated successfully"})
}

func DeleteInventory(c *gin.Context, db *mongo.Database) {
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

	idParam := c.Param("id")
	objectID, err := primitive.ObjectIDFromHex(idParam)
	if err != nil {
		c.JSON(http.StatusBadRequest, gin.H{"error": "Invalid inventory ID"})
		return
	}

	collection := db.Collection("polaris_inventory")
	_, err = collection.DeleteOne(context.Background(), bson.M{"_id": objectID})
	if err != nil {
		c.JSON(http.StatusInternalServerError, gin.H{"error": "Failed to delete inventory"})
		return
	}

	c.JSON(http.StatusOK, gin.H{"message": "Inventory deleted successfully"})
}

func AddOrUpdateReceivingReportInventory(c *gin.Context, db *mongo.Database) {
	user, exists := c.Get("user")
	if !exists {
		c.JSON(http.StatusUnauthorized, gin.H{"error": "User not found"})
		return
	}
	userObj, ok := user.(*models.User)
	if !ok {
		c.JSON(http.StatusUnauthorized, gin.H{"error": "Invalid user object"})
		return
	}
	var payload config.AddUpdateInventoryRR
	if err := c.ShouldBindJSON(&payload); err != nil {
		c.JSON(http.StatusBadRequest, gin.H{"error": err.Error()})
		return
	}

	collection := db.Collection("polaris_inventory")

	// Parse optional RR IDs
	var supplierDRID, supplierInvoiceID, poID, soID *primitive.ObjectID

	if payload.SupplierDRID != "" {
		id, _ := primitive.ObjectIDFromHex(payload.SupplierDRID)
		supplierDRID = &id
	}
	if payload.SupplierInvoiceID != "" {
		id, _ := primitive.ObjectIDFromHex(payload.SupplierInvoiceID)
		supplierInvoiceID = &id
	}
	if payload.PurchaseOrderID != "" {
		id, _ := primitive.ObjectIDFromHex(payload.PurchaseOrderID)
		poID = &id
	}
	if payload.SalesOrderID != "" {
		id, _ := primitive.ObjectIDFromHex(payload.SalesOrderID)
		soID = &id
	}

	if payload.ID != "" {
		objID, err := primitive.ObjectIDFromHex(payload.ID)
		if err != nil {
			c.JSON(http.StatusBadRequest, gin.H{"error": "Invalid ID"})
			return
		}

		update := bson.M{
			"$set": bson.M{
				"sku":                 payload.SKU,
				"barcode":             payload.Barcode,
				"aircon_model_number": payload.AirconModelNumber,
				"aircon_name":         payload.AirconName,
				"price":               payload.Price,
				"hp":                  payload.HP,
				"type_of_aircon":      payload.TypeOfAircon,
				"indoor_outdoor_unit": payload.IndoorOutdoorUnit,
				"quantity":            payload.Quantity,

				"supplier_dr_id":      supplierDRID,
				"supplier_invoice_id": supplierInvoiceID,
				"purchase_order_id":   poID,
				"sales_order_id":      soID,

				"updated_at": time.Now(),
			},
		}

		_, err = collection.UpdateByID(context.Background(), objID, update)
		if err != nil {
			c.JSON(http.StatusInternalServerError, gin.H{"error": "Failed to update inventory"})
			return
		}

		c.JSON(http.StatusOK, gin.H{"message": "RR inventory updated successfully"})
		return
	}

	item := models.PolarisInventory{
		SKU:               payload.SKU,
		Barcode:           payload.Barcode,
		AirconModelNumber: payload.AirconModelNumber,
		AirconName:        payload.AirconName,
		HP:                payload.HP,
		TypeOfAircon:      payload.TypeOfAircon,
		IndoorOutdoorUnit: payload.IndoorOutdoorUnit,
		Quantity:          payload.Quantity,
		Price:             payload.Price,

		SupplierDRID:      supplierDRID,
		SupplierInvoiceID: supplierInvoiceID,
		PurchaseOrderID:   poID,
		SalesOrderID:      soID,

		CreatedBy: userObj.ID,
		CreatedAt: time.Now(),
		UpdatedAt: time.Now(),
	}

	_, err := collection.InsertOne(context.Background(), item)
	if err != nil {
		c.JSON(http.StatusInternalServerError, gin.H{"error": "Failed to create RR inventory"})
		return
	}

	c.JSON(http.StatusOK, gin.H{"message": "RR inventory created successfully", "data": item})
}

func GetAllReceivingReportInventory(c *gin.Context, db *mongo.Database) {
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
	collection := db.Collection("polaris_inventory")

	cursor, err := collection.Find(context.Background(), bson.M{}, options.Find().SetSort(bson.M{
		"created_at": -1,
	}))
	if err != nil {
		c.JSON(http.StatusInternalServerError, gin.H{"error": "Failed to fetch inventory"})
		return
	}
	defer cursor.Close(context.Background())

	var items []models.PolarisInventory
	if err := cursor.All(context.Background(), &items); err != nil {
		c.JSON(http.StatusInternalServerError, gin.H{"error": "Failed to parse inventory"})
		return
	}

	c.JSON(http.StatusOK, gin.H{"message": "Inventory fetched", "data": items})
}

func GetReceivingReportInventoryByID(c *gin.Context, db *mongo.Database) {
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
		c.JSON(http.StatusBadRequest, gin.H{"error": "Invalid ID"})
		return
	}

	collection := db.Collection("polaris_inventory")

	var item models.PolarisInventory
	err = collection.FindOne(context.Background(), bson.M{"_id": objID}).Decode(&item)
	if err != nil {
		if err == mongo.ErrNoDocuments {
			c.JSON(http.StatusNotFound, gin.H{"error": "Inventory not found"})
			return
		}
		c.JSON(http.StatusInternalServerError, gin.H{"error": "Failed to fetch inventory"})
		return
	}

	c.JSON(http.StatusOK, gin.H{"message": "Inventory fetched", "data": item})
}

func DeleteReceivingReportInventory(c *gin.Context, db *mongo.Database) {
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
		c.JSON(http.StatusBadRequest, gin.H{"error": "Invalid ID"})
		return
	}

	collection := db.Collection("polaris_inventory")

	res, err := collection.DeleteOne(context.Background(), bson.M{"_id": objID})
	if err != nil {
		c.JSON(http.StatusInternalServerError, gin.H{"error": "Failed to delete inventory"})
		return
	}

	if res.DeletedCount == 0 {
		c.JSON(http.StatusNotFound, gin.H{"error": "Inventory not found"})
		return
	}

	c.JSON(http.StatusOK, gin.H{"message": "Inventory deleted successfully"})
}

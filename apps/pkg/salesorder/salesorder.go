package salesorder

import (
	"net/http"
	"time"

	"github.com/gin-gonic/gin"
	"github.com/innovativecursor/PolarisPrimeAirTechCorp/apps/pkg/models"
	"github.com/innovativecursor/PolarisPrimeAirTechCorp/apps/pkg/salesorder/config"
	"go.mongodb.org/mongo-driver/bson"
	"go.mongodb.org/mongo-driver/bson/primitive"
	"go.mongodb.org/mongo-driver/mongo"
)

func CreateSalesOrder(c *gin.Context, db *mongo.Database) {
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

	var payload config.SalesOrderData
	if err := c.ShouldBindJSON(&payload); err != nil {
		c.JSON(http.StatusBadRequest, gin.H{"error": "Invalid payload", "details": err.Error()})
		return
	}

	projectID, err := primitive.ObjectIDFromHex(payload.ProjectID)
	if err != nil {
		c.JSON(http.StatusBadRequest, gin.H{"error": "Invalid project ID"})
		return
	}

	customerID, err := primitive.ObjectIDFromHex(payload.CustomerID)
	if err != nil {
		c.JSON(http.StatusBadRequest, gin.H{"error": "Invalid customer ID"})
		return
	}

	var items []models.SalesOrderItem
	var total float64

	for _, item := range payload.Items {
		airconID, err := primitive.ObjectIDFromHex(item.AirconID)
		if err != nil {
			c.JSON(http.StatusBadRequest, gin.H{"error": "Invalid Aircon ID"})
			return
		}
		subtotal := float64(item.Qty) * item.Price
		items = append(items, models.SalesOrderItem{
			AirconID: airconID,
			Qty:      item.Qty,
			UOM:      item.UOM,
			Price:    item.Price,
			Subtotal: subtotal,
		})
		total += subtotal
	}

	salesOrder := models.SalesOrder{
		ProjectID:   projectID,
		CustomerID:  customerID,
		Items:       items,
		TotalAmount: total,
		CreatedBy:   authUser.ID,
		CreatedAt:   time.Now(),
		UpdatedAt:   time.Now(),
		Status:      "draft",
	}

	collection := db.Collection("salesorder")
	res, err := collection.InsertOne(c, salesOrder)
	if err != nil {
		c.JSON(http.StatusInternalServerError, gin.H{"error": "Failed to create sales order", "details": err.Error()})
		return
	}

	c.JSON(http.StatusOK, gin.H{"message": "Sales order created successfully", "id": res.InsertedID})
}

func GetAllSalesOrders(c *gin.Context, db *mongo.Database) {
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

	collection := db.Collection("salesorder")

	cursor, err := collection.Find(c, bson.M{})
	if err != nil {
		c.JSON(http.StatusInternalServerError, gin.H{"error": "Failed to fetch sales orders", "details": err.Error()})
		return
	}
	defer cursor.Close(c)

	var orders []models.SalesOrder
	if err := cursor.All(c, &orders); err != nil {
		c.JSON(http.StatusInternalServerError, gin.H{"error": "Failed to decode sales orders", "details": err.Error()})
		return
	}

	c.JSON(http.StatusOK, gin.H{"salesOrders": orders})
}

func GetSalesOrderByID(c *gin.Context, db *mongo.Database) {
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
	if id == "" {
		c.JSON(http.StatusBadRequest, gin.H{"error": "ID parameter required"})
		return
	}

	objID, err := primitive.ObjectIDFromHex(id)
	if err != nil {
		c.JSON(http.StatusBadRequest, gin.H{"error": "Invalid ID format"})
		return
	}

	collection := db.Collection("salesorder")

	var order models.SalesOrder
	err = collection.FindOne(c, bson.M{"_id": objID}).Decode(&order)
	if err != nil {
		if err == mongo.ErrNoDocuments {
			c.JSON(http.StatusNotFound, gin.H{"error": "Sales order not found"})
		} else {
			c.JSON(http.StatusInternalServerError, gin.H{"error": "Failed to fetch sales order", "details": err.Error()})
		}
		return
	}

	c.JSON(http.StatusOK, gin.H{"salesOrder": order})
}

func DeleteSalesOrder(c *gin.Context, db *mongo.Database) {
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
	if err := c.ShouldBindJSON(&payload); err != nil {
		c.JSON(http.StatusBadRequest, gin.H{"error": "Invalid request payload", "details": err.Error()})
		return
	}

	if payload.ID == "" {
		c.JSON(http.StatusBadRequest, gin.H{"error": "ID is required"})
		return
	}

	objID, err := primitive.ObjectIDFromHex(payload.ID)
	if err != nil {
		c.JSON(http.StatusBadRequest, gin.H{"error": "Invalid ID format"})
		return
	}

	collection := db.Collection("salesorder")
	res, err := collection.DeleteOne(c, bson.M{"_id": objID})
	if err != nil {
		c.JSON(http.StatusInternalServerError, gin.H{"error": "Failed to delete sales order", "details": err.Error()})
		return
	}

	if res.DeletedCount == 0 {
		c.JSON(http.StatusNotFound, gin.H{"error": "Sales order not found"})
		return
	}

	c.JSON(http.StatusOK, gin.H{"message": "Sales order deleted successfully", "deletedId": payload.ID})
}

func CreateAircon(c *gin.Context, db *mongo.Database) {
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

	var payload config.AirconData
	if err := c.ShouldBindJSON(&payload); err != nil {
		c.JSON(http.StatusBadRequest, gin.H{"error": "Invalid request payload", "details": err.Error()})
		return
	}

	if payload.Name == "" || payload.Brand == "" {
		c.JSON(http.StatusBadRequest, gin.H{"error": "Name and Brand are required"})
		return
	}

	collection := db.Collection("aircon")
	_, err := collection.InsertOne(c, payload)
	if err != nil {
		c.JSON(http.StatusInternalServerError, gin.H{"error": "Failed to save aircon", "details": err.Error()})
		return
	}

	c.JSON(http.StatusOK, gin.H{
		"message": "Aircon added successfully",
		"aircon":  payload,
	})
}

func GetAllAircon(c *gin.Context, db *mongo.Database) {
	collection := db.Collection("aircon")

	cursor, err := collection.Find(c, bson.M{})
	if err != nil {
		c.JSON(http.StatusInternalServerError, gin.H{"error": "Failed to fetch aircons", "details": err.Error()})
		return
	}
	defer cursor.Close(c)

	var aircons []models.Aircon
	if err := cursor.All(c, &aircons); err != nil {
		c.JSON(http.StatusInternalServerError, gin.H{"error": "Failed to decode aircons", "details": err.Error()})
		return
	}

	c.JSON(http.StatusOK, gin.H{"aircons": aircons})
}

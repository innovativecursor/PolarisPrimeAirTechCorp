package customer

import (
	"fmt"
	"net/http"
	"time"

	"github.com/gin-gonic/gin"
	"github.com/innovativecursor/PolarisPrimeAirTechCorp/apps/pkg/customer/config"
	"github.com/innovativecursor/PolarisPrimeAirTechCorp/apps/pkg/models"
	"go.mongodb.org/mongo-driver/bson"
	"go.mongodb.org/mongo-driver/bson/primitive"
	"go.mongodb.org/mongo-driver/mongo"
)

func GenerateCustomerID(count int64) string {
	year := time.Now().Year()
	return fmt.Sprintf("CUST-%d-%05d", year, count+1)
}

func AddCustomer(c *gin.Context, db *mongo.Database) {
	_, exists := c.Get("user")
	if !exists {
		c.JSON(http.StatusUnauthorized, gin.H{"error": "User not found"})
		return
	}

	var payload config.CustomerData
	if err := c.ShouldBindJSON(&payload); err != nil {
		c.JSON(http.StatusBadRequest, gin.H{"error": "Invalid request payload"})
		return
	}

	collection := db.Collection("customer")

	// ===================== UPDATE =====================
	if payload.ID != "" {
		objID, err := primitive.ObjectIDFromHex(payload.ID)
		if err != nil {
			c.JSON(http.StatusBadRequest, gin.H{"error": "Invalid customer ID"})
			return
		}

		update := bson.M{
			"$set": bson.M{
				"customername": payload.CustomerName,
				"customerorg":  payload.CustomerOrg,
				"address":      payload.Address,
				"city":         payload.City,
				"tinnumber":    payload.TINNumber,
			},
		}

		res, err := collection.UpdateOne(
			c,
			bson.M{"_id": objID},
			update,
		)
		if err != nil {
			c.JSON(http.StatusInternalServerError, gin.H{"error": "Failed to update customer"})
			return
		}

		if res.MatchedCount == 0 {
			c.JSON(http.StatusNotFound, gin.H{"error": "Customer not found"})
			return
		}

		c.JSON(http.StatusOK, gin.H{"message": "Customer updated successfully"})
		return
	}

	// ===================== CREATE =====================
	count, err := collection.CountDocuments(c, bson.M{})
	if err != nil {
		c.JSON(http.StatusInternalServerError, gin.H{"error": "Failed to generate customer ID"})
		return
	}

	customer := models.Customer{
		ID:           primitive.NewObjectID(),
		CustomerID:   GenerateCustomerID(count),
		CustomerName: payload.CustomerName,
		CustomerOrg:  payload.CustomerOrg,
		Address:      payload.Address,
		TINNumber:    payload.TINNumber,
		City:         payload.City,
		CreatedAt:    time.Now(),
	}

	_, err = collection.InsertOne(c, customer)
	if err != nil {
		c.JSON(http.StatusInternalServerError, gin.H{"error": "Failed to create customer"})
		return
	}

	c.JSON(http.StatusOK, gin.H{
		"message":  "Customer created successfully",
		"customer": customer,
	})
}

func GetAllCustomers(c *gin.Context, db *mongo.Database) {
	// Get authenticated user from context
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

	collection := db.Collection("customer")

	// Query all customers
	cursor, err := collection.Find(c, bson.M{})
	if err != nil {
		c.JSON(http.StatusInternalServerError, gin.H{"error": "Failed to fetch customers", "details": err.Error()})
		return
	}
	defer cursor.Close(c)

	var customers []models.Customer
	if err := cursor.All(c, &customers); err != nil {
		c.JSON(http.StatusInternalServerError, gin.H{"error": "Failed to decode customers", "details": err.Error()})
		return
	}

	c.JSON(http.StatusOK, gin.H{"customers": customers})
}

func DeleteCustomer(c *gin.Context, db *mongo.Database) {
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

	// Bind JSON payload
	var payload config.DeleteCustomer
	if err := c.ShouldBindJSON(&payload); err != nil {
		c.JSON(http.StatusBadRequest, gin.H{"error": "Invalid request payload", "details": err.Error()})
		return
	}

	// Validate ID
	if payload.ID == "" {
		c.JSON(http.StatusBadRequest, gin.H{"error": "ID is required"})
		return
	}

	objID, err := primitive.ObjectIDFromHex(payload.ID)
	if err != nil {
		c.JSON(http.StatusBadRequest, gin.H{"error": "Invalid ID format"})
		return
	}

	collection := db.Collection("customer")
	res, err := collection.DeleteOne(c, bson.M{"_id": objID})
	if err != nil {
		c.JSON(http.StatusInternalServerError, gin.H{"error": "Failed to delete customer", "details": err.Error()})
		return
	}

	if res.DeletedCount == 0 {
		c.JSON(http.StatusNotFound, gin.H{"error": "Customer not found"})
		return
	}

	c.JSON(http.StatusOK, gin.H{"message": "Customer deleted successfully", "deletedId": payload.ID})
}

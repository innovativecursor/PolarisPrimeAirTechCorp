package quotation

// import (
// 	"net/http"
// 	"time"

// 	"github.com/gin-gonic/gin"
// 	"github.com/innovativecursor/PolarisPrimeAirTechCorp/apps/pkg/models"
// 	"github.com/innovativecursor/PolarisPrimeAirTechCorp/apps/pkg/quotation/config"
// 	"go.mongodb.org/mongo-driver/bson"
// 	"go.mongodb.org/mongo-driver/bson/primitive"
// 	"go.mongodb.org/mongo-driver/mongo"
// )

// func UpsertQuotation(c *gin.Context, db *mongo.Database) {
// 	// Auth check (same as your existing handlers)
// 	user, exists := c.Get("user")
// 	if !exists {
// 		c.JSON(http.StatusUnauthorized, gin.H{"error": "User not found"})
// 		return
// 	}
// 	_, ok := user.(*models.User)
// 	if !ok {
// 		c.JSON(http.StatusUnauthorized, gin.H{"error": "Invalid user object"})
// 		return
// 	}

// 	var payload config.UpsertQuotation
// 	if err := c.ShouldBindJSON(&payload); err != nil {
// 		c.JSON(http.StatusBadRequest, gin.H{"error": "Invalid request payload", "details": err.Error()})
// 		return
// 	}

// 	customerID, err := primitive.ObjectIDFromHex(payload.CustomerID)
// 	if err != nil {
// 		c.JSON(http.StatusBadRequest, gin.H{"error": "Invalid Customer ID"})
// 		return
// 	}

// 	collection := db.Collection("quotations")

// 	// Calculate total and map items
// 	var items []models.QuotationItem
// 	var total float64
// 	for _, item := range payload.Items {
// 		amount := float64(item.Quantity) * item.Rate
// 		items = append(items, models.QuotationItem{
// 			Description: item.Description,
// 			Quantity:    item.Quantity,
// 			Rate:        item.Rate,
// 			Amount:      amount,
// 		})
// 		total += amount
// 	}

// 	if payload.QuotationID == "" {
// 		// Create quotation
// 		quotation := models.Quotation{
// 			CustomerID:  customerID,
// 			Items:       items,
// 			TotalAmount: total,
// 			Status:      "pending",
// 			CreatedAt:   time.Now(),
// 		}

// 		_, err := collection.InsertOne(c, quotation)
// 		if err != nil {
// 			c.JSON(http.StatusInternalServerError, gin.H{"error": "Failed to create quotation", "details": err.Error()})
// 			return
// 		}

// 		c.JSON(http.StatusOK, gin.H{"message": "Quotation created successfully", "quotation": quotation})
// 	} else {
// 		// Update existing quotation
// 		quotationID, err := primitive.ObjectIDFromHex(payload.QuotationID)
// 		if err != nil {
// 			c.JSON(http.StatusBadRequest, gin.H{"error": "Invalid Quotation ID"})
// 			return
// 		}

// 		// Check if the quotation exists and is pending
// 		var existingQuotation models.Quotation
// 		if err := collection.FindOne(c, bson.M{"_id": quotationID, "status": "pending"}).Decode(&existingQuotation); err != nil {
// 			c.JSON(http.StatusBadRequest, gin.H{"error": "Quotation not found or not editable"})
// 			return
// 		}

// 		update := bson.M{
// 			"$set": bson.M{
// 				"customerId":  customerID,
// 				"items":       items,
// 				"totalAmount": total,
// 				"updatedAt":   time.Now(),
// 			},
// 		}

// 		_, err = collection.UpdateOne(c, bson.M{"_id": quotationID}, update)
// 		if err != nil {
// 			c.JSON(http.StatusInternalServerError, gin.H{"error": "Failed to update quotation"})
// 			return
// 		}

// 		c.JSON(http.StatusOK, gin.H{"message": "Quotation updated successfully"})
// 	}
// }

// func ToggleQuotationStatus(c *gin.Context, db *mongo.Database) {
// 	user, exists := c.Get("user")
// 	if !exists {
// 		c.JSON(http.StatusUnauthorized, gin.H{"error": "User not found"})
// 		return
// 	}
// 	authUser, ok := user.(*models.User)
// 	if !ok {
// 		c.JSON(http.StatusUnauthorized, gin.H{"error": "Invalid user object"})
// 		return
// 	}

// 	var payload config.ToggleQuotationStatus
// 	if err := c.ShouldBindJSON(&payload); err != nil {
// 		c.JSON(http.StatusBadRequest, gin.H{"error": "Invalid request payload", "details": err.Error()})
// 		return
// 	}

// 	quotationID, err := primitive.ObjectIDFromHex(payload.QuotationID)
// 	if err != nil {
// 		c.JSON(http.StatusBadRequest, gin.H{"error": "Invalid Quotation ID"})
// 		return
// 	}

// 	collection := db.Collection("quotations")

// 	// Find current status
// 	var quotation models.Quotation
// 	err = collection.FindOne(c, bson.M{"_id": quotationID}).Decode(&quotation)
// 	if err != nil {
// 		c.JSON(http.StatusNotFound, gin.H{"error": "Quotation not found"})
// 		return
// 	}

// 	var newStatus string
// 	var update bson.M

// 	if quotation.Status == "pending" {
// 		newStatus = "approved"
// 		update = bson.M{
// 			"$set": bson.M{
// 				"status":     newStatus,
// 				"approvedAt": time.Now(),
// 				"approvedBy": authUser.ID,
// 			},
// 		}
// 	} else if quotation.Status == "approved" {
// 		newStatus = "pending"
// 		update = bson.M{
// 			"$set": bson.M{
// 				"status":     newStatus,
// 				"approvedAt": nil,
// 				"approvedBy": nil,
// 			},
// 		}
// 	} else {
// 		c.JSON(http.StatusBadRequest, gin.H{"error": "Toggle not allowed for this status"})
// 		return
// 	}

// 	_, err = collection.UpdateOne(c, bson.M{"_id": quotationID}, update)
// 	if err != nil {
// 		c.JSON(http.StatusInternalServerError, gin.H{"error": "Failed to toggle quotation status"})
// 		return
// 	}

// 	c.JSON(http.StatusOK, gin.H{"message": "Quotation status updated successfully", "newStatus": newStatus})
// }

// func GetQuotationsByCustomer(c *gin.Context, db *mongo.Database) {
// 	user, exists := c.Get("user")
// 	if !exists {
// 		c.JSON(http.StatusUnauthorized, gin.H{"error": "User not found"})
// 		return
// 	}
// 	_, ok := user.(*models.User)
// 	if !ok {
// 		c.JSON(http.StatusUnauthorized, gin.H{"error": "Invalid user object"})
// 		return
// 	}
// 	// Get customer ID from URL params
// 	customerIDParam := c.Param("customerId")
// 	customerID, err := primitive.ObjectIDFromHex(customerIDParam)
// 	if err != nil {
// 		c.JSON(http.StatusBadRequest, gin.H{"error": "Invalid Customer ID"})
// 		return
// 	}

// 	collection := db.Collection("quotations")

// 	// Query quotations for this customer
// 	cursor, err := collection.Find(c, bson.M{"customerId": customerID})
// 	if err != nil {
// 		c.JSON(http.StatusInternalServerError, gin.H{"error": "Failed to fetch quotations", "details": err.Error()})
// 		return
// 	}
// 	defer cursor.Close(c)

// 	var quotations []bson.M
// 	if err := cursor.All(c, &quotations); err != nil {
// 		c.JSON(http.StatusInternalServerError, gin.H{"error": "Failed to parse quotations", "details": err.Error()})
// 		return
// 	}

// 	if len(quotations) == 0 {
// 		c.JSON(http.StatusOK, gin.H{"message": "No quotations found for this customer"})
// 		return
// 	}

// 	c.JSON(http.StatusOK, gin.H{"quotations": quotations})
// }

// func GetQuotationByID(c *gin.Context, db *mongo.Database) {
// 	// Auth check
// 	user, exists := c.Get("user")
// 	if !exists {
// 		c.JSON(http.StatusUnauthorized, gin.H{"error": "User not found"})
// 		return
// 	}
// 	_, ok := user.(*models.User)
// 	if !ok {
// 		c.JSON(http.StatusUnauthorized, gin.H{"error": "Invalid user object"})
// 		return
// 	}

// 	// Get quotation ID from URL params
// 	quotationIDParam := c.Param("quotationId")
// 	quotationID, err := primitive.ObjectIDFromHex(quotationIDParam)
// 	if err != nil {
// 		c.JSON(http.StatusBadRequest, gin.H{"error": "Invalid Quotation ID"})
// 		return
// 	}

// 	collection := db.Collection("quotations")

// 	var quotation bson.M
// 	err = collection.FindOne(c, bson.M{"_id": quotationID}).Decode(&quotation)
// 	if err != nil {
// 		if err == mongo.ErrNoDocuments {
// 			c.JSON(http.StatusNotFound, gin.H{"error": "Quotation not found"})
// 		} else {
// 			c.JSON(http.StatusInternalServerError, gin.H{"error": "Failed to fetch quotation", "details": err.Error()})
// 		}
// 		return
// 	}

// 	c.JSON(http.StatusOK, gin.H{"quotation": quotation})
// }

// // DeleteQuotation handler
// func DeleteQuotation(c *gin.Context, db *mongo.Database) {
// 	// Auth check
// 	user, exists := c.Get("user")
// 	if !exists {
// 		c.JSON(http.StatusUnauthorized, gin.H{"error": "User not found"})
// 		return
// 	}
// 	_, ok := user.(*models.User)
// 	if !ok {
// 		c.JSON(http.StatusUnauthorized, gin.H{"error": "Invalid user object"})
// 		return
// 	}

// 	quotationIDParam := c.Param("quotationId")
// 	quotationID, err := primitive.ObjectIDFromHex(quotationIDParam)
// 	if err != nil {
// 		c.JSON(http.StatusBadRequest, gin.H{"error": "Invalid Quotation ID"})
// 		return
// 	}

// 	collection := db.Collection("quotations")

// 	filter := bson.M{"_id": quotationID, "status": "pending"}
// 	res, err := collection.DeleteOne(c, filter)
// 	if err != nil {
// 		c.JSON(http.StatusInternalServerError, gin.H{"error": "Failed to delete quotation", "details": err.Error()})
// 		return
// 	}

// 	if res.DeletedCount == 0 {
// 		c.JSON(http.StatusBadRequest, gin.H{"error": "Quotation not found or cannot be deleted (only pending quotations can be deleted)"})
// 		return
// 	}

// 	c.JSON(http.StatusOK, gin.H{"message": "Quotation deleted successfully"})
// }

package supplierdr

import (
	"net/http"
	"strconv"
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

	projectID, err := primitive.ObjectIDFromHex(payload.ProjectID)
	if err != nil {
		c.JSON(http.StatusBadRequest, gin.H{"error": "Invalid project ID"})
		return
	}

	dateParsed, _ := time.Parse("2006-01-02", payload.Date)
	dispatchDateParsed, _ := time.Parse("2006-01-02", payload.DispatchDate)

	// Build Items
	var items []models.SupplierDeliveryReceiptItem
	for _, it := range payload.Items {
		items = append(items, models.SupplierDeliveryReceiptItem{
			LineNo:      it.LineNo,
			Model:       it.Model,
			Description: it.Description,
			Plant:       it.Plant,
			StorLoc:     it.StorLoc,
			Unit:        it.Unit,
			ShipQty:     it.ShipQty,
			TotalCBM:    it.TotalCBM,
			TotalKGS:    it.TotalKGS,
			SerialNos:   it.SerialNos,
		})
	}

	// Prepare DR
	dr := models.SupplierDeliveryReceipt{
		SupplierID:   supplierID,
		ProjectID:    projectID,
		SupplierDRNo: payload.SupplierDRNo,
		YourPONo:     payload.YourPONo,
		DispatchDate: dispatchDateParsed,
		ShipTo:       payload.ShipTo,
		Reference:    payload.Reference,
		Date:         dateParsed,
		Items:        items,
		ReceivedBy:   authUser.ID,
		CreatedAt:    time.Now(),
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
	if _, ok := user.(*models.User); !ok {
		c.JSON(http.StatusUnauthorized, gin.H{"error": "Invalid user object"})
		return
	}

	// 🔹 Pagination
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

	collection := db.Collection("supplierdeliveryreceipt")

	pipeline := mongo.Pipeline{

		bson.D{{Key: "$lookup", Value: bson.M{
			"from":         "project",
			"localField":   "project_id",
			"foreignField": "_id",
			"as":           "project",
		}}},

		bson.D{{Key: "$unwind", Value: bson.M{
			"path":                       "$project",
			"preserveNullAndEmptyArrays": true,
		}}},

		bson.D{{Key: "$facet", Value: bson.M{
			"data": bson.A{
				bson.M{"$sort": bson.M{"created_at": -1}},
				bson.M{"$skip": skip},
				bson.M{"$limit": limit},

				bson.M{"$project": bson.M{
					"_id":            1,
					"supplier_id":    1,
					"project_id":     1,
					"supplier_dr_no": 1,
					"your_po_no":     1,
					"dispatch_date":  1,
					"ship_to":        1,
					"reference":      1,
					"date":           1,
					"items":          1,
					"received_by":    1,
					"created_at":     1,

					"project_name": "$project.project_name",
				}},
			},
			"total": bson.A{
				bson.M{"$count": "count"},
			},
		}}},
	}

	cursor, err := collection.Aggregate(c, pipeline)
	if err != nil {
		c.JSON(http.StatusInternalServerError, gin.H{"error": "Failed to fetch supplier DR"})
		return
	}
	defer cursor.Close(c)

	var result []struct {
		Data  []bson.M `bson:"data"`
		Total []struct {
			Count int64 `bson:"count"`
		} `bson:"total"`
	}

	if err := cursor.All(c, &result); err != nil {
		c.JSON(http.StatusInternalServerError, gin.H{"error": "Failed to decode supplier DR"})
		return
	}

	var total int64
	if len(result) > 0 && len(result[0].Total) > 0 {
		total = result[0].Total[0].Count
	}

	c.JSON(http.StatusOK, gin.H{
		"data":  result[0].Data,
		"page":  page,
		"limit": limit,
		"total": total,
	})
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

	objID, err := primitive.ObjectIDFromHex(payload.ID)
	if err != nil {
		c.JSON(http.StatusBadRequest, gin.H{"error": "Invalid DR ID"})
		return
	}

	supplierID, err := primitive.ObjectIDFromHex(payload.SupplierID)
	if err != nil {
		c.JSON(http.StatusBadRequest, gin.H{"error": "Invalid supplier ID"})
		return
	}

	projectID, err := primitive.ObjectIDFromHex(payload.ProjectID)
	if err != nil {
		c.JSON(http.StatusBadRequest, gin.H{"error": "Invalid project ID"})
		return
	}

	dateParsed, _ := time.Parse("2006-01-02", payload.Date)
	dispatchDateParsed, _ := time.Parse("2006-01-02", payload.DispatchDate)

	// Build items
	var items []models.SupplierDeliveryReceiptItem
	for _, it := range payload.Items {
		items = append(items, models.SupplierDeliveryReceiptItem{
			LineNo:      it.LineNo,
			Model:       it.Model,
			Description: it.Description,
			Plant:       it.Plant,
			StorLoc:     it.StorLoc,
			Unit:        it.Unit,
			ShipQty:     it.ShipQty,
			TotalCBM:    it.TotalCBM,
			TotalKGS:    it.TotalKGS,
			SerialNos:   it.SerialNos,
		})
	}

	update := bson.M{
		"$set": bson.M{
			"supplier_id":    supplierID,
			"project_id":     projectID,
			"supplier_dr_no": payload.SupplierDRNo,
			"your_po_no":     payload.YourPONo,
			"dispatch_date":  dispatchDateParsed,
			"ship_to":        payload.ShipTo,
			"reference":      payload.Reference,
			"date":           dateParsed,
			"items":          items,
		},
	}

	_, err = db.Collection("supplierdeliveryreceipt").UpdateOne(c, bson.M{"_id": objID}, update)
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

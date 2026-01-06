package supplierinvoice

import (
	"net/http"
	"strconv"
	"time"

	"github.com/gin-gonic/gin"
	"github.com/innovativecursor/PolarisPrimeAirTechCorp/apps/pkg/models"
	"github.com/innovativecursor/PolarisPrimeAirTechCorp/apps/pkg/supplierinvoice/config"
	"go.mongodb.org/mongo-driver/bson"
	"go.mongodb.org/mongo-driver/bson/primitive"
	"go.mongodb.org/mongo-driver/mongo"
)

func CreateSupplierInvoice(c *gin.Context, db *mongo.Database) {
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

	var payload config.SupplierInvoiceData
	if err := c.ShouldBindJSON(&payload); err != nil {
		c.JSON(http.StatusBadRequest, gin.H{"error": "Invalid payload"})
		return
	}

	supplierID, err := primitive.ObjectIDFromHex(payload.SupplierID)
	if err != nil {
		c.JSON(http.StatusBadRequest, gin.H{"error": "Invalid supplier ID"})
		return
	}

	invDate, _ := time.Parse("2006-01-02", payload.InvoiceDate)
	dueDate, _ := time.Parse("2006-01-02", payload.DueDate)

	var items []models.SupplierInvoiceItem
	for _, it := range payload.Items {
		items = append(items, models.SupplierInvoiceItem{
			Description: it.Description,
			Qty:         it.Qty,
			Unit:        it.Unit,
			UnitPrice:   it.UnitPrice,
			Amount:      it.Amount,
		})
	}

	projectID, err := primitive.ObjectIDFromHex(payload.ProjectID)
	if err != nil {
		c.JSON(http.StatusBadRequest, gin.H{"error": "Invalid project ID"})
		return
	}
	invoice := models.SupplierInvoice{
		SupplierID:      supplierID,
		ProjectID:       projectID,
		InvoiceNo:       payload.InvoiceNo,
		InvoiceDate:     invDate,
		DeliveryNo:      payload.DeliveryNo,
		PurchaseOrderNo: payload.PurchaseOrderNo,
		DueDate:         dueDate,
		DeliveryAddress: payload.DeliveryAddress,
		Items:           items,
		TotalSales:      payload.TotalSales,
		VAT:             payload.VAT,
		GrandTotal:      payload.GrandTotal,
		CreatedAt:       time.Now(),
		CreatedBy:       authUser.ID,
	}

	collection := db.Collection("supplierinvoice")
	_, err = collection.InsertOne(c, invoice)
	if err != nil {
		c.JSON(http.StatusInternalServerError, gin.H{"error": "Failed to create invoice"})
		return
	}

	c.JSON(http.StatusOK, gin.H{"message": "Supplier Invoice created"})
}

func GetAllSupplierInvoices(c *gin.Context, db *mongo.Database) {

	_, exists := c.Get("user")
	if !exists {
		c.JSON(http.StatusUnauthorized, gin.H{"error": "User not found"})
		return
	}

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

	collection := db.Collection("supplierinvoice")

	pipeline := mongo.Pipeline{

		// 🔹 Join Project
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
					"_id":               1,
					"supplier_id":       1,
					"project_id":        1,
					"invoice_no":        1,
					"invoice_date":      1,
					"delivery_no":       1,
					"purchase_order_no": 1,
					"due_date":          1,
					"delivery_address":  1,
					"items":             1,
					"total_sales":       1,
					"vat":               1,
					"grand_total":       1,
					"created_at":        1,
					"created_by":        1,

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
		c.JSON(http.StatusInternalServerError, gin.H{"error": "Failed to fetch invoices"})
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
		c.JSON(http.StatusInternalServerError, gin.H{"error": "Failed to decode invoices"})
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

func GetSupplierInvoiceByID(c *gin.Context, db *mongo.Database) {
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

	var invoice models.SupplierInvoice
	collection := db.Collection("supplierinvoice")

	err = collection.FindOne(c, bson.M{"_id": objID}).Decode(&invoice)
	if err != nil {
		c.JSON(http.StatusNotFound, gin.H{"error": "Invoice not found"})
		return
	}

	c.JSON(http.StatusOK, gin.H{"invoice": invoice})
}

func EditSupplierInvoice(c *gin.Context, db *mongo.Database) {
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
	var payload config.EditSupplierInvoice
	if err := c.ShouldBindJSON(&payload); err != nil {
		c.JSON(http.StatusBadRequest, gin.H{"error": "Invalid payload"})
		return
	}

	objID, _ := primitive.ObjectIDFromHex(payload.ID)
	supplierID, _ := primitive.ObjectIDFromHex(payload.SupplierID)

	invDate, _ := time.Parse("2006-01-02", payload.InvoiceDate)
	dueDate, _ := time.Parse("2006-01-02", payload.DueDate)

	var items []models.SupplierInvoiceItem
	for _, it := range payload.Items {
		items = append(items, models.SupplierInvoiceItem{
			Description: it.Description,
			Qty:         it.Qty,
			Unit:        it.Unit,
			UnitPrice:   it.UnitPrice,
			Amount:      it.Amount,
		})
	}

	update := bson.M{
		"$set": bson.M{
			"supplier_id":       supplierID,
			"project_id":        payload.ProjectID,
			"invoice_no":        payload.InvoiceNo,
			"invoice_date":      invDate,
			"delivery_no":       payload.DeliveryNo,
			"purchase_order_no": payload.PurchaseOrderNo,
			"due_date":          dueDate,
			"delivery_address":  payload.DeliveryAddress,
			"items":             items,
			"total_sales":       payload.TotalSales,
			"vat":               payload.VAT,
			"grand_total":       payload.GrandTotal,
		},
	}
	collection := db.Collection("supplierinvoice")

	_, err := collection.UpdateOne(c, bson.M{"_id": objID}, update)
	if err != nil {
		c.JSON(http.StatusInternalServerError, gin.H{"error": "Failed to update invoice"})
		return
	}

	c.JSON(http.StatusOK, gin.H{"message": "Supplier Invoice updated"})
}

func DeleteSupplierInvoice(c *gin.Context, db *mongo.Database) {
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

	_, err := db.Collection("supplierinvoice").DeleteOne(c, bson.M{"_id": objID})
	if err != nil {
		c.JSON(http.StatusInternalServerError, gin.H{"error": "Failed to delete invoice"})
		return
	}

	c.JSON(http.StatusOK, gin.H{"message": "Invoice deleted"})
}

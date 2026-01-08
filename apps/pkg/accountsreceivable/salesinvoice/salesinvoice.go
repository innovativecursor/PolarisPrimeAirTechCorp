package salesinvoice

import (
	"context"
	"net/http"
	"strconv"
	"time"

	"github.com/gin-gonic/gin"
	"github.com/innovativecursor/PolarisPrimeAirTechCorp/apps/pkg/accountsreceivable/config"
	"github.com/innovativecursor/PolarisPrimeAirTechCorp/apps/pkg/models"
	"go.mongodb.org/mongo-driver/bson"
	"go.mongodb.org/mongo-driver/bson/primitive"
	"go.mongodb.org/mongo-driver/mongo"
)

func GetCustomerByProjectID(c *gin.Context, db *mongo.Database) {
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

	projectID := c.Param("id")
	objID, err := primitive.ObjectIDFromHex(projectID)
	if err != nil {
		c.JSON(http.StatusBadRequest, gin.H{"error": "Invalid project ID"})
		return
	}

	var project models.Project
	err = db.Collection("project").
		FindOne(c, bson.M{"_id": objID}).
		Decode(&project)

	if err != nil {
		c.JSON(http.StatusNotFound, gin.H{"error": "Project not found"})
		return
	}

	var customer models.Customer
	err = db.Collection("customer").
		FindOne(c, bson.M{"_id": project.CustomerID}).
		Decode(&customer)

	if err != nil {
		c.JSON(http.StatusNotFound, gin.H{"error": "Customer not found"})
		return
	}

	c.JSON(http.StatusOK, gin.H{
		"project":  project,
		"customer": customer,
	})
}

func GetInvoiceDetailsByProjectID(c *gin.Context, db *mongo.Database) {
	user, exists := c.Get("user")
	if !exists {
		c.JSON(http.StatusUnauthorized, gin.H{"error": "User not found"})
		return
	}
	if _, ok := user.(*models.User); !ok {
		c.JSON(http.StatusUnauthorized, gin.H{"error": "Invalid user"})
		return
	}

	projectID := c.Param("id")
	objID, err := primitive.ObjectIDFromHex(projectID)
	if err != nil {
		c.JSON(http.StatusBadRequest, gin.H{"error": "Invalid project ID"})
		return
	}

	ctx, cancel := context.WithTimeout(context.Background(), 10*time.Second)
	defer cancel()

	collection := db.Collection("sales_invoices")

	pipeline := mongo.Pipeline{

		{{Key: "$match", Value: bson.M{
			"project_id": objID,
		}}},

		{{Key: "$lookup", Value: bson.M{
			"from":         "salesorder",
			"localField":   "sales_order_id",
			"foreignField": "_id",
			"as":           "salesOrder",
		}}},
		{{Key: "$unwind", Value: "$salesOrder"}},

		{{Key: "$lookup", Value: bson.M{
			"from":         "project",
			"localField":   "project_id",
			"foreignField": "_id",
			"as":           "project",
		}}},
		{{Key: "$unwind", Value: "$project"}},

		{{Key: "$lookup", Value: bson.M{
			"from":         "customer",
			"localField":   "project.customer_id",
			"foreignField": "_id",
			"as":           "customer",
		}}},
		{{Key: "$unwind", Value: "$customer"}},

		{{Key: "$project", Value: bson.M{
			"_id": 0,

			"invoice_id":     "$invoice_id",
			"sales_order_id": "$salesOrder.salesOrderId",
			"customer_name":  "$customer.customername",
			"created_at":     "$created_at",

			"invoice_mongo_id":     "$_id",
			"sales_order_mongo_id": "$salesOrder._id",
			"project_mongo_id":     "$project._id",
			"customer_mongo_id":    "$customer._id",
		}}},
	}

	cursor, err := collection.Aggregate(ctx, pipeline)
	if err != nil {
		c.JSON(http.StatusInternalServerError, gin.H{"error": err.Error()})
		return
	}
	defer cursor.Close(ctx)

	var result []bson.M
	if err := cursor.All(ctx, &result); err != nil {
		c.JSON(http.StatusInternalServerError, gin.H{"error": err.Error()})
		return
	}

	if len(result) == 0 {
		c.JSON(http.StatusNotFound, gin.H{"error": "Invoice not found"})
		return
	}

	c.JSON(http.StatusOK, result[0])

}

func CreateSalesInvoice(c *gin.Context, db *mongo.Database) {
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

	var payload config.CreateInvoicePayload
	if err := c.ShouldBindJSON(&payload); err != nil {
		c.JSON(http.StatusBadRequest, gin.H{"error": err.Error()})
		return
	}

	// Convert string IDs to ObjectIDs
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
	salesOrderID, err := primitive.ObjectIDFromHex(payload.SalesOrderID)
	if err != nil {
		c.JSON(http.StatusBadRequest, gin.H{"error": "Invalid sales order ID"})
		return
	}

	// Prepare invoice items
	items := []models.InvoiceItemSales{}
	total := 0.0

	collectionInventory := db.Collection("polaris_inventory")

	for _, pItem := range payload.Items {
		var inv models.PolarisInventory
		err := collectionInventory.FindOne(context.Background(), bson.M{"sku": pItem.SKU}).Decode(&inv)
		if err != nil {
			c.JSON(http.StatusBadRequest, gin.H{"error": "SKU not found", "sku": pItem.SKU})
			return
		}

		amount := float64(pItem.Quantity) * inv.Price

		items = append(items, models.InvoiceItemSales{
			SKU:       inv.SKU,
			Quantity:  pItem.Quantity,
			UnitPrice: inv.Price,
			Amount:    amount,
		})

		total += amount
	}

	invoice := models.SalesInvoice{
		InvoiceID:    "INV-" + time.Now().Format("20060102150405"),
		ProjectID:    projectID,
		CustomerID:   customerID,
		SalesOrderID: salesOrderID,
		Items:        items,
		TotalAmount:  total,
		CreatedAt:    time.Now(),
		UpdatedAt:    time.Now(),
	}

	collectionInvoices := db.Collection("sales_invoices")
	_, err = collectionInvoices.InsertOne(context.Background(), invoice)
	if err != nil {
		c.JSON(http.StatusInternalServerError, gin.H{"error": "Failed to create invoice"})
		return
	}

	c.JSON(http.StatusCreated, gin.H{
		"message": "Sales invoice created successfully",
		"data":    invoice,
	})
}

type SalesInvoiceListResponse struct {
	ID           primitive.ObjectID `bson:"_id" json:"id"`
	InvoiceID    string             `bson:"invoice_id" json:"invoice_id"`
	SalesOrderID string             `bson:"sales_order_id,omitempty" json:"sales_order_id,omitempty"`
	Total        float64            `bson:"total_amount" json:"total_amount"`
	CreatedAt    time.Time          `bson:"created_at" json:"created_at"`

	Project struct {
		ID   primitive.ObjectID `bson:"id" json:"id"`
		Name string             `bson:"name" json:"name"`
	} `bson:"project" json:"project"`

	Customer struct {
		ID   primitive.ObjectID `bson:"id" json:"id"`
		Name string             `bson:"name" json:"name"`
	} `bson:"customer" json:"customer"`
}

func GetAllSalesInvoices(c *gin.Context, db *mongo.Database) {

	// Auth
	user, exists := c.Get("user")
	if !exists {
		c.JSON(http.StatusUnauthorized, gin.H{"error": "User not found"})
		return
	}
	if _, ok := user.(*models.User); !ok {
		c.JSON(http.StatusUnauthorized, gin.H{"error": "Invalid user"})
		return
	}

	// Pagination
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
	collection := db.Collection("sales_invoices")

	pipeline := mongo.Pipeline{

		// Sort newest first
		{{Key: "$sort", Value: bson.M{"created_at": -1}}},

		// Pagination
		{{Key: "$skip", Value: skip}},
		{{Key: "$limit", Value: limit}},

		// Lookup Project
		{{
			Key: "$lookup",
			Value: bson.M{
				"from":         "project",
				"localField":   "project_id",
				"foreignField": "_id",
				"as":           "project",
			},
		}},
		{{Key: "$unwind", Value: bson.M{
			"path":                       "$project",
			"preserveNullAndEmptyArrays": true,
		}}},

		// Lookup Customer
		{{
			Key: "$lookup",
			Value: bson.M{
				"from":         "customer",
				"localField":   "customer_id",
				"foreignField": "_id",
				"as":           "customer",
			},
		}},
		{{Key: "$unwind", Value: bson.M{
			"path":                       "$customer",
			"preserveNullAndEmptyArrays": true,
		}}},

		// 🔹 Lookup Sales Order (ONLY SalesOrderID)
		{{
			Key: "$lookup",
			Value: bson.M{
				"from":         "salesorder",
				"localField":   "sales_order_id",
				"foreignField": "_id",
				"as":           "salesOrder",
			},
		}},
		{{Key: "$unwind", Value: bson.M{
			"path":                       "$salesOrder",
			"preserveNullAndEmptyArrays": true,
		}}},

		// Shape response
		{{
			Key: "$project",
			Value: bson.M{
				"_id":            1,
				"invoice_id":     1,
				"sales_order_id": "$salesOrder.salesOrderId",
				"total_amount":   1,
				"created_at":     1,

				"project": bson.M{
					"id":   "$project._id",
					"name": "$project.project_name",
				},

				"customer": bson.M{
					"id":   "$customer._id",
					"name": "$customer.customername",
				},
			},
		}},
	}

	cursor, err := collection.Aggregate(c, pipeline)
	if err != nil {
		c.JSON(http.StatusInternalServerError, gin.H{"error": "Failed to fetch invoices"})
		return
	}
	defer cursor.Close(c)

	var invoices []SalesInvoiceListResponse
	if err := cursor.All(c, &invoices); err != nil {
		c.JSON(http.StatusInternalServerError, gin.H{"error": "Failed to decode invoices"})
		return
	}

	total, _ := collection.CountDocuments(c, bson.M{})

	c.JSON(http.StatusOK, gin.H{
		"data":  invoices,
		"page":  page,
		"limit": limit,
		"total": total,
	})
}

func GetSalesInvoiceByID(c *gin.Context, db *mongo.Database) {
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

	invoiceID := c.Param("id")
	objID, err := primitive.ObjectIDFromHex(invoiceID)
	if err != nil {
		c.JSON(http.StatusBadRequest, gin.H{"error": "Invalid invoice ID"})
		return
	}

	var invoice models.SalesInvoice
	err = db.Collection("sales_invoices").
		FindOne(context.Background(), bson.M{"_id": objID}).
		Decode(&invoice)

	if err != nil {
		c.JSON(http.StatusNotFound, gin.H{"error": "Invoice not found"})
		return
	}

	c.JSON(http.StatusOK, gin.H{"data": invoice})
}

func UpdateSalesInvoice(c *gin.Context, db *mongo.Database) {
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

	invoiceID := c.Param("id")
	objID, err := primitive.ObjectIDFromHex(invoiceID)
	if err != nil {
		c.JSON(http.StatusBadRequest, gin.H{"error": "Invalid invoice ID"})
		return
	}

	var payload config.CreateInvoicePayload
	if err := c.ShouldBindJSON(&payload); err != nil {
		c.JSON(http.StatusBadRequest, gin.H{"error": err.Error()})
		return
	}

	// Prepare recalculated items
	items := []models.InvoiceItemSales{}
	total := 0.0

	collectionInventory := db.Collection("polaris_inventory")

	for _, pItem := range payload.Items {
		var inv models.PolarisInventory
		err := collectionInventory.FindOne(context.Background(), bson.M{"sku": pItem.SKU}).Decode(&inv)
		if err != nil {
			c.JSON(http.StatusBadRequest, gin.H{"error": "SKU not found", "sku": pItem.SKU})
			return
		}

		amount := float64(pItem.Quantity) * inv.Price

		items = append(items, models.InvoiceItemSales{
			SKU:       inv.SKU,
			Quantity:  pItem.Quantity,
			UnitPrice: inv.Price,
			Amount:    amount,
		})

		total += amount
	}

	update := bson.M{
		"$set": bson.M{
			"items":        items,
			"total_amount": total,
			"updated_at":   time.Now(),
		},
	}

	_, err = db.Collection("sales_invoices").
		UpdateOne(context.Background(), bson.M{"_id": objID}, update)

	if err != nil {
		c.JSON(http.StatusInternalServerError, gin.H{"error": "Failed to update invoice"})
		return
	}

	c.JSON(http.StatusOK, gin.H{"message": "Invoice updated successfully"})
}

func DeleteSalesInvoice(c *gin.Context, db *mongo.Database) {
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

	invoiceID := c.Param("id")
	objID, err := primitive.ObjectIDFromHex(invoiceID)
	if err != nil {
		c.JSON(http.StatusBadRequest, gin.H{"error": "Invalid invoice ID"})
		return
	}

	_, err = db.Collection("sales_invoices").
		DeleteOne(context.Background(), bson.M{"_id": objID})

	if err != nil {
		c.JSON(http.StatusInternalServerError, gin.H{"error": "Failed to delete invoice"})
		return
	}

	c.JSON(http.StatusOK, gin.H{"message": "Invoice deleted successfully"})
}

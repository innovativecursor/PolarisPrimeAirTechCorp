package project

import (
	"fmt"
	"net/http"
	"strconv"
	"time"

	"github.com/gin-gonic/gin"
	"github.com/innovativecursor/PolarisPrimeAirTechCorp/apps/pkg/models"
	"github.com/innovativecursor/PolarisPrimeAirTechCorp/apps/pkg/project/config"
	"go.mongodb.org/mongo-driver/bson"
	"go.mongodb.org/mongo-driver/bson/primitive"
	"go.mongodb.org/mongo-driver/mongo"
)

func GetCustomerDetails(c *gin.Context, db *mongo.Database) {
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
	customerID := c.Param("id")

	objID, err := primitive.ObjectIDFromHex(customerID)
	if err != nil {
		c.JSON(http.StatusBadRequest, gin.H{"error": "Invalid customer ID"})
		return
	}

	var customer models.Customer
	col := db.Collection("customer")

	err = col.FindOne(c, bson.M{"_id": objID}).Decode(&customer)
	if err != nil {
		c.JSON(http.StatusNotFound, gin.H{"error": "Customer not found"})
		return
	}

	c.JSON(http.StatusOK, gin.H{
		"customer_id":           customer.ID.Hex(),
		"customer_name":         customer.CustomerName,
		"customer_organization": customer.CustomerOrg,
		"customer_address":      customer.Address,
	})
}

func CreateProject(c *gin.Context, db *mongo.Database) {

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

	var projectdata config.CreateProjectRequest
	if err := c.ShouldBindJSON(&projectdata); err != nil {
		c.JSON(http.StatusBadRequest, gin.H{"error": "Invalid payload"})
		return
	}

	customerObjID, err := primitive.ObjectIDFromHex(projectdata.CustomerID)
	if err != nil {
		c.JSON(http.StatusBadRequest, gin.H{"error": "Invalid customerID"})
		return
	}

	// Auto-generate PRJ-XXXX
	projectCode := fmt.Sprintf("PRJ-%d", time.Now().Unix()%10000)

	now := time.Now().Unix()

	project := models.Project{
		ID:          primitive.NewObjectID(),
		ProjectName: projectdata.ProjectName,
		CustomerID:  customerObjID,
		Notes:       projectdata.Notes,
		ProjectID:   projectCode,
		CreatedAt:   now,
		UpdatedAt:   now,
	}

	// Insert to DB
	_, err = db.Collection("project").InsertOne(c, project)
	if err != nil {
		c.JSON(http.StatusInternalServerError, gin.H{"error": "Failed to create project"})
		return
	}

	c.JSON(http.StatusOK, gin.H{
		"message": "Project created successfully",
		"project": project,
	})
}

func GetProjectFullDetails(c *gin.Context, db *mongo.Database) {
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
	// Get Project Mongo ObjectID from URL
	projectID := c.Param("projectID")
	if projectID == "" {
		c.JSON(http.StatusBadRequest, gin.H{"error": "projectID is required"})
		return
	}

	// Convert to ObjectID
	projectObjID, err := primitive.ObjectIDFromHex(projectID)
	if err != nil {
		c.JSON(http.StatusBadRequest, gin.H{"error": "Invalid projectID format"})
		return
	}

	var project models.Project
	err = db.Collection("project").FindOne(c, bson.M{"_id": projectObjID}).Decode(&project)
	if err != nil {
		c.JSON(http.StatusNotFound, gin.H{"error": "Project not found"})
		return
	}

	var salesOrders []models.SalesOrder
	cursor, _ := db.Collection("salesorder").Find(c, bson.M{"projectId": projectObjID})
	cursor.All(c, &salesOrders)

	var supplierPO []models.SupplierPO
	cursor, _ = db.Collection("supplier_purchase_orders").Find(c, bson.M{"projectId": projectObjID})
	cursor.All(c, &supplierPO)

	var deliveryReceipts []models.SupplierDeliveryReceipt
	cursor, _ = db.Collection("supplierdeliveryreceipt").Find(c, bson.M{"project_id": projectObjID})
	cursor.All(c, &deliveryReceipts)

	var supplierInvoices []models.SupplierInvoice
	cursor, _ = db.Collection("supplierinvoice").Find(c, bson.M{"project_id": projectObjID})
	cursor.All(c, &supplierInvoices)

	var suppliers []models.Supplier
	cursor, _ = db.Collection("supplier").Find(c, bson.M{"project_id": projectObjID})
	cursor.All(c, &suppliers)

	var salesInvoices []models.SalesInvoice
	cursor, _ = db.Collection("sales_invoices").Find(c, bson.M{"project_id": projectObjID})
	cursor.All(c, &salesInvoices)

	var customerDR []models.DeliveryReceipt
	cursor, _ = db.Collection("delivery_receipts").Find(c, bson.M{"project_id": projectObjID})
	cursor.All(c, &customerDR)

	// Final Response
	c.JSON(http.StatusOK, gin.H{
		"project":           project,
		"sales_orders":      salesOrders,
		"supplier_po":       supplierPO,
		"supplier_dr":       deliveryReceipts,
		"supplier_invoices": supplierInvoices,
		"suppliers":         suppliers,
		"sales_invoices":    salesInvoices,
		"delivery_receipts": customerDR,
	})
}

type ProjectListResponse struct {
	ID          primitive.ObjectID `bson:"_id" json:"id"`
	ProjectID   string             `bson:"project_id" json:"project_id"`
	ProjectName string             `bson:"project_name" json:"project_name"`
	CreatedAt   int64              `bson:"created_at" json:"created_at"`

	Customer struct {
		ID   primitive.ObjectID `bson:"id" json:"id"`
		Name string             `bson:"name" json:"name"`
		Org  string             `bson:"organization" json:"organization"`
	} `bson:"customer" json:"customer"`
}

func GetAllProjects(c *gin.Context, db *mongo.Database) {

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

	// Pagination (same as PO)
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

	collection := db.Collection("project")

	pipeline := mongo.Pipeline{
		// Sort
		{{Key: "$sort", Value: bson.M{"created_at": -1}}},

		// Pagination
		{{Key: "$skip", Value: skip}},
		{{Key: "$limit", Value: limit}},

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

		// Shape final response
		{{
			Key: "$project",
			Value: bson.M{
				"_id":          1,
				"project_id":   1,
				"project_name": 1,
				"created_at":   1,

				"customer": bson.M{
					"id":           "$customer._id",
					"name":         "$customer.customername",
					"organization": "$customer.customerorg",
				},
			},
		}},
	}

	cursor, err := collection.Aggregate(c, pipeline)
	if err != nil {
		c.JSON(http.StatusInternalServerError, gin.H{"error": "Failed to fetch projects"})
		return
	}
	defer cursor.Close(c)

	var projects []ProjectListResponse
	if err := cursor.All(c, &projects); err != nil {
		c.JSON(http.StatusInternalServerError, gin.H{"error": "Failed to decode projects"})
		return
	}

	total, _ := collection.CountDocuments(c, bson.M{})

	c.JSON(http.StatusOK, gin.H{
		"data":  projects,
		"page":  page,
		"limit": limit,
		"total": total,
	})
}

func UpdateProject(c *gin.Context, db *mongo.Database) {

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
	if projectID == "" {
		c.JSON(http.StatusBadRequest, gin.H{"error": "project ID is required"})
		return
	}

	// Convert to ObjectID
	projectObjID, err := primitive.ObjectIDFromHex(projectID)
	if err != nil {
		c.JSON(http.StatusBadRequest, gin.H{"error": "Invalid project ID"})
		return
	}

	var req config.UpdateProjectRequest
	if err := c.ShouldBindJSON(&req); err != nil {
		c.JSON(http.StatusBadRequest, gin.H{"error": "Invalid payload"})
		return
	}

	// Convert customer ID → ObjectID
	custObjID, err := primitive.ObjectIDFromHex(req.CustomerID)
	if err != nil {
		c.JSON(http.StatusBadRequest, gin.H{"error": "Invalid customerID"})
		return
	}

	updateData := bson.M{
		"project_name": req.ProjectName,
		"customer_id":  custObjID,
		"notes":        req.Notes,
		"updatedAt":    time.Now().Unix(),
	}

	result, err := db.Collection("project").UpdateOne(
		c,
		bson.M{"_id": projectObjID},
		bson.M{"$set": updateData},
	)

	if err != nil {
		c.JSON(http.StatusInternalServerError, gin.H{"error": "Failed to update project"})
		return
	}

	if result.MatchedCount == 0 {
		c.JSON(http.StatusNotFound, gin.H{"error": "Project not found"})
		return
	}

	c.JSON(http.StatusOK, gin.H{
		"message":        "Project updated successfully",
		"updated_fields": updateData,
	})
}

func DeleteProject(c *gin.Context, db *mongo.Database) {

	// Auth check
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
	if projectID == "" {
		c.JSON(http.StatusBadRequest, gin.H{"error": "project ID is required"})
		return
	}

	// Convert --> ObjectID
	projectObjID, err := primitive.ObjectIDFromHex(projectID)
	if err != nil {
		c.JSON(http.StatusBadRequest, gin.H{"error": "Invalid project ID"})
		return
	}

	// Delete from DB
	result, err := db.Collection("project").DeleteOne(c, bson.M{"_id": projectObjID})
	if err != nil {
		c.JSON(http.StatusInternalServerError, gin.H{"error": "Failed to delete project"})
		return
	}

	if result.DeletedCount == 0 {
		c.JSON(http.StatusNotFound, gin.H{"error": "Project not found"})
		return
	}

	c.JSON(http.StatusOK, gin.H{
		"message":    "Project deleted successfully",
		"project_id": projectID,
	})
}

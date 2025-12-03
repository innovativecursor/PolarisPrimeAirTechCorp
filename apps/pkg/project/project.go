package project

import (
	"fmt"
	"net/http"
	"time"

	"github.com/gin-gonic/gin"
	"github.com/innovativecursor/PolarisPrimeAirTechCorp/apps/pkg/models"
	"github.com/innovativecursor/PolarisPrimeAirTechCorp/apps/pkg/project/config"
	"go.mongodb.org/mongo-driver/bson"
	"go.mongodb.org/mongo-driver/bson/primitive"
	"go.mongodb.org/mongo-driver/mongo"
	"go.mongodb.org/mongo-driver/mongo/options"
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

	var projectdata config.ProjectRequest
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
		ID:                   primitive.NewObjectID(),
		ProjectName:          projectdata.ProjectName,
		CustomerID:           customerObjID,
		AddressCustomer:      projectdata.CustomerAddress,
		CustomerOrganization: projectdata.CustomerOrganization,
		Notes:                projectdata.Notes,
		ProjectID:            projectCode,
		CreatedAt:            now,
		UpdatedAt:            now,
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

func GetAllProjects(c *gin.Context, db *mongo.Database) {

	// Auth
	user, exists := c.Get("user")
	if !exists {
		c.JSON(http.StatusUnauthorized, gin.H{"error": "User not found"})
		return
	}
	_, ok := user.(*models.User)
	if !ok {
		c.JSON(http.StatusUnauthorized, gin.H{"error": "Invalid user"})
		return
	}

	// Sort by latest created_at
	findOptions := options.Find().SetSort(bson.M{"created_at": -1})

	cursor, err := db.Collection("project").Find(c, bson.M{}, findOptions)
	if err != nil {
		c.JSON(http.StatusInternalServerError, gin.H{"error": "Failed to fetch projects"})
		return
	}

	var projects []models.Project
	if err := cursor.All(c, &projects); err != nil {
		c.JSON(http.StatusInternalServerError, gin.H{"error": "Failed to decode projects"})
		return
	}

	c.JSON(http.StatusOK, gin.H{
		"total":    len(projects),
		"projects": projects,
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

	var req config.ProjectRequest
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
		"project_name":          req.ProjectName,
		"customer_id":           custObjID,
		"customer_organization": req.CustomerOrganization,
		"address_customer":      req.CustomerAddress,
		"notes":                 req.Notes,
		"updatedAt":             time.Now().Unix(),
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

package project

import (
	"context"
	"net/http"
	"time"

	"github.com/gin-gonic/gin"
	"github.com/innovativecursor/PolarisPrimeAirTechCorp/apps/pkg/models"
	"github.com/innovativecursor/PolarisPrimeAirTechCorp/apps/pkg/project/config"
	"go.mongodb.org/mongo-driver/bson"
	"go.mongodb.org/mongo-driver/bson/primitive"
	"go.mongodb.org/mongo-driver/mongo"
)

// Create and inserts a new Project document into MongoDB.
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
	var req config.ProjectRequest

	// Bind and validate the JSON payload
	if err := c.ShouldBindJSON(&req); err != nil {
		c.JSON(http.StatusBadRequest, gin.H{"error": err.Error()})
		return
	}

	// Build the project document to store in DB
	project := models.Project{
		ID:                   primitive.NewObjectID(),
		ProjectName:          req.ProjectName,
		CustomerID:           req.CustomerID,
		AddressID:            req.AddressID,
		CustomerOrganization: req.CustomerOrganization,
		//QuotationID:          req.QuotationID,
		//IsQuotationApproved:  req.IsQuotationApproved,
		CreatedAt: time.Now().Unix(),
		UpdatedAt: time.Now().Unix(),
	}

	projectCol := db.Collection("project")
	// Insert project into MongoDB
	_, err := projectCol.InsertOne(context.TODO(), project)
	if err != nil {
		c.JSON(http.StatusInternalServerError, gin.H{"error": "Failed to create project"})
		return
	}

	c.JSON(http.StatusOK, gin.H{
		"message": "Project created successfully",
		"project": project,
	})
}

// GetAllProjects retrieves all project records from the database
// and returns them as a JSON array.
func GetAllProjects(c *gin.Context, db *mongo.Database) {
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

	projectCol := db.Collection("project")
	cursor, err := projectCol.Find(context.TODO(), bson.M{})
	if err != nil {
		c.JSON(http.StatusInternalServerError, gin.H{"error": "Failed to fetch projects"})
		return
	}
	defer cursor.Close(context.TODO())

	var projects []models.Project
	if err := cursor.All(context.TODO(), &projects); err != nil {
		c.JSON(http.StatusInternalServerError, gin.H{"error": err.Error()})
		return
	}

	c.JSON(http.StatusOK, gin.H{"data": projects})
}

// GetProjectByID retrieves a single project record based on its ID.
// If the ID is invalid or the project does not exist, an error is returned.
func GetProjectByID(c *gin.Context, db *mongo.Database) {
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

	// Convert the string ID into a MongoDB ObjectID
	objID, err := primitive.ObjectIDFromHex(id)
	if err != nil {
		c.JSON(http.StatusBadRequest, gin.H{"error": "Invalid project ID"})
		return
	}
	projectCol := db.Collection("project")

	var project models.Project
	err = projectCol.FindOne(context.TODO(), bson.M{"_id": objID}).Decode(&project)
	if err != nil {
		c.JSON(http.StatusNotFound, gin.H{"error": "Project not found"})
		return
	}

	c.JSON(http.StatusOK, gin.H{"data": project})
}

// UpdateProject updates an existing project document in the database.
// It supports partial updates using the fields provided in the payload.
// func UpdateProject(c *gin.Context, db *mongo.Database) {
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
// 	id := c.Param("id")

// 	// Convert the string ID to ObjectID
// 	objID, err := primitive.ObjectIDFromHex(id)
// 	if err != nil {
// 		c.JSON(http.StatusBadRequest, gin.H{"error": "Invalid project ID"})
// 		return
// 	}

// 	var req config.UpdateProjectRequest

// 	// Bind and validate the incoming JSON payload
// 	if err := c.ShouldBindJSON(&req); err != nil {
// 		c.JSON(http.StatusBadRequest, gin.H{"error": err.Error()})
// 		return
// 	}

// 	projectCol := db.Collection("project")
// 	// Build the update document with the provided fields
// 	update := bson.M{
// 		"$set": bson.M{
// 			"project_name":          req.ProjectName,
// 			"customer_id":           req.CustomerID,
// 			"address_id":            req.AddressID,
// 			"customer_organization": req.CustomerOrganization,
// 			"quotation_id":          req.QuotationID,
// 			"is_quotation_approved": req.IsQuotationApproved,
// 			"supplier_ids":          req.SupplierIDs,
// 			"sku_ids":               req.SkuIDs,
// 			"supplier_po_ids":       req.SupplierPOIDs,
// 			"customer_po_id":        req.CustomerPOID,
// 			"supplier_receipt_id":   req.SupplierReceiptID,
// 			"sales_invoice_id":      req.SalesInvoiceID,
// 			"updated_at":            time.Now().Unix(),
// 		},
// 	}

// 	// Update the project document
// 	_, err = projectCol.UpdateOne(context.TODO(), bson.M{"_id": objID}, update)
// 	if err != nil {
// 		c.JSON(http.StatusInternalServerError, gin.H{"error": "Failed to update project"})
// 		return
// 	}

// 	c.JSON(http.StatusOK, gin.H{"message": "Project updated successfully"})
// }

// DeleteProject removes a project record from the database
// based on the provided project ID.
func DeleteProject(c *gin.Context, db *mongo.Database) {
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

	// Convert string ID to ObjectID
	objID, err := primitive.ObjectIDFromHex(id)
	if err != nil {
		c.JSON(http.StatusBadRequest, gin.H{"error": "Invalid project ID"})
		return
	}

	projectCol := db.Collection("project")

	// Delete the project document
	_, err = projectCol.DeleteOne(context.TODO(), bson.M{"_id": objID})
	if err != nil {
		c.JSON(http.StatusInternalServerError, gin.H{"error": "Failed to delete project"})
		return
	}

	c.JSON(http.StatusOK, gin.H{"message": "Project deleted successfully"})
}

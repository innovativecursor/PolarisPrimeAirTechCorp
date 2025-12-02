package report

import (
	"net/http"
	"time"

	"github.com/gin-gonic/gin"
	"github.com/innovativecursor/PolarisPrimeAirTechCorp/apps/pkg/helper/reporthelper"
	"github.com/innovativecursor/PolarisPrimeAirTechCorp/apps/pkg/models"
	"github.com/innovativecursor/PolarisPrimeAirTechCorp/apps/pkg/report/config"
	"go.mongodb.org/mongo-driver/bson"
	"go.mongodb.org/mongo-driver/mongo"
)

func GenerateReport(c *gin.Context, db *mongo.Database) {
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

	var req config.ReportRequest
	if err := c.ShouldBindJSON(&req); err != nil {
		c.JSON(http.StatusBadRequest, gin.H{"error": "Invalid request", "details": err.Error()})
		return
	}

	start, _ := time.Parse("2006-01-02", req.StartDate)
	end, _ := time.Parse("2006-01-02", req.EndDate)
	end = end.Add(23*time.Hour + 59*time.Minute + 59*time.Second)

	switch req.ReportType {

	case "customer":
		GenerateCustomerReport(c, db, start, end, req.ExportType)

	case "inventory":
		GenerateInventoryReport(c, db, start, end, req.ExportType)

	default:
		c.JSON(http.StatusBadRequest, gin.H{"error": "Invalid report type"})
	}
}

func GenerateCustomerReport(c *gin.Context, db *mongo.Database, start, end time.Time, exportType string) {

	collection := db.Collection("customer")

	filter := bson.M{
		"createdat": bson.M{
			"$gte": start,
			"$lte": end,
		},
	}

	cursor, err := collection.Find(c, filter)
	if err != nil {
		c.JSON(http.StatusInternalServerError, gin.H{"error": "Failed to fetch customers"})
		return
	}

	var customers []models.Customer
	if err := cursor.All(c, &customers); err != nil {
		c.JSON(http.StatusInternalServerError, gin.H{"error": "Failed to parse customers"})
		return
	}

	switch exportType {
	case "csv":
		filePath, _ := reporthelper.GenerateCustomerCSV(customers)
		c.Header("Content-Type", "text/csv")
		c.Header("Content-Disposition", "attachment; filename=customer_report.csv")
		c.File(filePath)
		return

	case "excel":
		filePath, _ := reporthelper.GenerateCustomerExcel(customers)
		c.Header("Content-Type", "application/vnd.openxmlformats-officedocument.spreadsheetml.sheet")
		c.Header("Content-Disposition", "attachment; filename=customer_report.xlsx")
		c.File(filePath)
		return

	case "pdf":
		filePath, _ := reporthelper.GenerateCustomerPDF(customers, start, end)
		c.Header("Content-Type", "application/pdf")
		c.Header("Content-Disposition", "attachment; filename=customer_report.pdf")
		c.File(filePath)
		return

	default:
		c.JSON(http.StatusBadRequest, gin.H{"error": "Invalid export type"})
		return
	}

}

func GenerateInventoryReport(c *gin.Context, db *mongo.Database, start, end time.Time, exportType string) {

	collection := db.Collection("polaris_inventory")

	filter := bson.M{
		"created_at": bson.M{
			"$gte": start,
			"$lte": end,
		},
	}

	cursor, err := collection.Find(c, filter)
	if err != nil {
		c.JSON(http.StatusInternalServerError, gin.H{"error": "Failed to fetch inventory"})
		return
	}

	var items []models.PolarisInventory
	if err := cursor.All(c, &items); err != nil {
		c.JSON(http.StatusInternalServerError, gin.H{"error": "Failed to parse inventory"})
		return
	}

	switch exportType {

	case "csv":
		filePath, _ := reporthelper.GenerateInventoryCSV(items)
		c.Header("Content-Type", "text/csv")
		c.Header("Content-Disposition", "attachment; filename=inventory_report.csv")
		c.File(filePath)

	case "excel":
		filePath, _ := reporthelper.GenerateInventoryExcel(items)
		c.Header("Content-Type", "application/vnd.openxmlformats-officedocument.spreadsheetml.sheet")
		c.Header("Content-Disposition", "attachment; filename=inventory_report.xlsx")
		c.File(filePath)

	case "pdf":
		filePath, _ := reporthelper.GenerateInventoryPDF(items, start, end)
		c.Header("Content-Type", "application/pdf")
		c.Header("Content-Disposition", "attachment; filename=inventory_report.pdf")
		c.File(filePath)

	default:
		c.JSON(http.StatusBadRequest, gin.H{"error": "Invalid export type"})
	}
}

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
	case "supplier":
		GenerateSupplierReport(c, db, start, end, req.ExportType)
	case "sales":
		GenerateSalesInvoiceReport(c, db, start, end, req.ExportType)

	case "financial":
		GenerateFinancialReport(c, db, start, end, req.ExportType)

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

func GenerateSupplierReport(c *gin.Context, db *mongo.Database, start, end time.Time, exportType string) {

	collection := db.Collection("supplier")

	filter := bson.M{
		"created_at": bson.M{
			"$gte": start,
			"$lte": end,
		},
	}

	cursor, err := collection.Find(c, filter)
	if err != nil {
		c.JSON(http.StatusInternalServerError, gin.H{"error": "Failed to fetch suppliers"})
		return
	}

	var suppliers []models.Supplier
	if err := cursor.All(c, &suppliers); err != nil {
		c.JSON(http.StatusInternalServerError, gin.H{"error": "Failed to parse suppliers"})
		return
	}

	switch exportType {

	case "csv":
		filePath, _ := reporthelper.GenerateSupplierCSV(suppliers)
		c.Header("Content-Type", "text/csv")
		c.Header("Content-Disposition", "attachment; filename=supplier_report.csv")
		c.File(filePath)

	case "excel":
		filePath, _ := reporthelper.GenerateSupplierExcel(suppliers)
		c.Header("Content-Type", "application/vnd.openxmlformats-officedocument.spreadsheetml.sheet")
		c.Header("Content-Disposition", "attachment; filename=supplier_report.xlsx")
		c.File(filePath)

	case "pdf":
		filePath, _ := reporthelper.GenerateSupplierPDF(suppliers, start, end)
		c.Header("Content-Type", "application/pdf")
		c.Header("Content-Disposition", "attachment; filename=supplier_report.pdf")
		c.File(filePath)

	default:
		c.JSON(http.StatusBadRequest, gin.H{"error": "Invalid export type"})
	}
}

func GenerateSalesInvoiceReport(c *gin.Context, db *mongo.Database, start, end time.Time, exportType string) {

	collection := db.Collection("sales_invoices")

	filter := bson.M{
		"created_at": bson.M{
			"$gte": start,
			"$lte": end,
		},
	}

	cursor, err := collection.Find(c, filter)
	if err != nil {
		c.JSON(http.StatusInternalServerError, gin.H{"error": "Failed to fetch sales invoices"})
		return
	}

	var invoices []models.SalesInvoice
	if err := cursor.All(c, &invoices); err != nil {
		c.JSON(http.StatusInternalServerError, gin.H{"error": "Failed to parse invoices"})
		return
	}

	// Fetch related names
	var invoiceData []reporthelper.SalesInvoiceReportRow

	projectCol := db.Collection("project")
	customerCol := db.Collection("customer")

	for _, inv := range invoices {
		var project models.Project
		var customer models.Customer

		// Fetch Project
		_ = projectCol.FindOne(c, bson.M{"_id": inv.ProjectID}).Decode(&project)

		// Fetch Customer
		_ = customerCol.FindOne(c, bson.M{"_id": inv.CustomerID}).Decode(&customer)

		invoiceData = append(invoiceData, reporthelper.SalesInvoiceReportRow{
			InvoiceID:    inv.InvoiceID,
			ProjectName:  project.ProjectName,
			CustomerName: customer.CustomerName,
			TotalAmount:  inv.TotalAmount,
			CreatedAt:    inv.CreatedAt,
		})
	}

	switch exportType {
	case "csv":
		filePath, _ := reporthelper.GenerateSalesInvoiceCSV(invoiceData)
		c.Header("Content-Type", "text/csv")
		c.Header("Content-Disposition", "attachment; filename=sales_invoice_report.csv")
		c.File(filePath)

	case "excel":
		filePath, _ := reporthelper.GenerateSalesInvoiceExcel(invoiceData)
		c.Header("Content-Type", "application/vnd.openxmlformats-officedocument.spreadsheetml.sheet")
		c.Header("Content-Disposition", "attachment; filename=sales_invoice_report.xlsx")
		c.File(filePath)

	case "pdf":
		filePath, _ := reporthelper.GenerateSalesInvoicePDF(invoiceData, start, end)
		c.Header("Content-Type", "application/pdf")
		c.Header("Content-Disposition", "attachment; filename=sales_invoice_report.pdf")
		c.File(filePath)

	default:
		c.JSON(http.StatusBadRequest, gin.H{"error": "Invalid export type"})
	}
}

func GenerateFinancialReport(c *gin.Context, db *mongo.Database, start, end time.Time, exportType string) {

	supplierCol := db.Collection("supplierinvoice")
	salesCol := db.Collection("sales_invoices")
	projectCol := db.Collection("project")
	customerCol := db.Collection("customer")
	supplierMasterCol := db.Collection("supplier")

	// Final combined dataset
	var reportData []reporthelper.FinancialReportRow

	// -------------------------
	// 1. Supplier Invoices
	// -------------------------
	supCursor, err := supplierCol.Find(c, bson.M{
		"created_at": bson.M{"$gte": start, "$lte": end},
	})
	if err != nil {
		c.JSON(http.StatusInternalServerError, gin.H{"error": "Failed to fetch supplier invoices"})
		return
	}

	var supplierInvoices []models.SupplierInvoice
	_ = supCursor.All(c, &supplierInvoices)

	for _, inv := range supplierInvoices {
		// Fetch Project
		var project models.Project
		_ = projectCol.FindOne(c, bson.M{"_id": inv.ProjectID}).Decode(&project)

		// Fetch Supplier name
		var supplier models.Supplier
		_ = supplierMasterCol.FindOne(c, bson.M{"_id": inv.SupplierID}).Decode(&supplier)

		reportData = append(reportData, reporthelper.FinancialReportRow{
			Category:    "Purchase",
			InvoiceNo:   inv.InvoiceNo,
			ProjectName: project.ProjectName,
			EntityName:  supplier.SupplierName,
			Amount:      inv.GrandTotal,
			Date:        inv.InvoiceDate,
		})
	}

	// -------------------------
	// 2. Sales Invoices
	// -------------------------
	salesCursor, err := salesCol.Find(c, bson.M{
		"created_at": bson.M{"$gte": start, "$lte": end},
	})
	if err != nil {
		c.JSON(http.StatusInternalServerError, gin.H{"error": "Failed to fetch sales invoices"})
		return
	}

	var salesInvoices []models.SalesInvoice
	_ = salesCursor.All(c, &salesInvoices)

	for _, inv := range salesInvoices {
		// Fetch Project
		var project models.Project
		_ = projectCol.FindOne(c, bson.M{"_id": inv.ProjectID}).Decode(&project)

		// Fetch Customer
		var customer models.Customer
		_ = customerCol.FindOne(c, bson.M{"_id": inv.CustomerID}).Decode(&customer)

		reportData = append(reportData, reporthelper.FinancialReportRow{
			Category:    "Sales",
			InvoiceNo:   inv.InvoiceID,
			ProjectName: project.ProjectName,
			EntityName:  customer.CustomerName,
			Amount:      inv.TotalAmount,
			Date:        inv.CreatedAt,
		})
	}

	// Handle export
	switch exportType {

	case "csv":
		fp, _ := reporthelper.GenerateFinancialCSV(reportData)
		c.Header("Content-Type", "text/csv")
		c.Header("Content-Disposition", "attachment; filename=financial_report.csv")
		c.File(fp)

	case "excel":
		fp, _ := reporthelper.GenerateFinancialExcel(reportData)
		c.Header("Content-Type", "application/vnd.openxmlformats-officedocument.spreadsheetml.sheet")
		c.Header("Content-Disposition", "attachment; filename=financial_report.xlsx")
		c.File(fp)

	case "pdf":
		fp, _ := reporthelper.GenerateFinancialPDF(reportData, start, end)
		c.Header("Content-Type", "application/pdf")
		c.Header("Content-Disposition", "attachment; filename=financial_report.pdf")
		c.File(fp)

	default:
		c.JSON(http.StatusBadRequest, gin.H{"error": "Invalid export type"})
	}
}

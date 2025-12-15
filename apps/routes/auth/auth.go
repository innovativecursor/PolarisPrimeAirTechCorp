package auth

import (
	"log"
	"net/http"
	"os"

	"github.com/gin-gonic/gin"
	"github.com/innovativecursor/PolarisPrimeAirTechCorp/apps/pkg/accountsreceivable/deliveryreceipt"
	"github.com/innovativecursor/PolarisPrimeAirTechCorp/apps/pkg/accountsreceivable/salesinvoice"
	"github.com/innovativecursor/PolarisPrimeAirTechCorp/apps/pkg/auth/signin"
	"github.com/innovativecursor/PolarisPrimeAirTechCorp/apps/pkg/auth/signup"
	"github.com/innovativecursor/PolarisPrimeAirTechCorp/apps/pkg/customer"
	"github.com/innovativecursor/PolarisPrimeAirTechCorp/apps/pkg/dashboard"
	"github.com/innovativecursor/PolarisPrimeAirTechCorp/apps/pkg/middleware"
	"github.com/innovativecursor/PolarisPrimeAirTechCorp/apps/pkg/polarisinventory"
	"github.com/innovativecursor/PolarisPrimeAirTechCorp/apps/pkg/project"

	"github.com/innovativecursor/PolarisPrimeAirTechCorp/apps/pkg/report"
	"github.com/innovativecursor/PolarisPrimeAirTechCorp/apps/pkg/salesorder"
	"github.com/innovativecursor/PolarisPrimeAirTechCorp/apps/pkg/supplier"
	"github.com/innovativecursor/PolarisPrimeAirTechCorp/apps/pkg/supplierdr"
	"github.com/innovativecursor/PolarisPrimeAirTechCorp/apps/pkg/supplierinvoice"
	"github.com/innovativecursor/PolarisPrimeAirTechCorp/apps/pkg/supplierpo"
	"github.com/innovativecursor/PolarisPrimeAirTechCorp/apps/routes/getapiroutes"
	"go.mongodb.org/mongo-driver/mongo"
)

func Auth(db *mongo.Database) {
	port := os.Getenv("PORT")
	if port == "" {
		port = "10001"
		log.Printf("Defaulting to port %s", port)
	}

	apiV1, router := getapiroutes.GetApiRoutes()

	// Define health check endpoint for the auth service
	apiV1.GET("/auth", func(c *gin.Context) {
		c.String(http.StatusOK, "Auth Service Healthy")
	})

	// Define sign-up handler for email-based sign-up
	apiV1.POST("/auth/sign-up-email", func(c *gin.Context) {
		signup.SignUp(c, db)
	})

	apiV1.POST("/auth/sign-in-email", func(c *gin.Context) {
		signin.SignIn(c, db)
	})

	apiV1.GET("/auth/get-all-user", middleware.JWTMiddleware(db), func(c *gin.Context) {
		signup.GetAllUsers(c, db)
	})

	apiV1.GET("/auth/get-all-roles", middleware.JWTMiddleware(db), func(c *gin.Context) {
		signup.GetAllRoles(c, db)
	})

	apiV1.POST("/auth/create-roles", middleware.JWTMiddleware(db), func(c *gin.Context) {
		signup.CreateRole(c, db)
	})

	apiV1.POST("/auth/update-user-roles", middleware.JWTMiddleware(db), func(c *gin.Context) {
		signup.ApproveOrUpdateUser(c, db)
	})

	//project
	apiV1.GET("/project/get-customer-details/:id", middleware.JWTMiddleware(db), func(c *gin.Context) {
		project.GetCustomerDetails(c, db)
	})
	apiV1.POST("/project/create-project", middleware.JWTMiddleware(db), func(c *gin.Context) {
		project.CreateProject(c, db)
	})
	apiV1.GET("/project/get-all-project", middleware.JWTMiddleware(db), func(c *gin.Context) {
		project.GetAllProjects(c, db)
	})
	apiV1.GET("/project/get-project-by/:projectID", middleware.JWTMiddleware(db), func(c *gin.Context) {
		project.GetProjectFullDetails(c, db)
	})
	apiV1.PUT("/project/edit-project/:id", middleware.JWTMiddleware(db), func(c *gin.Context) {
		project.UpdateProject(c, db)
	})
	apiV1.DELETE("/project/delete-project/:id", middleware.JWTMiddleware(db), func(c *gin.Context) {
		project.DeleteProject(c, db)
	})

	//customer
	apiV1.POST("/customer/add-update-customer", middleware.JWTMiddleware(db), func(c *gin.Context) {
		customer.AddCustomer(c, db)
	})

	apiV1.GET("/customer/get-all-customer", middleware.JWTMiddleware(db), func(c *gin.Context) {
		customer.GetAllCustomers(c, db)
	})

	apiV1.DELETE("/customer/delete-customer", middleware.JWTMiddleware(db), func(c *gin.Context) {
		customer.DeleteCustomer(c, db)
	})

	// //quotation
	// apiV1.POST("/quotation/upsert", middleware.JWTMiddleware(db), func(c *gin.Context) {
	// 	quotation.UpsertQuotation(c, db)
	// })
	// apiV1.POST("/quotation/toggle-status", middleware.JWTMiddleware(db), func(c *gin.Context) {
	// 	quotation.ToggleQuotationStatus(c, db)
	// })
	// apiV1.GET("/quotation/customer-quotations/:customerId", middleware.JWTMiddleware(db), func(c *gin.Context) {
	// 	quotation.GetQuotationsByCustomer(c, db)
	// })
	// apiV1.GET("/quotation/get-quotation-by-id/:quotationId", middleware.JWTMiddleware(db), func(c *gin.Context) {
	// 	quotation.GetQuotationByID(c, db)
	// })
	// apiV1.DELETE("/quotation/delete-quotation/:quotationId", middleware.JWTMiddleware(db), func(c *gin.Context) {
	// 	quotation.DeleteQuotation(c, db)
	// })

	//Supplier Purchase order
	apiV1.POST("/supplierpo/add", middleware.JWTMiddleware(db), func(c *gin.Context) {
		supplierpo.AddSupplierPO(c, db)
	})

	apiV1.PUT("/supplierpo/update", middleware.JWTMiddleware(db), func(c *gin.Context) {
		supplierpo.UpdateSupplierPO(c, db)
	})

	apiV1.GET("/supplierpo/supplier/:supplierId", middleware.JWTMiddleware(db), func(c *gin.Context) {
		supplierpo.GetSupplierPOsBySupplier(c, db)
	})

	apiV1.GET("/supplierpo/:supplierPOId", middleware.JWTMiddleware(db), func(c *gin.Context) {
		supplierpo.GetSupplierPOByID(c, db)
	})

	apiV1.PUT("/supplierpo/status", middleware.JWTMiddleware(db), func(c *gin.Context) {
		supplierpo.ToggleSupplierPOStatus(c, db)
	})

	// Inventory
	apiV1.POST("/inventory/add", middleware.JWTMiddleware(db), func(c *gin.Context) {
		polarisinventory.AddInventory(c, db)
	})

	apiV1.GET("/inventory/get", middleware.JWTMiddleware(db), func(c *gin.Context) {
		polarisinventory.GetAllInventory(c, db)
	})

	apiV1.GET("/inventory/get-by/:id", middleware.JWTMiddleware(db), func(c *gin.Context) {
		polarisinventory.GetInventoryByID(c, db)
	})

	apiV1.PUT("/inventory/update/:id", middleware.JWTMiddleware(db), func(c *gin.Context) {
		polarisinventory.UpdateInventory(c, db)
	})

	apiV1.DELETE("/inventory/delete/:id", middleware.JWTMiddleware(db), func(c *gin.Context) {
		polarisinventory.DeleteInventory(c, db)
	})

	//sales order
	apiV1.POST("/salesorder/create-sales-order", middleware.JWTMiddleware(db), func(c *gin.Context) {
		salesorder.CreateSalesOrder(c, db)
	})

	apiV1.PUT("/salesorder/edit-sales-order", middleware.JWTMiddleware(db), func(c *gin.Context) {
		salesorder.EditSalesOrder(c, db)
	})

	apiV1.GET("/salesorder/get-all-sales-order", middleware.JWTMiddleware(db), func(c *gin.Context) {
		salesorder.GetAllSalesOrders(c, db)
	})
	apiV1.GET("/salesorder/get-sales-order-by-id/:id", middleware.JWTMiddleware(db), func(c *gin.Context) {
		salesorder.GetSalesOrderByID(c, db)
	})
	apiV1.DELETE("/salesorder/delete-sales-order", middleware.JWTMiddleware(db), func(c *gin.Context) {
		salesorder.DeleteSalesOrder(c, db)
	})
	apiV1.POST("/salesorder/add-aircon", middleware.JWTMiddleware(db), func(c *gin.Context) {
		salesorder.CreateAircon(c, db)
	})
	apiV1.GET("/salesorder/get-aircon", middleware.JWTMiddleware(db), func(c *gin.Context) {
		salesorder.GetAllAircon(c, db)
	})

	//Invoices
	// apiV1.POST("/invoices/add", middleware.JWTMiddleware(db), func(c *gin.Context) {
	// 	invoices.CreateInvoice(c, db)
	// })

	// apiV1.GET("/invoices/get", middleware.JWTMiddleware(db), func(c *gin.Context) {
	// 	invoices.GetAllInvoices(c, db)
	// })

	// apiV1.GET("/invoices/get-by/:id", middleware.JWTMiddleware(db), func(c *gin.Context) {
	// 	invoices.GetInvoiceByID(c, db)
	// })

	// apiV1.PUT("/invoices/update/:id", middleware.JWTMiddleware(db), func(c *gin.Context) {
	// 	invoices.UpdateInvoice(c, db)
	// })

	// apiV1.DELETE("/invoices/delete/:id", middleware.JWTMiddleware(db), func(c *gin.Context) {
	// 	invoices.DeleteInvoice(c, db)
	// })

	//supplier dr
	apiV1.POST("/supplier/delivery-r-create", middleware.JWTMiddleware(db), func(c *gin.Context) {
		supplierdr.CreateSupplierDR(c, db)
	})

	apiV1.GET("/supplier/dr/get-all", middleware.JWTMiddleware(db), func(c *gin.Context) {
		supplierdr.GetAllSupplierDR(c, db)
	})
	apiV1.GET("/supplier/dr-get-by-id/:id", middleware.JWTMiddleware(db), func(c *gin.Context) {
		supplierdr.GetSupplierDRByID(c, db)
	})
	apiV1.PUT("/supplier/dr-edit", middleware.JWTMiddleware(db), func(c *gin.Context) {
		supplierdr.EditSupplierDR(c, db)
	})
	apiV1.DELETE("/supplier/dr-delete", middleware.JWTMiddleware(db), func(c *gin.Context) {
		supplierdr.DeleteSupplierDR(c, db)
	})

	//supplier invoice
	apiV1.POST("/supplier/invoice-create", middleware.JWTMiddleware(db), func(c *gin.Context) {
		supplierinvoice.CreateSupplierInvoice(c, db)
	})

	apiV1.GET("/supplier/invoice/get-all", middleware.JWTMiddleware(db), func(c *gin.Context) {
		supplierinvoice.GetAllSupplierInvoices(c, db)
	})

	apiV1.GET("/supplier/invoice-get-by-id/:id", middleware.JWTMiddleware(db), func(c *gin.Context) {
		supplierinvoice.GetSupplierInvoiceByID(c, db)
	})

	apiV1.PUT("/supplier/invoice-edit", middleware.JWTMiddleware(db), func(c *gin.Context) {
		supplierinvoice.EditSupplierInvoice(c, db)
	})

	apiV1.DELETE("/supplier/invoice-delete", middleware.JWTMiddleware(db), func(c *gin.Context) {
		supplierinvoice.DeleteSupplierInvoice(c, db)
	})

	//RR
	apiV1.POST("/receiving-r/rr-create", middleware.JWTMiddleware(db), func(c *gin.Context) {
		polarisinventory.AddOrUpdateReceivingReportInventory(c, db)
	})

	apiV1.GET("/receiving-r/rr-get-all", middleware.JWTMiddleware(db), func(c *gin.Context) {
		polarisinventory.GetAllReceivingReportInventory(c, db)
	})

	apiV1.GET("/receiving-r/rr-get-by-id/:id", middleware.JWTMiddleware(db), func(c *gin.Context) {
		polarisinventory.GetReceivingReportInventoryByID(c, db)
	})

	apiV1.DELETE("/receiving-r/rr-delete", middleware.JWTMiddleware(db), func(c *gin.Context) {
		polarisinventory.DeleteReceivingReportInventory(c, db)
	})

	//supplier
	apiV1.POST("/supplier/add-supplier", middleware.JWTMiddleware(db), func(c *gin.Context) {
		supplier.CreateSupplier(c, db)
	})

	apiV1.GET("/supplier/get-all-suppliers", middleware.JWTMiddleware(db), func(c *gin.Context) {
		supplier.GetAllSuppliers(c, db)
	})

	apiV1.GET("/supplier/get-supplier-by-id/:id", middleware.JWTMiddleware(db), func(c *gin.Context) {
		supplier.GetSupplierByID(c, db)
	})

	apiV1.PUT("/supplier/edit-supplier", middleware.JWTMiddleware(db), func(c *gin.Context) {
		supplier.EditSupplier(c, db)
	})

	apiV1.DELETE("/supplier/supplier-delete", middleware.JWTMiddleware(db), func(c *gin.Context) {
		supplier.DeleteSupplier(c, db)
	})

	// sales invoice
	apiV1.POST("/sales-invoice/create-sales-invoice", middleware.JWTMiddleware(db), func(c *gin.Context) {
		salesinvoice.CreateSalesInvoice(c, db)
	})

	apiV1.GET("/sales-invoice/get-all-sales-invoice", middleware.JWTMiddleware(db), func(c *gin.Context) {
		salesinvoice.GetAllSalesInvoices(c, db)
	})

	apiV1.GET("/sales-invoice/get-sales-invoice-by-id/:id", middleware.JWTMiddleware(db), func(c *gin.Context) {
		salesinvoice.GetSalesInvoiceByID(c, db)
	})

	apiV1.PUT("/sales-invoice/update-sales-invoice/:id", middleware.JWTMiddleware(db), func(c *gin.Context) {
		salesinvoice.UpdateSalesInvoice(c, db)
	})

	apiV1.DELETE("/sales-invoice/delete-sales-invoice/:id", middleware.JWTMiddleware(db), func(c *gin.Context) {
		salesinvoice.DeleteSalesInvoice(c, db)
	})

	// extra: get customer by project
	apiV1.GET("/sales-invoice/customer-by-project/:id", middleware.JWTMiddleware(db), func(c *gin.Context) {
		salesinvoice.GetCustomerByProjectID(c, db)
	})

	// delivery receipt
	apiV1.POST("/delivery-receipt/create-delivery-receipt", middleware.JWTMiddleware(db), func(c *gin.Context) {
		deliveryreceipt.CreateDeliveryReceipt(c, db)
	})

	apiV1.GET("/delivery-receipt/get-all-delivery-receipts", middleware.JWTMiddleware(db), func(c *gin.Context) {
		deliveryreceipt.GetAllDeliveryReceipts(c, db)
	})

	apiV1.GET("/delivery-receipt/get-delivery-receipt-by-id/:id", middleware.JWTMiddleware(db), func(c *gin.Context) {
		deliveryreceipt.GetDeliveryReceiptByID(c, db)
	})

	apiV1.PUT("/delivery-receipt/update-delivery-receipt/:id", middleware.JWTMiddleware(db), func(c *gin.Context) {
		deliveryreceipt.UpdateDeliveryReceipt(c, db)
	})

	apiV1.DELETE("/delivery-receipt/delete-delivery-receipt/:id", middleware.JWTMiddleware(db), func(c *gin.Context) {
		deliveryreceipt.DeleteDeliveryReceipt(c, db)
	})

	//generate report
	apiV1.POST("/generate-report/generate-report", middleware.JWTMiddleware(db), func(c *gin.Context) {
		report.GenerateReport(c, db)
	})

	//dashboard
	apiV1.GET("/dashboard/get-dashboard", middleware.JWTMiddleware(db), func(c *gin.Context) {
		dashboard.GetDashboard(c, db)
	})

	// Listen and serve on defined port
	log.Printf("Application started, Listening on Port %s", port)
	router.Run(":" + port)
}

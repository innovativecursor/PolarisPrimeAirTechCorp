package auth

import (
	"log"
	"net/http"
	"os"

	"github.com/gin-gonic/gin"
	"github.com/innovativecursor/PolarisPrimeAirTechCorp/apps/pkg/auth/signin"
	"github.com/innovativecursor/PolarisPrimeAirTechCorp/apps/pkg/auth/signup"
	"github.com/innovativecursor/PolarisPrimeAirTechCorp/apps/pkg/customer"
	"github.com/innovativecursor/PolarisPrimeAirTechCorp/apps/pkg/middleware"
	"github.com/innovativecursor/PolarisPrimeAirTechCorp/apps/pkg/project"
	"github.com/innovativecursor/PolarisPrimeAirTechCorp/apps/pkg/quotation"
	"github.com/innovativecursor/PolarisPrimeAirTechCorp/apps/pkg/salesorder"
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
	apiV1.POST("/project", middleware.JWTMiddleware(db), func(c *gin.Context) {
		project.CreateProject(c, db)
	})
	apiV1.GET("/get-project", middleware.JWTMiddleware(db), func(c *gin.Context) {
		project.GetAllProjects(c, db)
	})
	apiV1.GET("/get-project-by/:id", middleware.JWTMiddleware(db), func(c *gin.Context) {
		project.GetProjectByID(c, db)
	})
	apiV1.PUT("/project/:id", middleware.JWTMiddleware(db), func(c *gin.Context) {
		project.UpdateProject(c, db)
	})
	apiV1.DELETE("project/:id", middleware.JWTMiddleware(db), func(c *gin.Context) {
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

	//quotation
	apiV1.POST("/quotation/upsert", middleware.JWTMiddleware(db), func(c *gin.Context) {
		quotation.UpsertQuotation(c, db)
	})
	apiV1.POST("/quotation/toggle-status", middleware.JWTMiddleware(db), func(c *gin.Context) {
		quotation.ToggleQuotationStatus(c, db)
	})
	apiV1.GET("/quotation/customer-quotations/:customerId", middleware.JWTMiddleware(db), func(c *gin.Context) {
		quotation.GetQuotationsByCustomer(c, db)
	})
	apiV1.GET("/quotation/get-quotation-by-id/:quotationId", middleware.JWTMiddleware(db), func(c *gin.Context) {
		quotation.GetQuotationByID(c, db)
	})
	apiV1.DELETE("/quotation/delete-quotation/:quotationId", middleware.JWTMiddleware(db), func(c *gin.Context) {
		quotation.DeleteQuotation(c, db)
	})

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

	//sales order
	apiV1.POST("/salesorder/create-sales-order", middleware.JWTMiddleware(db), func(c *gin.Context) {
		salesorder.CreateSalesOrder(c, db)
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

	// Listen and serve on defined port
	log.Printf("Application started, Listening on Port %s", port)
	router.Run(":" + port)
}

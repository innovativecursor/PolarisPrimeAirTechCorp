package auth

import (
	"log"
	"net/http"
	"os"

	"github.com/gin-gonic/gin"
	"github.com/innovativecursor/PolarisPrimeAirTechCorp/apps/pkg/auth/signin"
	"github.com/innovativecursor/PolarisPrimeAirTechCorp/apps/pkg/auth/signup"
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

	// Listen and serve on defined port
	log.Printf("Application started, Listening on Port %s", port)
	router.Run(":" + port)
}

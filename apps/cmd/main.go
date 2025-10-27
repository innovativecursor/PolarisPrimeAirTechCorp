package main

import (
	"fmt"
	"log"
	"os"

	"github.com/gin-gonic/gin"
	"github.com/innovativecursor/PolarisPrimeAirTechCorp/apps/pkg/database"
	"github.com/innovativecursor/PolarisPrimeAirTechCorp/apps/routes/auth"
)

func main() {
	dbConn, err := database.InitDB()
	if err != nil {
		fmt.Printf("Failed to initialize database: %v\n", err)

		return
	}

	_ = dbConn

	if err := database.SeedSuperAdmin(c*gin.Context, dbConn); err != nil {
		log.Printf("Super admin seeding failed or already exists: %v", err)
	} else {
		log.Println("Super admin seeded successfully")
	}
	var serviceName string

	// Check if the SERVICE_NAME environment variable is set
	if envServiceName := os.Getenv("SERVICE_NAME"); envServiceName != "" {
		serviceName = envServiceName
	} else {
		// Check if a command-line argument is provided
		if len(os.Args) < 2 {
			fmt.Println("Service name not provided")
			return
		}
		serviceName = os.Args[1]
	}

	switch serviceName {
	case "polaris":
		auth.Auth(dbConn)
		// case "pharmacist":
		// 	pharmacist.Pharmacist(dbConn)
		// case "user":
		// 	user.User(dbConn)
	}
}

package main

import (
	"fmt"

	"github.com/innovativecursor/PolarisPrimeAirTechCorp/apps/pkg/database"
)

func main() {
	dbConn, err := database.InitDB()
	if err != nil {
		fmt.Printf("Failed to initialize database: %v\n", err)

		return
	}

	_ = dbConn

	// // Initialize JWT middleware
	// jwtMiddleware := jwtmiddleware.JWTMiddleware(dbConn)

	// _ = jwtMiddleware

	// var serviceName string

	// // Check if the SERVICE_NAME environment variable is set
	// if envServiceName := os.Getenv("SERVICE_NAME"); envServiceName != "" {
	// 	serviceName = envServiceName
	// } else {
	// 	// Check if a command-line argument is provided
	// 	if len(os.Args) < 2 {
	// 		fmt.Println("Service name not provided")
	// 		return
	// 	}
	// 	serviceName = os.Args[1]
	// }

	// switch serviceName {
	// case "organization":
	// 	enterprise.Organization(dbConn)
	// default:
	// 	fmt.Println("Invalid service name")
	// }
}

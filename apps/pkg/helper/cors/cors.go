// package cors

// import (
// 	"github.com/gin-gonic/gin"
// )

// // Helper function to use coors
// func CORSMiddleware() gin.HandlerFunc {
// 	return func(c *gin.Context) {
// 		c.Writer.Header().Set("Content-Type", "application/json")
// 		c.Writer.Header().Set("Access-Control-Allow-Origin", "*")
// 		c.Writer.Header().Set("Access-Control-Max-Age", "86400")
// 		c.Writer.Header().Set("Access-Control-Allow-Methods", "POST, GET, OPTIONS, PUT, DELETE, UPDATE")
// 		c.Writer.Header().Set("Access-Control-Allow-Headers", "Content-Type, Content-Length, Accept-Encoding, X-CSRF-Token, Authorization, X-Max")
// 		c.Writer.Header().Set("Access-Control-Allow-Credentials", "true")

//			if c.Request.Method == "OPTIONS" {
//				c.AbortWithStatus(204)
//			} else {
//				c.Next()
//			}
//		}
//	}
package cors

import (
	"log"

	"github.com/gin-gonic/gin"
	"github.com/innovativecursor/PolarisPrimeAirTechCorp/apps/config"
)

func CORSMiddleware() gin.HandlerFunc {
	cfg, err := config.Env()
	if err != nil {
		log.Fatalf("Failed to load config: %v", err)
	}

	allowedOrigins := make(map[string]bool)
	for _, o := range cfg.Endpoints {
		allowedOrigins[o] = true
	}

	return func(c *gin.Context) {
		origin := c.Request.Header.Get("Origin")

		if allowedOrigins[origin] {
			c.Writer.Header().Set("Access-Control-Allow-Origin", origin)
			c.Writer.Header().Set("Access-Control-Allow-Credentials", "true")
		}

		c.Writer.Header().Set("Access-Control-Allow-Methods", "GET, POST, PUT, PATCH, DELETE, OPTIONS")
		c.Writer.Header().Set("Access-Control-Allow-Headers", "Origin, Content-Type, Authorization")

		if c.Request.Method == "OPTIONS" {
			c.AbortWithStatus(204)
			return
		}

		c.Next()
	}
}

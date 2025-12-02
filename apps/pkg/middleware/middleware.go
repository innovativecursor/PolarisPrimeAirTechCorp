package middleware

import (
	"errors"
	"fmt"
	"net/http"

	"github.com/gin-gonic/gin"
	"github.com/golang-jwt/jwt"
	"github.com/innovativecursor/PolarisPrimeAirTechCorp/apps/config"
	"github.com/innovativecursor/PolarisPrimeAirTechCorp/apps/pkg/models"
	"go.mongodb.org/mongo-driver/bson"
	"go.mongodb.org/mongo-driver/mongo"
)

func JWTMiddleware(db *mongo.Database) gin.HandlerFunc {
	// Load JWT secret from config
	cfg, err := config.Env()
	if err != nil {
		return func(c *gin.Context) {
			c.JSON(http.StatusInternalServerError, gin.H{
				"error": fmt.Sprintf("failed to load config: %v", err),
			})
			c.Abort()
		}
	}

	jwtSecret := []byte(cfg.JWT.Secret)

	return func(c *gin.Context) {
		// Extract token from Authorization header
		tokenString := c.GetHeader("Authorization")
		if tokenString == "" {
			c.AbortWithStatusJSON(http.StatusUnauthorized, gin.H{"error": "Authorization token required"})
			return
		}

		if len(tokenString) > 7 && tokenString[:7] == "Bearer " {
			tokenString = tokenString[7:]
		}

		// Parse and validate the token
		token, err := jwt.Parse(tokenString, func(token *jwt.Token) (interface{}, error) {
			// Validate the signing method
			if _, ok := token.Method.(*jwt.SigningMethodHMAC); !ok {
				return nil, errors.New("invalid signing method")
			}
			return jwtSecret, nil
		})

		if err != nil || !token.Valid {
			c.AbortWithStatusJSON(http.StatusUnauthorized, gin.H{"error": "Invalid or expired token"})
			return
		}

		// Extract claims
		claims, ok := token.Claims.(jwt.MapClaims)
		if !ok {
			c.AbortWithStatusJSON(http.StatusUnauthorized, gin.H{"error": "Invalid token claims"})
			return
		}

		email, ok := claims["email"].(string)
		if !ok {
			c.AbortWithStatusJSON(http.StatusUnauthorized, gin.H{"error": "Invalid email claim"})
			return
		}

		// Fetch the user from MongoDB
		var user models.User
		usersCol := db.Collection("user")
		err = usersCol.FindOne(c, bson.M{"email": email}).Decode(&user)
		if err != nil {
			c.AbortWithStatusJSON(http.StatusUnauthorized, gin.H{"error": "User not found"})
			return
		}

		// Add user to Gin context
		c.Set("user", &user)

		// Continue to next handler
		c.Next()
	}
}

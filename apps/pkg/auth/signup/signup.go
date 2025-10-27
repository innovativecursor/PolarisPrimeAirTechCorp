package signup

import (
	"context"
	"net/http"

	"github.com/gin-gonic/gin"
	"github.com/innovativecursor/PolarisPrimeAirTechCorp/apps/pkg/auth/config"
	"github.com/innovativecursor/PolarisPrimeAirTechCorp/apps/pkg/models"
	"github.com/sirupsen/logrus"
	"go.mongodb.org/mongo-driver/bson"
	"go.mongodb.org/mongo-driver/bson/primitive"
	"go.mongodb.org/mongo-driver/mongo"
	"golang.org/x/crypto/bcrypt"
)

func SignUp(c *gin.Context, db *mongo.Database) {
	var signUpData config.SignupRequest
	if err := c.ShouldBindJSON(&signUpData); err != nil {
		logrus.WithError(err).Error("Failed to bind signup data")
		c.JSON(http.StatusBadRequest, gin.H{"error": err.Error()})
		return
	}

	collection := db.Collection("user")

	// Check if user already exists
	var existingUser models.User
	err := collection.FindOne(context.Background(), bson.M{"email": signUpData.Email}).Decode(&existingUser)
	if err == nil {
		c.JSON(http.StatusConflict, gin.H{"error": "Email already registered"})
		return
	}

	// Hash password
	hashedPassword, err := bcrypt.GenerateFromPassword([]byte(signUpData.Password), bcrypt.DefaultCost)
	if err != nil {
		logrus.WithError(err).Error("Failed to hash password")
		c.JSON(http.StatusInternalServerError, gin.H{"error": "Failed to process signup"})
		return
	}

	newUser := models.User{
		ID:       primitive.NewObjectID(),
		Email:    signUpData.Email,
		Password: string(hashedPassword),
	}

	_, err = collection.InsertOne(c, newUser)
	if err != nil {
		logrus.WithError(err).Error("Failed to insert new user")
		c.JSON(http.StatusInternalServerError, gin.H{"error": "Failed to create user"})
		return
	}

	c.JSON(http.StatusOK, gin.H{
		"message": "User registered successfully. Please log in to continue.",
	})
}

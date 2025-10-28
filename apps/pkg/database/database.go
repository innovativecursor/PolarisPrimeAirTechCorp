package database

import (
	"context"
	"fmt"
	"log"
	"time"

	"github.com/innovativecursor/PolarisPrimeAirTechCorp/apps/config"
	"github.com/innovativecursor/PolarisPrimeAirTechCorp/apps/pkg/models"
	"go.mongodb.org/mongo-driver/bson"
	"go.mongodb.org/mongo-driver/bson/primitive"
	"go.mongodb.org/mongo-driver/mongo"
	"go.mongodb.org/mongo-driver/mongo/options"
	"golang.org/x/crypto/bcrypt"
)

var db *mongo.Database // Declare db at the package level

// CheckMongoDBConnection checks if the MongoDB database is connected or not
func CheckMongoDBConnection(client *mongo.Client) error {
	ctx, cancel := context.WithTimeout(context.Background(), 10*time.Second)
	defer cancel()

	err := client.Ping(ctx, nil)
	if err != nil {
		return fmt.Errorf("failed to ping MongoDB: %v", err)
	}

	return nil
}

// InitDB initializes the MongoDB database connection
func InitDB() (*mongo.Database, error) {
	var err error

	// Open database connection
	cfg, err := config.Env()
	if err != nil {
		return nil, fmt.Errorf("Failed to load config: %v", err)
	}

	// Set up MongoDB connection options
	clientOptions := options.Client().ApplyURI(cfg.Mongo.ConnectionString)
	client, err := mongo.NewClient(clientOptions)
	if err != nil {
		return nil, fmt.Errorf("failed to create MongoDB client: %v", err)
	}

	// Connect to MongoDB
	ctx, cancel := context.WithTimeout(context.Background(), 30*time.Second)
	defer cancel()
	err = client.Connect(ctx)
	if err != nil {
		return nil, fmt.Errorf("failed to connect to MongoDB: %v", err)
	}

	// Check the connection
	err = CheckMongoDBConnection(client)
	if err != nil {
		return nil, fmt.Errorf("failed to check MongoDB connection: %v", err)
	}

	// Get a handle to your MongoDB database
	db = client.Database(cfg.Mongo.Database)

	// Perform automatic schema migration for each model
	modelsToMigrate := []interface{}{}

	for _, model := range modelsToMigrate {
		if migrator, ok := model.(models.Migrator); ok {
			err := migrator.Migrate(db)
			if err != nil {
				return nil, fmt.Errorf("failed to migrate model %T: %v", model, err)
			}
		}
	}

	return db, nil
}

// GetDB returns the initialized MongoDB database
func GetDB() *mongo.Database {
	return db
}

func SeedSuperAdmin(db *mongo.Database) error {
	ctx, cancel := context.WithTimeout(context.Background(), 10*time.Second)
	defer cancel()

	usersCol := db.Collection("user")
	rolesCol := db.Collection("role")

	cfg, err := config.Env()
	if err != nil {
		return err
	}

	// Ensure "superadmin" role exists
	var superRole models.Role
	err = rolesCol.FindOne(ctx, bson.M{"name": "superadmin"}).Decode(&superRole)
	if err != nil {
		superRole = models.Role{Name: "superadmin"}
		insertResult, err := rolesCol.InsertOne(ctx, superRole)
		if err != nil {
			return fmt.Errorf("failed to create superadmin role: %v", err)
		}
		superRole.ID = insertResult.InsertedID.(primitive.ObjectID)
	}

	// Loop through all seed super admins
	for _, admin := range cfg.Seed.SuperAdmins {
		if admin.Email == "" || admin.Password == "" {
			continue
		}

		var existing models.User
		err = usersCol.FindOne(ctx, bson.M{"email": admin.Email}).Decode(&existing)
		if err == nil {
			// User already exists — do NOT change their role or superadmin status
			log.Printf("Skipping existing user: %s (not modifying existing role)", admin.Email)
			continue
		}

		// Create new superadmin if not found
		hash, _ := bcrypt.GenerateFromPassword([]byte(admin.Password), bcrypt.DefaultCost)
		user := models.User{
			Email:        admin.Email,
			Password:     string(hash),
			Roles:        superRole.ID,
			IsSuperAdmin: true,
			Status:       "active",
		}

		_, err = usersCol.InsertOne(ctx, user)
		if err != nil {
			log.Printf("Failed to insert super admin %s: %v", admin.Email, err)
		} else {
			log.Printf("Seeded new super admin: %s", admin.Email)
		}
	}

	return nil
}

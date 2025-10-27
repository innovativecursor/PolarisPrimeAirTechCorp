package database

import (
	"context"
	"fmt"
	"time"

	"github.com/innovativecursor/PolarisPrimeAirTechCorp/apps/config"
	"github.com/innovativecursor/PolarisPrimeAirTechCorp/apps/pkg/models"
	"go.mongodb.org/mongo-driver/mongo"
	"go.mongodb.org/mongo-driver/mongo/options"
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

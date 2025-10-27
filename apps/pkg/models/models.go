package models

import (
	"go.mongodb.org/mongo-driver/bson/primitive"
	"go.mongodb.org/mongo-driver/mongo"
)

// Migrator interface for performing database schema migration
type Migrator interface {
	Migrate(db *mongo.Database) error
}

type User struct {
	ID       primitive.ObjectID `bson:"_id,omitempty" json:"id,omitempty"`
	Email    string             `bson:"email" json:"email"`
	Password string             `bson:"password" json:"password"`
}

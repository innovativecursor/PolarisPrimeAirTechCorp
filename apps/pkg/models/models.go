package models

import (
	"time"

	"go.mongodb.org/mongo-driver/bson/primitive"
	"go.mongodb.org/mongo-driver/mongo"
)

// Migrator interface for performing database schema migration
type Migrator interface {
	Migrate(db *mongo.Database) error
}

type Role struct {
	ID   primitive.ObjectID `bson:"_id,omitempty" json:"id,omitempty"`
	Name string             `bson:"name" json:"name"`
}

type PendingUser struct {
	ID          primitive.ObjectID `bson:"_id,omitempty" json:"id,omitempty"`
	Email       string             `bson:"email" json:"email"`
	Password    string             `bson:"password" json:"password"` // store hashed password
	RequestedAt time.Time          `bson:"requestedAt" json:"requestedAt"`
	Status      string             `bson:"status" json:"status"` // "pending", "approved", "rejected"
}

type User struct {
	ID           primitive.ObjectID `bson:"_id,omitempty" json:"id,omitempty"`
	Email        string             `bson:"email" json:"email"`
	Password     string             `bson:"password" json:"password"`
	Roles        primitive.ObjectID `bson:"roles,omitempty" json:"roles,omitempty"`
	IsSuperAdmin bool               `bson:"isSuperAdmin,omitempty" json:"isSuperAdmin,omitempty"`
	Status       string             `bson:"status" json:"status"` // e.g. "active", "suspended"
}

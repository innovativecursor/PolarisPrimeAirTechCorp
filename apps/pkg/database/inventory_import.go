package database

import (
	"context"
	"encoding/csv"
	"os"
	"strconv"
	"time"

	"go.mongodb.org/mongo-driver/bson"
	"go.mongodb.org/mongo-driver/bson/primitive"
	"go.mongodb.org/mongo-driver/mongo"
)

func ImportInventory(
	db *mongo.Database,
	filePath string,
	createdBy primitive.ObjectID,
) error {

	// 1️⃣ open csv
	file, err := os.Open(filePath)
	if err != nil {
		return err
	}
	defer file.Close()

	// 2️⃣ read csv
	reader := csv.NewReader(file)
	rows, err := reader.ReadAll()
	if err != nil {
		return err
	}

	// 3️⃣ loop rows
	for _, row := range rows[1:] { // skip header

		price, _ := strconv.Atoi(row[4])
		quantity, _ := strconv.Atoi(row[8])

		// 4️⃣ duplicate check (sku)
		count, _ := db.Collection("inventory").
			CountDocuments(context.TODO(), bson.M{"sku": row[0]})

		if count > 0 {
			continue
		}

		// 5️⃣ insert
		db.Collection("inventory").InsertOne(context.TODO(), bson.M{
			"sku":                 row[0],
			"barcode":             row[1],
			"aircon_model_number": row[2],
			"aircon_name":         row[3],
			"price":               price,
			"hp":                  row[5],
			"type_of_aircon":      row[6],
			"indoor_outdoor_unit": row[7],
			"quantity":            quantity,
			"created_by":          createdBy,
			"created_at":          time.Now(),
			"updated_at":          time.Now(),
		})
	}

	return nil
}

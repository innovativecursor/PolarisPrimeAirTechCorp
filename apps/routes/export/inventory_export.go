package exportAPI

import (
	"encoding/csv"
	"fmt"
	"net/http"

	"github.com/gin-gonic/gin"
	"go.mongodb.org/mongo-driver/bson"
	"go.mongodb.org/mongo-driver/mongo"
	"go.mongodb.org/mongo-driver/mongo/options"
	"context"
	"time"
)

func ExportInventory(db *mongo.Database) gin.HandlerFunc {
	return func(c *gin.Context) {
		ctx, cancel := context.WithTimeout(context.Background(), 10*time.Second)
		defer cancel()

		cursor, err := db.Collection("inventory").Find(ctx, bson.M{}, options.Find())
		if err != nil {
			c.JSON(http.StatusInternalServerError, gin.H{"error": "DB query failed"})
			return
		}
		defer cursor.Close(ctx)

		// Create CSV writer
		c.Header("Content-Disposition", "attachment; filename=inventory.csv")
		c.Header("Content-Type", "text/csv")
		writer := csv.NewWriter(c.Writer)
		defer writer.Flush()

		// Write header
		header := []string{"SKU","Barcode","AirconModelNumber","AirconName","Price","HP","TypeOfAircon","IndoorOutdoorUnit","Quantity"}
		writer.Write(header)

		// Iterate through documents
		for cursor.Next(ctx) {
			var item struct {
				SKU               string  `bson:"sku"`
				Barcode           string  `bson:"barcode"`
				AirconModelNumber string  `bson:"aircon_model_number"`
				AirconName        string  `bson:"aircon_name"`
				Price             float64 `bson:"price"`
				HP                string  `bson:"hp"`
				TypeOfAircon      string  `bson:"type_of_aircon"`
				IndoorOutdoorUnit string  `bson:"indoor_outdoor_unit"`
				Quantity          int     `bson:"quantity"`
			}
			err := cursor.Decode(&item)
			if err != nil {
				continue // skip bad row
			}

			record := []string{
				item.SKU,
				item.Barcode,
				item.AirconModelNumber,
				item.AirconName,
				fmt.Sprintf("%.2f", item.Price),
				item.HP,
				item.TypeOfAircon,
				item.IndoorOutdoorUnit,
				fmt.Sprintf("%d", item.Quantity),
			}
			writer.Write(record)
		}
	}
}

package importAPI

import (
	"encoding/csv"
	"fmt"
	"net/http"
	"os"
	"strconv"

	"github.com/gin-gonic/gin"
	"go.mongodb.org/mongo-driver/mongo"
)

type InventoryItem struct {
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

func ImportInventory(db *mongo.Database) gin.HandlerFunc {
	return func(c *gin.Context) {
		// Get CSV file from form
		file, err := c.FormFile("file")
		if err != nil {
			c.JSON(http.StatusBadRequest, gin.H{"error": "CSV file required"})
			return
		}

		// Save temporarily
		tempFile := fmt.Sprintf("./%s", file.Filename)
		if err := c.SaveUploadedFile(file, tempFile); err != nil {
			c.JSON(http.StatusInternalServerError, gin.H{"error": "Unable to save file"})
			return
		}
		defer os.Remove(tempFile)

		// Open CSV
		f, err := os.Open(tempFile)
		if err != nil {
			c.JSON(http.StatusInternalServerError, gin.H{"error": "Cannot open file"})
			return
		}
		defer f.Close()

		reader := csv.NewReader(f)
		records, err := reader.ReadAll()
		if err != nil {
			c.JSON(http.StatusInternalServerError, gin.H{"error": "Cannot read CSV"})
			return
		}

		// Process each row
		for i, row := range records {
			if i == 0 { // skip header
				continue
			}

			if len(row) < 9 { // check columns
				c.JSON(http.StatusBadRequest, gin.H{"error": fmt.Sprintf("Row %d has insufficient columns", i)})
				return
			}

			// SKU validation
			if row[0] == "" {
				c.JSON(http.StatusBadRequest, gin.H{"error": fmt.Sprintf("Row %d has empty SKU", i)})
				return
			}

			// Price validation
			price, err := strconv.ParseFloat(row[4], 64)
			if err != nil || price <= 0 {
				c.JSON(http.StatusBadRequest, gin.H{"error": fmt.Sprintf("Invalid price at row %d", i)})
				return
			}

			// Quantity validation
			quantity, err := strconv.Atoi(row[8])
			if err != nil || quantity < 0 {
				c.JSON(http.StatusBadRequest, gin.H{"error": fmt.Sprintf("Invalid quantity at row %d", i)})
				return
			}

			item := InventoryItem{
				SKU:               row[0],
				Barcode:           row[1],
				AirconModelNumber: row[2],
				AirconName:        row[3],
				Price:             price,
				HP:                row[5],
				TypeOfAircon:      row[6],
				IndoorOutdoorUnit: row[7],
				Quantity:          quantity,
			}

			// Insert into MongoDB
			_, err = db.Collection("inventory").InsertOne(c, item)
			if err != nil {
				c.JSON(http.StatusInternalServerError, gin.H{"error": "DB insert failed", "row": i})
				return
			}
		}

		c.JSON(http.StatusOK, gin.H{"message": "CSV imported successfully"})
	}
}

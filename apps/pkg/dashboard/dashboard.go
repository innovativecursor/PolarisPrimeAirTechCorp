package dashboard

import (
	"context"
	"net/http"
	"time"

	"github.com/gin-gonic/gin"
	"go.mongodb.org/mongo-driver/bson"
	"go.mongodb.org/mongo-driver/mongo"
)

type MonthlySales struct {
	Month string `json:"month"`
	Value int64  `json:"value"`
}

type DashboardResponse struct {
	AvailableUnits    int64          `json:"available_units"`
	OpenSalesOrders   int64          `json:"open_sales_orders"`
	ReceivingThisWeek int64          `json:"receiving_this_week"`
	TotalDeliveries   int64          `json:"total_deliveries"`
	MonthlySales      []MonthlySales `json:"monthly_sales"`
}

func GetDashboard(c *gin.Context, db *mongo.Database) {

	ctx := context.Background()

	invCollection := db.Collection("polaris_inventory")

	invPipeline := mongo.Pipeline{
		{{Key: "$group", Value: bson.M{
			"_id":   nil,
			"total": bson.M{"$sum": "$quantity"},
		}}},
	}

	invCursor, err := invCollection.Aggregate(ctx, invPipeline)
	if err != nil {
		c.JSON(http.StatusInternalServerError, gin.H{"error": "Failed to fetch inventory"})
		return
	}

	var invResult []bson.M
	if err := invCursor.All(ctx, &invResult); err != nil {
		c.JSON(http.StatusInternalServerError, gin.H{"error": "Inventory aggregation error"})
		return
	}

	var availableUnits int64
	if len(invResult) > 0 {
		switch v := invResult[0]["total"].(type) {
		case int32:
			availableUnits = int64(v)
		case int64:
			availableUnits = v
		case float64:
			availableUnits = int64(v)
		}
	}

	soCollection := db.Collection("salesorder")

	openSalesOrders, err := soCollection.CountDocuments(ctx, bson.M{})
	if err != nil {
		c.JSON(http.StatusInternalServerError, gin.H{"error": "Failed to count sales orders"})
		return
	}

	drCollection := db.Collection("supplierdeliveryreceipt")

	now := time.Now()
	startOfWeek := time.Date(now.Year(), now.Month(), now.Day()-int(now.Weekday()), 0, 0, 0, 0, now.Location())
	endOfWeek := startOfWeek.AddDate(0, 0, 7)

	receivingThisWeek, err := drCollection.CountDocuments(ctx, bson.M{
		"dispatch_date": bson.M{
			"$gte": startOfWeek,
			"$lt":  endOfWeek,
		},
	})
	if err != nil {
		c.JSON(http.StatusInternalServerError, gin.H{"error": "Failed to count receiving"})
		return
	}

	projectCollection := db.Collection("project")

	totalDeliveries, err := projectCollection.CountDocuments(ctx, bson.M{})
	if err != nil {
		c.JSON(http.StatusInternalServerError, gin.H{"error": "Failed to count projects"})
		return
	}

	year := time.Now().Year()
	startYear := time.Date(year, 1, 1, 0, 0, 0, 0, time.UTC)
	endYear := startYear.AddDate(1, 0, 0)

	monthlyPipeline := mongo.Pipeline{
		{{Key: "$match", Value: bson.M{
			"createdAt": bson.M{
				"$gte": startYear,
				"$lt":  endYear,
			},
		}}},
		{{Key: "$group", Value: bson.M{
			"_id": bson.M{
				"month": bson.M{"$month": "$createdAt"},
			},
			"count": bson.M{"$sum": 1},
		}}},
		{{Key: "$sort", Value: bson.M{"_id.month": 1}}},
	}

	salesCursor, err := soCollection.Aggregate(ctx, monthlyPipeline)
	if err != nil {
		c.JSON(http.StatusInternalServerError, gin.H{"error": "Failed to fetch monthly sales"})
		return
	}

	type salesAgg struct {
		ID struct {
			Month int `bson:"month"`
		} `bson:"_id"`
		Count int64 `bson:"count"`
	}

	var salesResults []salesAgg
	if err := salesCursor.All(ctx, &salesResults); err != nil {
		c.JSON(http.StatusInternalServerError, gin.H{"error": "Monthly sales aggregation error"})
		return
	}

	// Map month → count
	salesMap := make(map[int]int64)
	for _, s := range salesResults {
		salesMap[s.ID.Month] = s.Count
	}

	months := []string{"Jan", "Feb", "Mar", "Apr", "May", "Jun", "Jul", "Aug", "Sep", "Oct", "Nov", "Dec"}
	monthlySales := make([]MonthlySales, 0, 12)

	for i := 1; i <= 12; i++ {
		monthlySales = append(monthlySales, MonthlySales{
			Month: months[i-1],
			Value: salesMap[i], // defaults to 0
		})
	}

	c.JSON(http.StatusOK, DashboardResponse{
		AvailableUnits:    availableUnits,
		OpenSalesOrders:   openSalesOrders,
		ReceivingThisWeek: receivingThisWeek,
		TotalDeliveries:   totalDeliveries,
		MonthlySales:      monthlySales,
	})
}

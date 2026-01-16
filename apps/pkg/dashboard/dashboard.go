package dashboard

import (
	"context"
	"net/http"
	"time"

	"github.com/gin-gonic/gin"
	"go.mongodb.org/mongo-driver/bson"
	"go.mongodb.org/mongo-driver/mongo"
)

// func GetDashboard(c *gin.Context, db *mongo.Database) {
// 	user, exists := c.Get("user")
// 	if !exists {
// 		c.JSON(http.StatusUnauthorized, gin.H{"error": "User not found"})
// 		return
// 	}

// 	if _, ok := user.(*models.User); !ok {
// 		c.JSON(http.StatusUnauthorized, gin.H{"error": "Invalid user"})
// 		return
// 	}

// 	// Collections
// 	salesOrderCol := db.Collection("salesorder")
// 	drCol := db.Collection("delivery_receipts")

// 	response := config.DashboardResponse{}

// 	// 1. STATS

// 	// Open Sales Orders
// 	openOrdersCount, err := salesOrderCol.CountDocuments(
// 		context.Background(),
// 		bson.M{
// 			"status": bson.M{"$in": []string{"notapproved", "approved"}},
// 		},
// 	)
// 	if err != nil {
// 		openOrdersCount = 0
// 	}

// 	// Total Deliveries (REAL DR COUNT)
// 	totalDeliveriesCount, err := drCol.CountDocuments(
// 		context.Background(),
// 		bson.M{},
// 	)
// 	if err != nil {
// 		totalDeliveriesCount = 0
// 	}

// 	response.Stats = config.DashboardStats{
// 		AvailableUnits:    0, // inventory module later
// 		OpenSalesOrders:   int(openOrdersCount),
// 		ReceivingThisWeek: 0, // warehouse module later
// 		TotalDeliveries:   int(totalDeliveriesCount),
// 	}

// 	// 2. MONTHLY SALES CHART

// 	startOfYear := time.Date(
// 		time.Now().Year(),
// 		1, 1, 0, 0, 0, 0,
// 		time.UTC,
// 	)

// 	monthlySalesPipeline := mongo.Pipeline{
// 		{
// 			{"$match", bson.M{
// 				"createdAt": bson.M{"$gte": startOfYear},
// 			}},
// 		},
// 		{
// 			{"$group", bson.M{
// 				"_id": bson.M{
// 					"month": bson.M{"$month": "$createdAt"},
// 				},
// 				"total": bson.M{"$sum": "$totalAmount"},
// 			}},
// 		},
// 		{
// 			{"$sort", bson.M{"_id.month": 1}},
// 		},
// 	}

// 	cursor, err := salesOrderCol.Aggregate(context.Background(), monthlySalesPipeline)
// 	if err == nil {
// 		defer cursor.Close(context.Background())

// 		monthMap := map[int]string{
// 			1: "Jan", 2: "Feb", 3: "Mar", 4: "Apr",
// 			5: "May", 6: "Jun", 7: "Jul", 8: "Aug",
// 			9: "Sep", 10: "Oct", 11: "Nov", 12: "Dec",
// 		}

// 		for cursor.Next(context.Background()) {
// 			var row struct {
// 				ID struct {
// 					Month int `bson:"month"`
// 				} `bson:"_id"`
// 				Total float64 `bson:"total"`
// 			}

// 			if err := cursor.Decode(&row); err == nil {
// 				response.MonthlySales = append(
// 					response.MonthlySales,
// 					config.MonthlySalesData{
// 						Month: monthMap[row.ID.Month],
// 						Value: row.Total,
// 					},
// 				)
// 			}
// 		}
// 	}

// 	// 3. CUSTOMER DISTRIBUTION
// 	// (Still placeholder – requires customer region data)
// 	response.CustomerDistribution = []config.CustomerDistribution{
// 		{"Metro Manila", 35},
// 		{"Calabarzon", 20},
// 		{"Others", 45},
// 	}

// 	// 4. INVENTORY POSITION

// 	// (Placeholder – hook inventory service later)
// 	response.InventoryPosition = []config.InventoryPosition{
// 		{"Window aircon", 1120},
// 		{"Ducted splits", 2008},
// 		{"Centralized units", 462},
// 	}

// 	// 5. WAREHOUSING UPDATES

// 	response.WarehousingUpdates = []config.WarehousingUpdate{
// 		{
// 			Title: "Inventory sync",
// 			Info:  "Warehouse data up to date",
// 		},
// 	}

// 	statusPipeline := mongo.Pipeline{
// 		{
// 			{"$group", bson.M{
// 				"_id":   "$status",
// 				"count": bson.M{"$sum": 1},
// 			}},
// 		},
// 	}

// 	statusCursor, err := salesOrderCol.Aggregate(context.Background(), statusPipeline)
// 	if err == nil {
// 		defer statusCursor.Close(context.Background())

// 		for statusCursor.Next(context.Background()) {
// 			var row struct {
// 				Status string `bson:"_id"`
// 				Count  int    `bson:"count"`
// 			}

// 			if err := statusCursor.Decode(&row); err == nil {
// 				response.FulfillmentPipeline = append(
// 					response.FulfillmentPipeline,
// 					config.FulfillmentPipelineItem{
// 						Stage:  row.Status,
// 						Volume: row.Count,
// 						Status: "Active",
// 					},
// 				)
// 			}
// 		}
// 	}
// 	c.JSON(http.StatusOK, response)
// }

type DashboardStats struct {
	AvailableUnits    int64 `json:"available_units"`
	OpenSalesOrders   int64 `json:"open_sales_orders"`
	ReceivingThisWeek int64 `json:"receiving_this_week"`
	TotalDeliveries   int64 `json:"total_deliveries"`
}

func GetDashboard(c *gin.Context, db *mongo.Database) {

	ctx := context.Background()

	//  Available Units (SUM of inventory quantity)
	invCollection := db.Collection("polaris_inventory")

	pipeline := mongo.Pipeline{
		{{Key: "$group", Value: bson.M{
			"_id":   nil,
			"total": bson.M{"$sum": "$quantity"},
		}}},
	}

	cursor, err := invCollection.Aggregate(ctx, pipeline)
	if err != nil {
		c.JSON(http.StatusInternalServerError, gin.H{"error": "Failed to fetch inventory"})
		return
	}

	var invResult []bson.M
	if err := cursor.All(ctx, &invResult); err != nil {
		c.JSON(http.StatusInternalServerError, gin.H{"error": "Inventory aggregation error"})
		return
	}

	var availableUnits int64 = 0

	if len(invResult) > 0 {
		switch v := invResult[0]["total"].(type) {
		case int32:
			availableUnits = int64(v)
		case int64:
			availableUnits = v
		case float64:
			availableUnits = int64(v)
		default:
			availableUnits = 0
		}
	}
	// Open Sales Orders
	soCollection := db.Collection("salesorder")

	openSalesOrders, err := soCollection.CountDocuments(ctx, bson.M{})
	if err != nil {
		c.JSON(http.StatusInternalServerError, gin.H{"error": "Failed to count sales orders"})
		return
	}

	//  Receiving This Week
	drCollection := db.Collection("supplierdeliveryreceipt")

	startOfWeek := time.Now().AddDate(0, 0, -int(time.Now().Weekday()))
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

	//  Total Deliveries (Total Projects)
	projectCollection := db.Collection("project")

	totalDeliveries, err := projectCollection.CountDocuments(ctx, bson.M{})
	if err != nil {
		c.JSON(http.StatusInternalServerError, gin.H{"error": "Failed to count projects"})
		return
	}

	// Final Response
	c.JSON(http.StatusOK, DashboardStats{
		AvailableUnits:    availableUnits,
		OpenSalesOrders:   openSalesOrders,
		ReceivingThisWeek: receivingThisWeek,
		TotalDeliveries:   totalDeliveries,
	})
}

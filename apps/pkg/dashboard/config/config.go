package config

type DashboardResponse struct {
	Stats                DashboardStats            `json:"stats"`
	MonthlySales         []MonthlySalesData        `json:"monthly_sales"`
	CustomerDistribution []CustomerDistribution    `json:"customer_distribution"`
	InventoryPosition    []InventoryPosition       `json:"inventory_position"`
	WarehousingUpdates   []WarehousingUpdate       `json:"warehousing_updates"`
	FulfillmentPipeline  []FulfillmentPipelineItem `json:"fulfillment_pipeline"`
}

type DashboardStats struct {
	AvailableUnits    int `json:"available_units"`
	OpenSalesOrders   int `json:"open_sales_orders"`
	ReceivingThisWeek int `json:"receiving_this_week"`
	TotalDeliveries   int `json:"total_deliveries"`
}

type MonthlySalesData struct {
	Month string  `json:"month"`
	Value float64 `json:"value"`
}

type CustomerDistribution struct {
	Region string `json:"region"`
	Value  int    `json:"value"`
}

type InventoryPosition struct {
	ItemName string `json:"item_name"`
	Units    int    `json:"units"`
}

type WarehousingUpdate struct {
	Title string `json:"title"`
	Info  string `json:"info"`
}

type FulfillmentPipelineItem struct {
	Stage  string `json:"stage"`
	Volume int    `json:"volume"`
	Status string `json:"status"`
}

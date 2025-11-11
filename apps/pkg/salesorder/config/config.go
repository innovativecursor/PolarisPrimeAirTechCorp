package config

type SalesOrderData struct {
	ProjectID  string             `json:"projectId"`
	CustomerID string             `json:"customerId"`
	Items      []SalesOrderItemIn `json:"items"`
}

type SalesOrderItemIn struct {
	AirconID string  `json:"airconId"`
	Qty      int     `json:"qty"`
	UOM      string  `json:"uom"`
	Price    float64 `json:"price"`
}

type AirconData struct {
	Name     string  `bson:"name" json:"name"`
	Model    string  `bson:"model" json:"model"`
	Brand    string  `bson:"brand" json:"brand"`
	Capacity string  `bson:"capacity" json:"capacity"`
	Price    float64 `bson:"price" json:"price"`
}

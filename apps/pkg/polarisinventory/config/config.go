package config

type AddUpdateInventory struct {
	SKU               string `json:"sku" binding:"required"`
	Barcode           string `json:"barcode,omitempty"`
	AirconModelNumber string `json:"aircon_model_number" binding:"required"`
	AirconName        string `json:"aircon_name" binding:"required"`
	HP                string `json:"hp" binding:"required"`
	TypeOfAircon      string `json:"type_of_aircon" binding:"required"`
	IndoorOutdoorUnit string `json:"indoor_outdoor_unit" binding:"required"`
	Quantity          int    `json:"quantity" binding:"required,min=1"`
}

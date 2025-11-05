package config

type CustomerData struct {
	ID           string `json:"id,omitempty"`
	CustomerName string `json:"customername"`
	Address      string `json:"address"`
}

type DeleteCustomer struct {
	ID string `json:"id,omitempty"`
}

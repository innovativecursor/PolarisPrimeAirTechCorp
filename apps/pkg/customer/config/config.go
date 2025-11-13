package config

type CustomerData struct {
	ID           string `json:"id,omitempty"`
	CustomerName string `json:"customername"`
	Address      string `json:"address"`
	TINNumber    string `json:"tinnumber"`
}

type DeleteCustomer struct {
	ID string `json:"id,omitempty"`
}

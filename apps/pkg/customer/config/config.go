package config

type CustomerData struct {
	ID           string `json:"id,omitempty"`
	CustomerName string `json:"customername"`
	CustomerOrg  string `json:"customerorg"`
	Address      string `json:"address"`
	City         string `json:"city"`
	TINNumber    string `json:"tinnumber"`
}

type DeleteCustomer struct {
	ID string `json:"id,omitempty"`
}

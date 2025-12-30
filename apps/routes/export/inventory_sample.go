package exportAPI

import (
	"net/http"

	"github.com/gin-gonic/gin"
)

func DownloadInventorySample() gin.HandlerFunc {
	return func(c *gin.Context) {

		c.Header("Content-Type", "text/csv")
		c.Header("Content-Disposition", "attachment; filename=inventory_sample.csv")

		c.String(http.StatusOK,
`sku,barcode,aircon_model_number,aircon_name,hp,type_of_aircon,indoor_outdoor_unit,quantity,price
SKU-001,BAR-001,AC-101,Split AC 1.5 Ton,1.5,Split,Both,10,42000
SKU-002,BAR-002,AC-102,Window AC 1 Ton,1.0,Window,Indoor,5,28000`)
	}
}

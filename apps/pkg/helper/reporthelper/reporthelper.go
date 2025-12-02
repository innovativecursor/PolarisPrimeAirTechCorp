package reporthelper

import (
	"encoding/csv"
	"fmt"
	"os"
	"time"

	"github.com/innovativecursor/PolarisPrimeAirTechCorp/apps/pkg/models"
	"github.com/jung-kurt/gofpdf"
	"github.com/xuri/excelize/v2"
)

func GenerateCustomerCSV(data []models.Customer) (string, error) {
	filePath := "/tmp/customer_report.csv"
	file, err := os.Create(filePath)
	if err != nil {
		return "", err
	}
	defer file.Close()

	writer := csv.NewWriter(file)
	defer writer.Flush()

	// Header
	writer.Write([]string{"Customer Name", "Organization", "Address", "TIN", "Created At"})

	for _, v := range data {
		writer.Write([]string{
			v.CustomerName,
			v.CustomerOrg,
			v.Address,
			v.TINNumber,
			v.CreatedAt.Format("02-01-2006"),
		})
	}

	return filePath, nil
}

func GenerateCustomerPDF(customers []models.Customer, start, end time.Time) (string, error) {
	pdf := gofpdf.New("P", "mm", "A4", "")
	pdf.SetTitle("Customer Report", false)
	pdf.AliasNbPages("")

	pdf.SetFooterFunc(func() {
		pdf.SetY(-15)
		pdf.SetFont("Arial", "I", 9)
		pdf.CellFormat(0, 10, fmt.Sprintf("Page %d/{nb}", pdf.PageNo()), "", 0, "C", false, 0, "")
	})

	pdf.AddPage()

	pdf.SetFont("Arial", "B", 18)
	pdf.CellFormat(0, 10, "CUSTOMER REPORT", "", 1, "C", false, 0, "")
	pdf.Ln(3)

	// Use the actual requested date range
	startDate := start.Format("02 Jan 2006")
	endDate := end.Format("02 Jan 2006")

	pdf.SetFont("Arial", "", 11)
	pdf.CellFormat(0, 6, fmt.Sprintf("Date Range: %s - %s", startDate, endDate), "", 1, "C", false, 0, "")
	pdf.Ln(6)

	pdf.SetFont("Arial", "B", 11)
	pdf.SetFillColor(230, 230, 230)

	cols := []string{"Customer Name", "Organization", "Address", "TIN Number", "Created At"}
	widths := []float64{45, 40, 55, 30, 25}

	for i, h := range cols {
		pdf.CellFormat(widths[i], 8, h, "1", 0, "C", true, 0, "")
	}
	pdf.Ln(-1)

	pdf.SetFont("Arial", "", 10)
	for _, cust := range customers {
		cols := []string{
			cust.CustomerName,
			cust.CustomerOrg,
			cust.Address,
			cust.TINNumber,
			cust.CreatedAt.Format("02 Jan 2006"),
		}
		MultiCellRow(pdf, cols, widths, 6)
	}
	file := fmt.Sprintf("/tmp/customer_report_%d.pdf", time.Now().Unix())
	err := pdf.OutputFileAndClose(file)
	return file, err
}

func GenerateCustomerExcel(customers []models.Customer) (string, error) {
	f := excelize.NewFile()
	sheet := "Report"

	// Rename default sheet
	f.SetSheetName("Sheet1", sheet)

	// Headers
	headers := []string{"Customer Name", "Organization", "Address", "TIN Number", "Created At"}

	for i, h := range headers {
		cell, _ := excelize.CoordinatesToCellName(i+1, 1)
		f.SetCellValue(sheet, cell, h)
	}

	// Rows
	row := 2
	for _, c := range customers {
		f.SetCellValue(sheet, fmt.Sprintf("A%d", row), c.CustomerName)
		f.SetCellValue(sheet, fmt.Sprintf("B%d", row), c.CustomerOrg)
		f.SetCellValue(sheet, fmt.Sprintf("C%d", row), c.Address)
		f.SetCellValue(sheet, fmt.Sprintf("D%d", row), c.TINNumber)
		f.SetCellValue(sheet, fmt.Sprintf("E%d", row), c.CreatedAt.Format("02 Jan 2006"))
		row++
	}

	// Auto column width
	for i := 1; i <= 5; i++ {
		col, _ := excelize.ColumnNumberToName(i)
		f.SetColWidth(sheet, col, col, 22)
	}

	file := fmt.Sprintf("/tmp/customer_report_%d.xlsx", time.Now().Unix())
	err := f.SaveAs(file)
	return file, err
}

func GenerateInventoryCSV(data []models.PolarisInventory) (string, error) {
	filePath := fmt.Sprintf("/tmp/inventory_report_%d.csv", time.Now().Unix())
	file, err := os.Create(filePath)
	if err != nil {
		return "", err
	}
	defer file.Close()

	writer := csv.NewWriter(file)
	defer writer.Flush()

	writer.Write([]string{
		"SKU", "Model Number", "Aircon Name", "HP", "Type",
		"Indoor/Outdoor", "Quantity", "Price", "Created At",
	})

	for _, v := range data {
		writer.Write([]string{
			v.SKU,
			v.AirconModelNumber,
			v.AirconName,
			v.HP,
			v.TypeOfAircon,
			v.IndoorOutdoorUnit,
			fmt.Sprintf("%d", v.Quantity),
			fmt.Sprintf("%.2f", v.Price),
			v.CreatedAt.Format("02 Jan 2006"),
		})
	}

	return filePath, nil
}

func GenerateInventoryExcel(items []models.PolarisInventory) (string, error) {
	f := excelize.NewFile()
	sheet := "Inventory"

	f.SetSheetName("Sheet1", sheet)

	headers := []string{
		"SKU", "Model Number", "Aircon Name", "HP", "Type",
		"Indoor/Outdoor", "Quantity", "Price", "Created At",
	}

	for i, h := range headers {
		cell, _ := excelize.CoordinatesToCellName(i+1, 1)
		f.SetCellValue(sheet, cell, h)
	}

	row := 2
	for _, v := range items {
		f.SetCellValue(sheet, fmt.Sprintf("A%d", row), v.SKU)
		f.SetCellValue(sheet, fmt.Sprintf("B%d", row), v.AirconModelNumber)
		f.SetCellValue(sheet, fmt.Sprintf("C%d", row), v.AirconName)
		f.SetCellValue(sheet, fmt.Sprintf("D%d", row), v.HP)
		f.SetCellValue(sheet, fmt.Sprintf("E%d", row), v.TypeOfAircon)
		f.SetCellValue(sheet, fmt.Sprintf("F%d", row), v.IndoorOutdoorUnit)
		f.SetCellValue(sheet, fmt.Sprintf("G%d", row), v.Quantity)
		f.SetCellValue(sheet, fmt.Sprintf("H%d", row), v.Price)
		f.SetCellValue(sheet, fmt.Sprintf("I%d", row), v.CreatedAt.Format("02 Jan 2006"))
		row++
	}

	filePath := fmt.Sprintf("/tmp/inventory_report_%d.xlsx", time.Now().Unix())
	err := f.SaveAs(filePath)
	return filePath, err
}

func GenerateInventoryPDF(items []models.PolarisInventory, start, end time.Time) (string, error) {

	pdf := gofpdf.New("L", "mm", "A4", "")
	pdf.SetTitle("Inventory Report", false)
	pdf.AliasNbPages("")

	// Add footer page number
	pdf.SetFooterFunc(func() {
		pdf.SetY(-15)
		pdf.SetFont("Arial", "I", 9)
		pdf.CellFormat(0, 10, fmt.Sprintf("Page %d/{nb}", pdf.PageNo()), "", 0, "C", false, 0, "")
	})

	pdf.AddPage()

	// Title
	pdf.SetFont("Arial", "B", 18)
	pdf.CellFormat(0, 10, "INVENTORY REPORT", "", 1, "C", false, 0, "")
	pdf.Ln(3)

	// Date range
	startDate := start.Format("02 Jan 2006")
	endDate := end.Format("02 Jan 2006")
	pdf.SetFont("Arial", "", 11)
	pdf.CellFormat(0, 6, fmt.Sprintf("Date Range: %s - %s", startDate, endDate), "", 1, "C", false, 0, "")
	pdf.Ln(5)

	// Table Header
	headers := []string{
		"SKU", "Model No", "Name", "HP", "Type",
		"Indoor/Outdoor", "Qty", "Price", "Created At",
	}

	widths := []float64{30, 35, 60, 15, 30, 30, 20, 25, 30}

	pdf.SetFont("Arial", "B", 11)
	pdf.SetFillColor(0, 0, 0)
	pdf.SetTextColor(255, 255, 255)

	for i, h := range headers {
		pdf.CellFormat(widths[i], 9, h, "1", 0, "C", true, 0, "")
	}
	pdf.Ln(-1)

	// Reset font colors for rows
	pdf.SetFont("Arial", "", 10)
	pdf.SetTextColor(0, 0, 0)

	// Table Rows
	for _, v := range items {
		cols := []string{
			v.SKU,
			v.AirconModelNumber,
			v.AirconName,
			v.HP,
			v.TypeOfAircon,
			v.IndoorOutdoorUnit,
			fmt.Sprintf("%d", v.Quantity),
			fmt.Sprintf("%.2f", v.Price),
			v.CreatedAt.Format("02 Jan 2006"),
		}
		MultiCellRow(pdf, cols, widths, 6)
	}
	file := fmt.Sprintf("/tmp/inventory_report_%d.pdf", time.Now().Unix())
	err := pdf.OutputFileAndClose(file)
	return file, err
}

func MultiCellRow(pdf *gofpdf.Fpdf, cols []string, widths []float64, lineHeight float64) {
	// Determine max number of lines in the row
	maxLines := 1
	for i, txt := range cols {
		lines := pdf.SplitLines([]byte(txt), widths[i])
		if len(lines) > maxLines {
			maxLines = len(lines)
		}
	}

	rowHeight := float64(maxLines) * lineHeight

	x := pdf.GetX()
	y := pdf.GetY()

	// Draw each cell
	for i, txt := range cols {
		pdf.Rect(x, y, widths[i], rowHeight, "")
		pdf.MultiCell(widths[i], lineHeight, txt, "", "L", false)
		x += widths[i]
		pdf.SetXY(x, y)
	}

	pdf.Ln(rowHeight)
}

//pending

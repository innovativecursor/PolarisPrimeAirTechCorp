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

func GenerateSupplierCSV(data []models.Supplier) (string, error) {

	filePath := fmt.Sprintf("/tmp/supplier_report_%d.csv", time.Now().Unix())
	file, err := os.Create(filePath)
	if err != nil {
		return "", err
	}
	defer file.Close()

	writer := csv.NewWriter(file)
	defer writer.Flush()

	writer.Write([]string{
		"Supplier Code", "Supplier Name", "TIN Number",
		"Organization", "Location", "Created At",
	})

	for _, v := range data {
		writer.Write([]string{
			v.SupplierCode,
			v.SupplierName,
			v.TINNumber,
			v.Organization,
			v.Location,
			v.CreatedAt.Format("02 Jan 2006"),
		})
	}

	return filePath, nil
}

func GenerateSupplierExcel(suppliers []models.Supplier) (string, error) {

	f := excelize.NewFile()
	sheet := "Suppliers"

	f.SetSheetName("Sheet1", sheet)

	headers := []string{
		"Supplier Code", "Supplier Name", "TIN Number",
		"Organization", "Location", "Created At",
	}

	for i, h := range headers {
		cell, _ := excelize.CoordinatesToCellName(i+1, 1)
		f.SetCellValue(sheet, cell, h)
	}

	row := 2
	for _, s := range suppliers {
		f.SetCellValue(sheet, fmt.Sprintf("A%d", row), s.SupplierCode)
		f.SetCellValue(sheet, fmt.Sprintf("B%d", row), s.SupplierName)
		f.SetCellValue(sheet, fmt.Sprintf("C%d", row), s.TINNumber)
		f.SetCellValue(sheet, fmt.Sprintf("D%d", row), s.Organization)
		f.SetCellValue(sheet, fmt.Sprintf("E%d", row), s.Location)
		f.SetCellValue(sheet, fmt.Sprintf("F%d", row), s.CreatedAt.Format("02 Jan 2006"))
		row++
	}

	for i := 1; i <= 6; i++ {
		col, _ := excelize.ColumnNumberToName(i)
		f.SetColWidth(sheet, col, col, 22)
	}

	file := fmt.Sprintf("/tmp/supplier_report_%d.xlsx", time.Now().Unix())
	err := f.SaveAs(file)
	return file, err
}

func GenerateSupplierPDF(suppliers []models.Supplier, start, end time.Time) (string, error) {

	pdf := gofpdf.New("P", "mm", "A4", "")
	pdf.SetTitle("Supplier Report", false)
	pdf.AliasNbPages("")

	pdf.SetFooterFunc(func() {
		pdf.SetY(-15)
		pdf.SetFont("Arial", "I", 9)
		pdf.CellFormat(0, 10,
			fmt.Sprintf("Page %d/{nb}", pdf.PageNo()),
			"", 0, "C", false, 0, "")
	})

	pdf.AddPage()

	pdf.SetFont("Arial", "B", 18)
	pdf.CellFormat(0, 10, "SUPPLIER REPORT", "", 1, "C", false, 0, "")
	pdf.Ln(3)

	startDate := start.Format("02 Jan 2006")
	endDate := end.Format("02 Jan 2006")

	pdf.SetFont("Arial", "", 11)
	pdf.CellFormat(0, 6,
		fmt.Sprintf("Date Range: %s - %s", startDate, endDate),
		"", 1, "C", false, 0, "")
	pdf.Ln(5)

	headers := []string{
		"Code", "Name", "TIN", "Organization", "Location", "Created At",
	}

	widths := []float64{25, 40, 25, 40, 40, 25}

	pdf.SetFont("Arial", "B", 11)
	pdf.SetFillColor(0, 0, 0)
	pdf.SetTextColor(255, 255, 255)

	for i, h := range headers {
		pdf.CellFormat(widths[i], 9, h, "1", 0, "C", true, 0, "")
	}
	pdf.Ln(-1)

	pdf.SetFont("Arial", "", 10)
	pdf.SetTextColor(0, 0, 0)

	for _, s := range suppliers {
		cols := []string{
			s.SupplierCode,
			s.SupplierName,
			s.TINNumber,
			s.Organization,
			s.Location,
			s.CreatedAt.Format("02 Jan 2006"),
		}
		MultiCellRow(pdf, cols, widths, 6)
	}

	file := fmt.Sprintf("/tmp/supplier_report_%d.pdf", time.Now().Unix())
	err := pdf.OutputFileAndClose(file)

	return file, err
}

type SalesInvoiceReportRow struct {
	InvoiceID    string
	ProjectName  string
	CustomerName string
	TotalAmount  float64
	CreatedAt    time.Time
}

func GenerateSalesInvoiceCSV(data []SalesInvoiceReportRow) (string, error) {

	filePath := fmt.Sprintf("/tmp/sales_invoice_report_%d.csv", time.Now().Unix())
	file, err := os.Create(filePath)
	if err != nil {
		return "", err
	}
	defer file.Close()

	writer := csv.NewWriter(file)
	defer writer.Flush()

	writer.Write([]string{
		"Invoice ID", "Project", "Customer", "Total Amount", "Created At",
	})

	for _, v := range data {
		writer.Write([]string{
			v.InvoiceID,
			v.ProjectName,
			v.CustomerName,
			fmt.Sprintf("%.2f", v.TotalAmount),
			v.CreatedAt.Format("02 Jan 2006"),
		})
	}

	return filePath, nil
}

func GenerateSalesInvoiceExcel(data []SalesInvoiceReportRow) (string, error) {

	f := excelize.NewFile()
	sheet := "Sales Invoice"
	f.SetSheetName("Sheet1", sheet)

	headers := []string{
		"Invoice ID", "Project", "Customer", "Total Amount", "Created At",
	}

	for i, h := range headers {
		cell, _ := excelize.CoordinatesToCellName(i+1, 1)
		f.SetCellValue(sheet, cell, h)
	}

	row := 2
	for _, v := range data {
		f.SetCellValue(sheet, fmt.Sprintf("A%d", row), v.InvoiceID)
		f.SetCellValue(sheet, fmt.Sprintf("B%d", row), v.ProjectName)
		f.SetCellValue(sheet, fmt.Sprintf("C%d", row), v.CustomerName)
		f.SetCellValue(sheet, fmt.Sprintf("D%d", row), v.TotalAmount)
		f.SetCellValue(sheet, fmt.Sprintf("E%d", row), v.CreatedAt.Format("02 Jan 2006"))
		row++
	}

	for i := 1; i <= 5; i++ {
		col, _ := excelize.ColumnNumberToName(i)
		f.SetColWidth(sheet, col, col, 22)
	}

	file := fmt.Sprintf("/tmp/sales_invoice_report_%d.xlsx", time.Now().Unix())
	err := f.SaveAs(file)
	return file, err
}

func GenerateSalesInvoicePDF(data []SalesInvoiceReportRow, start, end time.Time) (string, error) {

	pdf := gofpdf.New("P", "mm", "A4", "")
	pdf.SetTitle("Sales Invoice Report", false)
	pdf.AliasNbPages("")

	pdf.SetFooterFunc(func() {
		pdf.SetY(-15)
		pdf.SetFont("Arial", "I", 9)
		pdf.CellFormat(0, 10,
			fmt.Sprintf("Page %d/{nb}", pdf.PageNo()),
			"", 0, "C", false, 0, "")
	})

	pdf.AddPage()

	pdf.SetFont("Arial", "B", 18)
	pdf.CellFormat(0, 10, "SALES INVOICE REPORT", "", 1, "C", false, 0, "")
	pdf.Ln(3)

	pdf.SetFont("Arial", "", 11)
	pdf.CellFormat(0, 6,
		fmt.Sprintf("Date Range: %s - %s",
			start.Format("02 Jan 2006"), end.Format("02 Jan 2006")),
		"", 1, "C", false, 0, "")
	pdf.Ln(5)

	headers := []string{
		"Invoice ID", "Project", "Customer", "Total Amount", "Created At",
	}

	widths := []float64{30, 40, 40, 30, 30}

	pdf.SetFont("Arial", "B", 11)
	pdf.SetFillColor(0, 0, 0)
	pdf.SetTextColor(255, 255, 255)

	for i, h := range headers {
		pdf.CellFormat(widths[i], 9, h, "1", 0, "C", true, 0, "")
	}
	pdf.Ln(-1)

	pdf.SetFont("Arial", "", 10)
	pdf.SetTextColor(0, 0, 0)

	for _, v := range data {
		row := []string{
			v.InvoiceID,
			v.ProjectName,
			v.CustomerName,
			fmt.Sprintf("%.2f", v.TotalAmount),
			v.CreatedAt.Format("02 Jan 2006"),
		}
		MultiCellRow(pdf, row, widths, 6)
	}

	file := fmt.Sprintf("/tmp/sales_invoice_report_%d.pdf", time.Now().Unix())
	err := pdf.OutputFileAndClose(file)
	return file, err
}

type FinancialReportRow struct {
	Category    string // Supplier / Sales
	InvoiceNo   string
	ProjectName string
	EntityName  string // Supplier or Customer
	Amount      float64
	Date        time.Time
}

func GenerateFinancialCSV(data []FinancialReportRow) (string, error) {
	filePath := fmt.Sprintf("/tmp/financial_report_%d.csv", time.Now().Unix())
	f, err := os.Create(filePath)
	if err != nil {
		return "", err
	}
	defer f.Close()

	w := csv.NewWriter(f)
	defer w.Flush()

	w.Write([]string{
		"Category", "Invoice No", "Project", "Supplier/Customer", "Amount", "Date",
	})

	for _, v := range data {
		w.Write([]string{
			v.Category,
			v.InvoiceNo,
			v.ProjectName,
			v.EntityName,
			fmt.Sprintf("%.2f", v.Amount),
			v.Date.Format("02 Jan 2006"),
		})
	}

	return filePath, nil
}

func GenerateFinancialExcel(rows []FinancialReportRow) (string, error) {

	f := excelize.NewFile()
	sheet := "Financial"
	f.SetSheetName("Sheet1", sheet)

	headers := []string{"Category", "Invoice No", "Project", "Entity", "Amount", "Date"}

	for i, h := range headers {
		cell, _ := excelize.CoordinatesToCellName(i+1, 1)
		f.SetCellValue(sheet, cell, h)
	}

	row := 2
	for _, v := range rows {
		f.SetCellValue(sheet, fmt.Sprintf("A%d", row), v.Category)
		f.SetCellValue(sheet, fmt.Sprintf("B%d", row), v.InvoiceNo)
		f.SetCellValue(sheet, fmt.Sprintf("C%d", row), v.ProjectName)
		f.SetCellValue(sheet, fmt.Sprintf("D%d", row), v.EntityName)
		f.SetCellValue(sheet, fmt.Sprintf("E%d", row), v.Amount)
		f.SetCellValue(sheet, fmt.Sprintf("F%d", row), v.Date.Format("02 Jan 2006"))
		row++
	}

	filePath := fmt.Sprintf("/tmp/financial_report_%d.xlsx", time.Now().Unix())
	err := f.SaveAs(filePath)
	return filePath, err
}

func GenerateFinancialPDF(rows []FinancialReportRow, start, end time.Time) (string, error) {

	pdf := gofpdf.New("L", "mm", "A4", "")
	pdf.AddPage()
	pdf.SetFont("Arial", "B", 16)
	pdf.Cell(0, 10, "FINANCIAL REPORT")
	pdf.Ln(12)

	pdf.SetFont("Arial", "", 12)
	pdf.Cell(0, 8, fmt.Sprintf("Date Range: %s - %s",
		start.Format("02 Jan 2006"),
		end.Format("02 Jan 2006"),
	))
	pdf.Ln(12)

	headers := []string{"Category", "Invoice No", "Project", "Entity", "Amount", "Date"}
	widths := []float64{30, 35, 60, 60, 30, 30}

	pdf.SetFont("Arial", "B", 11)
	for i, h := range headers {
		pdf.CellFormat(widths[i], 8, h, "1", 0, "C", false, 0, "")
	}
	pdf.Ln(8)

	pdf.SetFont("Arial", "", 10)

	for _, v := range rows {
		cols := []string{
			v.Category,
			v.InvoiceNo,
			v.ProjectName,
			v.EntityName,
			fmt.Sprintf("%.2f", v.Amount),
			v.Date.Format("02 Jan 2006"),
		}
		MultiCellRow(pdf, cols, widths, 6)
	}

	file := fmt.Sprintf("/tmp/financial_report_%d.pdf", time.Now().Unix())
	err := pdf.OutputFileAndClose(file)
	return file, err
}

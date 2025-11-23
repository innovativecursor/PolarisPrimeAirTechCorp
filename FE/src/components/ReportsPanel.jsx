import React, { useState } from "react";

const ReportsPanel = () => {
  const [selectedReportType, setSelectedReportType] = useState("");
  const [dateRange, setDateRange] = useState({
    startDate: "",
    endDate: "",
  });
  const [reportFormat, setReportFormat] = useState("pdf");
  const [isGenerating, setIsGenerating] = useState(false);

  const reportTypes = [
    {
      value: "sales",
      label: "Sales Report",
      description: "Comprehensive sales performance and revenue analysis",
    },
    {
      value: "inventory",
      label: "Inventory Report",
      description: "Stock levels, movements, and inventory valuation",
    },
    {
      value: "customer",
      label: "Customer Report",
      description: "Customer demographics and purchase behavior",
    },
    {
      value: "financial",
      label: "Financial Report",
      description: "Financial statements and accounting summaries",
    },
    {
      value: "regional",
      label: "Regional Performance",
      description: "Performance metrics by geographical regions",
    },
    {
      value: "supplier",
      label: "Supplier Report",
      description: "Supplier performance and procurement analysis",
    },
  ];

  const handleGenerateReport = async () => {
    if (!selectedReportType || !dateRange.startDate || !dateRange.endDate) {
      alert("Please fill in all required fields");
      return;
    }

    setIsGenerating(true);

    // Simulate report generation
    setTimeout(() => {
      setIsGenerating(false);
      alert(
        `${reportTypes.find((r) => r.value === selectedReportType)?.label} generated successfully!`
      );
    }, 2000);
  };

  return (
    <section className="panel-card wide">
      <div className="panel-header">
        <div>
          <p className="eyebrow">Analytics</p>
          <h3>Generate Reports</h3>
          <p className="panel-description">
            Create comprehensive business reports for analysis and decision
            making
          </p>
        </div>
      </div>

      <div className="reports-form">
        <div className="form-grid">
          {/* Report Type Selection */}
          <div className="form-section">
            <h4 className="form-section-title">Report Type</h4>
            <div className="report-types-grid">
              {reportTypes.map((type) => (
                <div
                  key={type.value}
                  className={`report-type-card ${selectedReportType === type.value ? "selected" : ""}`}
                  onClick={() => setSelectedReportType(type.value)}
                >
                  <div className="report-type-header">
                    <input
                      type="radio"
                      name="reportType"
                      value={type.value}
                      checked={selectedReportType === type.value}
                      onChange={() => setSelectedReportType(type.value)}
                    />
                    <h5>{type.label}</h5>
                  </div>
                  <p className="report-type-description">{type.description}</p>
                </div>
              ))}
            </div>
          </div>

          {/* Date Range */}
          <div className="form-section">
            <h4 className="form-section-title">Date Range</h4>
            <div className="date-range-inputs">
              <div className="input-group">
                <label htmlFor="startDate">Start Date</label>
                <input
                  type="date"
                  id="startDate"
                  value={dateRange.startDate}
                  onChange={(e) =>
                    setDateRange((prev) => ({
                      ...prev,
                      startDate: e.target.value,
                    }))
                  }
                  className="form-input"
                />
              </div>
              <div className="input-group">
                <label htmlFor="endDate">End Date</label>
                <input
                  type="date"
                  id="endDate"
                  value={dateRange.endDate}
                  onChange={(e) =>
                    setDateRange((prev) => ({
                      ...prev,
                      endDate: e.target.value,
                    }))
                  }
                  className="form-input"
                />
              </div>
            </div>
          </div>

          {/* Report Format */}
          <div className="form-section">
            <h4 className="form-section-title">Export Format</h4>
            <div className="format-options">
              <label className="format-option">
                <input
                  type="radio"
                  name="format"
                  value="pdf"
                  checked={reportFormat === "pdf"}
                  onChange={(e) => setReportFormat(e.target.value)}
                />
                <span className="format-label">
                  <strong>PDF</strong>
                  <small>Formatted document for printing</small>
                </span>
              </label>
              <label className="format-option">
                <input
                  type="radio"
                  name="format"
                  value="excel"
                  checked={reportFormat === "excel"}
                  onChange={(e) => setReportFormat(e.target.value)}
                />
                <span className="format-label">
                  <strong>Excel</strong>
                  <small>Spreadsheet for data analysis</small>
                </span>
              </label>
              <label className="format-option">
                <input
                  type="radio"
                  name="format"
                  value="csv"
                  checked={reportFormat === "csv"}
                  onChange={(e) => setReportFormat(e.target.value)}
                />
                <span className="format-label">
                  <strong>CSV</strong>
                  <small>Raw data for import</small>
                </span>
              </label>
            </div>
          </div>
        </div>

        {/* Generate Button */}
        <div className="form-actions">
          <button
            type="button"
            className={`primary-btn generate-btn ${isGenerating ? "generating" : ""}`}
            onClick={handleGenerateReport}
            disabled={isGenerating}
          >
            {isGenerating ? (
              <>
                <span className="spinner"></span>
                Generating Report...
              </>
            ) : (
              "Generate Report"
            )}
          </button>
        </div>
      </div>
    </section>
  );
};

export default ReportsPanel;

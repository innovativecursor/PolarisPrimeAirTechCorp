import { ReportForm } from "../hooks/useGenerateReport";

type Props = {
  form: ReportForm;
  loading: boolean;
  onChange: <K extends keyof ReportForm>(key: K, value: ReportForm[K]) => void;
  onSubmit: () => void;
};

const REPORT_TYPES = [
  {
    key: "sales",
    title: "Sales Report",
    desc: "Comprehensive sales performance and revenue analysis",
  },
  {
    key: "inventory",
    title: "Inventory Report",
    desc: "Stock levels, movements, and inventory valuation",
  },
  {
    key: "customer",
    title: "Customer Report",
    desc: "Customer demographics and purchase behavior",
  },
  {
    key: "financial",
    title: "Financial Report",
    desc: "Financial statements and accounting summaries",
  },
  {
    key: "supplier",
    title: "Supplier Report",
    desc: "Supplier performance and procurement analysis",
  },
];

export default function GenerateReportCard({
  form,
  loading,
  onChange,
  onSubmit,
}: Props) {
  return (
    <>
      <div className="space-y-4 bg-[#f8fafc] md:p-6 p-2 rounded-lg border border-slate-200">
        <h3 className="text-lg font-semibold text-slate-900">Report Type</h3>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
          {REPORT_TYPES.map((r) => {
            const isSelected = form.reportType === r.key;

            return (
              <label
                key={r.key}
                className={`cursor-pointer rounded-md border-2 p-4 transition-all duration-300 ease-out
          ${
            isSelected
              ? "border-blue-500 bg-blue-50"
              : "border-slate-200 bg-white hover:border-blue-500"
          }
        `}
              >
                <div className="flex items-center gap-2">
                  <input
                    type="radio"
                    checked={isSelected}
                    onChange={() => onChange("reportType", r.key)}
                    className="accent-blue-500"
                  />
                  <p className="text-base font-medium">{r.title}</p>
                </div>

                <p className="mt-1 lg:text-sm text-xs tracking-wide max-w-11/12 transition-colors opacity-70  duration-300">
                  {r.desc}
                </p>
              </label>
            );
          })}
        </div>
      </div>

      <div className="space-y-4 bg-[#f8fafc] md:p-6 p-2 rounded-lg border border-slate-200">
        <h3 className="text-lg font-semibold text-slate-900">Date Range</h3>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <div className="flex flex-col gap-2">
            <label className="text-sm font-medium text-slate-700">
              Start Date
            </label>

            <input
              type="date"
              value={form.startDate}
              onChange={(e) => onChange("startDate", e.target.value)}
              className="border  cursor-pointer rounded-sm px-3 py-3 text-sm bg-white"
            />
          </div>
          <div className="flex flex-col gap-2">
            <label className="text-sm font-medium text-slate-700">
              End Date
            </label>

            <input
              type="date"
              value={form.endDate}
              onChange={(e) => onChange("endDate", e.target.value)}
              className="border  cursor-pointer rounded-sm px-3 py-3 text-sm bg-white"
            />
          </div>
        </div>
      </div>

      <div className="space-y-4 bg-[#f8fafc] md:p-6 p-2 rounded-lg border border-slate-200">
        <h3 className="text-lg font-semibold text-slate-900">Export Format</h3>

        <div className="flex lg:flex-row flex-wrap gap-4">
          {(
            [
              {
                key: "pdf",
                title: "PDF",
                desc: "Formatted document for printing",
              },
              {
                key: "excel",
                title: "Excel",
                desc: "Spreadsheet for data analysis",
              },
              {
                key: "csv",
                title: "CSV",
                desc: "Raw data for import",
              },
            ] as const
          ).map((f) => {
            const isSelected = form.exportType === f.key;

            return (
              <label
                key={f.key}
                className={`cursor-pointer w-64 rounded-lg border-2 p-4 transition-all duration-300 ease-out
            ${
              isSelected
                ? "border-blue-500 bg-blue-50"
                : "border-slate-200 bg-white hover:border-blue-500"
            }
          `}
              >
                <div className="flex items-center gap-3">
                  <input
                    type="radio"
                    checked={isSelected}
                    onChange={() => onChange("exportType", f.key)}
                    className="mt-1 accent-blue-500"
                  />

                  <div>
                    <p className="text-sm tracking-wide font-semibold text-slate-900">
                      {f.title}
                    </p>
                    <p className="text-xs tracking-wide text-slate-500 mt-0.5">
                      {f.desc}
                    </p>
                  </div>
                </div>
              </label>
            );
          })}
        </div>
      </div>

      <div className="flex justify-center">
        <button
          onClick={onSubmit}
          disabled={loading}
          className="rounded-lg cursor-pointer bg-[#1e2b5c] px-8 py-2 lg:text-lg font-semibold text-white disabled:opacity-60"
        >
          {loading ? "Generating..." : "Generate Report"}
        </button>
      </div>
    </>
  );
}

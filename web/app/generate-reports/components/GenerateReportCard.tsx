// export default function GenerateReportsCard() {
//     return <div>Generate Report Card</div>;
// }



import { ReportForm } from "../hooks/useGenerateReport";

type Props = {
  form: ReportForm;
  loading: boolean;
  error: string | null;
  onChange: <K extends keyof ReportForm>(
    key: K,
    value: ReportForm[K]
  ) => void;
  onSubmit: () => void;
};

const REPORT_TYPES = [
  { key: "sales", title: "Sales Report", desc: "Sales performance analysis" },
  { key: "inventory", title: "Inventory Report", desc: "Stock & valuation" },
  { key: "customer", title: "Customer Report", desc: "Customer behaviour" },
  { key: "financial", title: "Financial Report", desc: "Financial summaries" },
  { key: "regional", title: "Regional Performance", desc: "Region metrics" },
  { key: "supplier", title: "Supplier Report", desc: "Supplier analysis" },
];

export default function GenerateReportCard({
  form,
  loading,
  error,
  onChange,
  onSubmit,
}: Props) {
  return (
    <section className="rounded-[24px] bg-white border border-slate-200 px-8 py-8 space-y-8">
      {/* Header */}
      <div>
        <p className="text-xs font-semibold tracking-[0.24em] uppercase text-slate-400">
          Analytics
        </p>
        <h2 className="text-xl font-semibold text-slate-900">
          Generate Reports
        </h2>
        <p className="text-sm text-slate-600">
          Create comprehensive business reports for analysis
        </p>
      </div>

      {error && (
        <p className="text-sm text-rose-600 bg-rose-50 border border-rose-200 rounded-lg px-3 py-2">
          {error}
        </p>
      )}

      {/* Report Type */}
      <div className="space-y-4">
        <h3 className="text-sm font-semibold text-slate-900">
          Report Type
        </h3>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          {REPORT_TYPES.map((r) => (
            <label
              key={r.key}
              className={`cursor-pointer rounded-xl border p-4 ${
                form.reportType === r.key
                  ? "border-blue-500 bg-blue-50"
                  : "border-slate-200"
              }`}
            >
              <input
                type="radio"
                className="mr-2"
                checked={form.reportType === r.key}
                onChange={() => onChange("reportType", r.key)}
              />
              <div>
                <p className="text-sm font-medium">{r.title}</p>
                <p className="text-xs text-slate-500">{r.desc}</p>
              </div>
            </label>
          ))}
        </div>
      </div>

      {/* Date Range */}
      <div className="space-y-4">
        <h3 className="text-sm font-semibold text-slate-900">
          Date Range
        </h3>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <input
            type="date"
            value={form.startDate}
            onChange={(e) => onChange("startDate", e.target.value)}
            className="border rounded-lg px-3 py-2 text-sm"
          />
          <input
            type="date"
            value={form.endDate}
            onChange={(e) => onChange("endDate", e.target.value)}
            className="border rounded-lg px-3 py-2 text-sm"
          />
        </div>
      </div>

      {/* Export Type */}
      <div className="space-y-4">
        <h3 className="text-sm font-semibold text-slate-900">
          Export Format
        </h3>

        <div className="flex gap-4">
          {(["pdf", "excel", "csv"] as const).map((f) => (
            <label
              key={f}
              className={`cursor-pointer rounded-xl border p-4 w-40 ${
                form.exportType === f
                  ? "border-blue-500 bg-blue-50"
                  : "border-slate-200"
              }`}
            >
              <input
                type="radio"
                className="mr-2"
                checked={form.exportType === f}
                onChange={() => onChange("exportType", f)}
              />
              {f.toUpperCase()}
            </label>
          ))}
        </div>
      </div>

      {/* Button */}
      <div className="flex justify-center">
        <button
          onClick={onSubmit}
          disabled={loading}
          className="rounded-full bg-[#1f285c] px-8 py-3 text-sm font-semibold text-white disabled:opacity-60"
        >
          {loading ? "Generating..." : "Generate Report"}
        </button>
      </div>
    </section>
  );
}

"use client";

import AppShell from "../components/layout/AppShell";
import GenerateReportCard from "./components/GenerateReportCard";
import useGenerateReport from "./hooks/useGenerateReport";

export default function GenerateReportsPage() {
  const { form, loading, error, setField, submitReport } = useGenerateReport();

  return (
    <AppShell>
      <div className="space-y-6">
        <section className=" bg-white border border-slate-200  md:rounded-[32px] rounded-md md:px-8 px-4 py-8 space-y-8 overflow-hidden">
          <div className="space-y-3">
            <p className="text-xs font-semibold tracking-[0.24em] uppercase text-slate-400">
              Analytics
            </p>
            <h2 className="text-xl font-semibold text-slate-900">
              Generate Reports
            </h2>
            <p className="">
              Create comprehensive business reports for analysis
            </p>
          </div>
          {error && (
            <p className="text-sm text-rose-600 bg-rose-50 border border-rose-200 rounded-lg px-3 py-2">
              {error}
            </p>
          )}

          <GenerateReportCard
            form={form}
            loading={loading}
            onChange={setField}
            onSubmit={submitReport}
          />
        </section>
      </div>
    </AppShell>
  );
}

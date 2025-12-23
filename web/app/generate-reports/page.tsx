"use client";
import { useAuth } from "../components/auth/AuthContext";
import AppShell from "../components/layout/AppShell";
import GenerateReportCard from "./components/GenerateReportCard";
import useGenerateReport from "./hooks/useGenerateReport";

export default function GenerateReportsPage() {
  const { user } = useAuth();
  const displayName = user?.name || user?.email || "Admin";
  const { form, loading, error, setField, submitReport } = useGenerateReport();

  return (
    <AppShell>
      <div className="space-y-6">
        <header className="flex flex-col gap-3 md:flex-row md:items-center md:justify-between">
          <div>
            <p className="text-xs font-semibold tracking-[0.2em] uppercase text-slate-400">
              Operations overview
            </p>
            <h1 className="mt-1 text-2xl md:text-3xl font-semibold text-slate-900">
              Polaris Prime Air Tech Corp
            </h1>
          </div>
          <div className="text-xs text-slate-500 text-right">
            <p className="uppercase tracking-[0.16em] text-slate-400 mb-1">
              Welcome back
            </p>
            <p className="font-medium text-slate-700">{displayName}</p>
          </div>
        </header>

        <section className="rounded-[24px] bg-white border border-slate-200 px-8 py-8 space-y-8 overflow-hidden">
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

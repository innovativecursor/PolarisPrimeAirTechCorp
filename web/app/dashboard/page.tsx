"use client";

import { useAuth } from "../components/auth/AuthContext";
import DonutChart from "../components/charts/DonutChart";
import LineChart from "../components/charts/LineChart";
import AppShell from "../components/layout/AppShell";

export default function DashboardPage() {
  const { user } = useAuth();
  const displayName = user?.name || user?.email || "Admin";

  return (
    <AppShell>
      <div className="space-y-6">
        {/* Top header */}
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

        {/* Top stat cards */}
        <section className="grid gap-4 md:grid-cols-4">
          <StatCard
            label="Available units"
            value="4,382"
            subtitle="Ready for deployment"
            delta="+3.2% vs last week"
          />
          <StatCard
            label="Open sales orders"
            value="128"
            subtitle="Awaiting fulfilment"
            delta="12 urgent"
          />
          <StatCard
            label="Receiving this week"
            value="26"
            subtitle="Inbound shipments"
            delta="8 customs hold"
          />
          <StatCard
            label="Total deliveries"
            value="2,416"
            subtitle="Completed YTD"
            delta="+184 vs plan"
          />
        </section>

        {/* Middle row: line chart + donut */}
        <section className="grid gap-4 lg:grid-cols-2 w-full">
          {/* Line chart */}
          <div className="rounded-2xl bg-white border border-slate-100 shadow-sm p-5 md:p-6">
            <div className="flex items-center justify-between mb-4">
              <h2 className="text-sm font-semibold text-slate-900">
                Monthly sales performance
              </h2>
              <p className="text-xs text-slate-400">Sales this year (₱)</p>
            </div>

            <div className="h-56 rounded-xl">
              <LineChart />
            </div>
          </div>

          {/* Donut */}
          <div className="rounded-2xl bg-white border border-slate-100 shadow-sm p-5 md:p-6 flex flex-col">
            <div className="flex items-center justify-between mb-4">
              <h2 className="text-sm font-semibold text-slate-900">
                Customer distribution by region
              </h2>
            </div>

            <div className="flex flex-1 items-center gap-6">
              <div className="flex-1 h-40">
                <DonutChart />
              </div>

              <div className="flex-1 space-y-2 text-xs">
                {[
                  "Metro Manila",
                  "Cebu",
                  "Central Luzon",
                  "Western Visayas",
                  "Northern Mindanao",
                  "Others",
                ].map((name, idx) => (
                  <div key={name} className="flex items-center gap-2">
                    <span
                      className="h-2.5 w-2.5 rounded-full"
                      style={{
                        backgroundColor: [
                          "#2563eb",
                          "#f97316",
                          "#22c55e",
                          "#eab308",
                          "#8b5cf6",
                          "#64748b",
                        ][idx],
                      }}
                    />
                    <span className="text-slate-600">{name}</span>
                  </div>
                ))}
              </div>
            </div>
          </div>
        </section>

        {/* Bottom 3 cards */}
        <section className="grid gap-4 lg:grid-cols-3">
          {/* Inventory */}
          <div className="rounded-2xl bg-white border border-slate-100 shadow-sm p-5 md:p-6 flex flex-col">
            <div className="flex items-start justify-between mb-4">
              <h2 className="text-sm font-semibold text-slate-900">
                Inventory position
              </h2>
              <p className="text-xs text-slate-400">Week 24</p>
            </div>

            <dl className="space-y-1.5 text-sm text-slate-600">
              <div className="flex justify-between">
                <dt>Window aircon</dt>
                <dd>1,102 units</dd>
              </div>
              <div className="flex justify-between">
                <dt>Ducted splits</dt>
                <dd>728 units</dd>
              </div>
              <div className="flex justify-between">
                <dt>Condenser units</dt>
                <dd>2,008 units</dd>
              </div>
              <div className="flex justify-between">
                <dt>Centralized units</dt>
                <dd>442 units</dd>
              </div>
            </dl>

            <button className="mt-6 inline-flex w-max items-center justify-center rounded-full bg-slate-900 text-white px-3.5 py-1.5 text-xs font-semibold shadow-sm hover:bg-slate-800">
              View full inventory
            </button>
          </div>

          {/* Warehousing */}
          <div className="rounded-2xl bg-white border border-slate-100 shadow-sm p-5 md:p-6 flex flex-col">
            <div className="flex items-start justify-between mb-4">
              <h2 className="text-sm font-semibold text-slate-900">
                Warehousing updates
              </h2>
              <p className="text-xs text-slate-400">Live feed</p>
            </div>

            <ul className="space-y-3 text-sm text-slate-600">
              <li>
                <p className="font-medium text-slate-800">Cavite receiving</p>
                <p className="text-xs text-slate-400 mt-0.5">
                  12 condensing units checked in, 2 flagged for QA.
                </p>
              </li>
              <li>
                <p className="font-medium text-slate-800">Inventory audit</p>
                <p className="text-xs text-slate-400 mt-0.5">
                  Cycle count complete for VRF modules, variance 0.4%.
                </p>
              </li>
              <li>
                <p className="font-medium text-slate-800">
                  Supplier onboarding
                </p>
                <p className="text-xs text-slate-400 mt-0.5">
                  MetroCool contract finalised, ready for PO release.
                </p>
              </li>
            </ul>
          </div>

          {/* Fulfilment pipeline */}
          <div className="rounded-2xl bg-white border border-slate-100 shadow-sm p-5 md:p-6 flex flex-col">
            <div className="flex items-start justify-between mb-4">
              <h2 className="text-sm font-semibold text-slate-900">
                Fulfilment pipeline
              </h2>
              <p className="text-xs text-slate-400">Past 7 days</p>
            </div>

            <div className="rounded-xl border border-slate-100 overflow-hidden">
              <div className="grid grid-cols-[2fr,1fr,1fr] bg-slate-50 text-[11px] font-semibold text-slate-500 px-3 py-2">
                <span>Stage</span>
                <span className="text-right">Volume</span>
                <span className="text-right">Status</span>
              </div>

              {[
                { stage: "Sales orders", volume: 38, status: "Approved" },
                { stage: "Awaiting shipment", volume: 19, status: "Pending" },
                { stage: "Pending invoicing", volume: 11, status: "Pending" },
              ].map((row, idx) => (
                <div
                  key={row.stage}
                  className={`grid grid-cols-[2fr,1fr,1fr] px-3 py-2.5 text-xs text-slate-600 ${
                    idx % 2 === 1 ? "bg-slate-50/60" : "bg-white"
                  }`}
                >
                  <span>{row.stage}</span>
                  <span className="text-right">{row.volume}</span>
                  <span
                    className={`text-right font-medium ${
                      row.status === "Approved"
                        ? "text-emerald-500"
                        : "text-amber-500"
                    }`}
                  >
                    {row.status}
                  </span>
                </div>
              ))}
            </div>
          </div>
        </section>
      </div>
    </AppShell>
  );
}

type StatCardProps = {
  label: string;
  value: string;
  subtitle: string;
  delta: string;
};

function StatCard({ label, value, subtitle, delta }: StatCardProps) {
  return (
    <div className="rounded-2xl bg-white border border-slate-100 shadow-sm px-5 py-4 flex flex-col gap-1.5">
      <p className="text-xs font-medium text-slate-500">{label}</p>
      <p className="text-2xl font-semibold text-slate-900">{value}</p>
      <p className="text-xs text-slate-400">{subtitle}</p>
      <p className="mt-1 text-[11px] font-medium text-slate-500">{delta}</p>
    </div>
  );
}

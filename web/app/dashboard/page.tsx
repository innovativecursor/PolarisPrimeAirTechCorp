"use client";

import { useEffect } from "react";
import DonutChart from "../components/charts/DonutChart";
import LineChart from "../components/charts/LineChart";
import AppShell from "../components/layout/AppShell";
import { useDashboard } from "./hooks/useDashboard";
import StatCardSkeleton from "../components/skeletons/StatCardSkeleton";
import ChartSkeleton from "../components/skeletons/ChartSkeleton";

export default function DashboardPage() {
  const { dashboard, loading, getDashboard } = useDashboard();

  useEffect(() => {
    void getDashboard();
  }, []);

  console.log(dashboard, "llll");

  return (
    <AppShell>
      <div className="space-y-6">
        {/* Top stat cards */}
        <section className="grid gap-4 cursor-pointer md:grid-cols-4">
          {loading ? (
            <>
              <StatCardSkeleton />
              <StatCardSkeleton />
              <StatCardSkeleton />
              <StatCardSkeleton />
            </>
          ) : (
            <>
              <StatCard
                label="Available units"
                value={dashboard?.available_units?.toString() ?? "0"}
                subtitle="Ready for deployment"
                delta=""
              />
              <StatCard
                label="Open sales orders"
                value={dashboard?.open_sales_orders?.toString() ?? "0"}
                subtitle="Awaiting fulfilment"
                delta=""
              />
              <StatCard
                label="Receiving this week"
                value={dashboard?.receiving_this_week?.toString() ?? "0"}
                subtitle="Inbound shipments"
                delta=""
              />
              <StatCard
                label="Total deliveries"
                value={dashboard?.total_deliveries?.toString() ?? "0"}
                subtitle="Completed YTD"
                delta=""
              />
            </>
          )}
        </section>

        {/* Middle row: line chart + donut */}
        <section className="grid gap-4 cursor-pointer lg:grid-cols-2 w-full">
          <div className="rounded-2xl bg-white border border-slate-100 shadow-sm p-5 md:p-6">
            <div className="flex items-center justify-between mb-4">
              <h2 className="text-sm font-semibold text-slate-900">
                Monthly sales performance
              </h2>
              <p className="text-xs text-slate-400">Sales this year (₱)</p>
            </div>

            <div className="h-56 rounded-xl">
              {loading ? (
                <ChartSkeleton height="h-56" />
              ) : (
                <LineChart data={dashboard?.monthly_sales ?? []} />
              )}
            </div>
          </div>

          <div className="rounded-2xl bg-white border border-slate-100 shadow-sm p-5 md:p-6 flex flex-col">
            <div className="flex items-center justify-between mb-4">
              <h2 className="text-sm font-semibold text-slate-900">
                Customer distribution by region
              </h2>
            </div>

            <div className="flex md:flex-1 flex-col items-center gap-6">
              <div className="flex-1 h-40 w-full">
                {loading ? (
                  <ChartSkeleton height="h-40" />
                ) : (
                  <DonutChart data={dashboard?.customers_by_city ?? []} />
                )}
              </div>

              <div className="flex-1 space-y-2 text-xs w-full">
                {loading ? (
                  <div className="flex flex-col justify-center  items-center">
                    <div className="h-3 w-24 bg-slate-200 rounded animate-pulse" />
                    <div className="h-3 w-28 bg-slate-200 rounded animate-pulse" />
                    <div className="h-3 w-20 bg-slate-200 rounded animate-pulse" />
                  </div>
                ) : (
                  <div className="flex flex-col items-center justify-center gap-x-6 gap-y-2">
                    {dashboard?.customers_by_city.map((item, idx) => (
                      <div
                        key={item.city}
                        className="flex items-center gap-2 whitespace-nowrap"
                      >
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
                            ][idx % 6],
                          }}
                        />
                        <span className="text-slate-600 text-xs">
                          {item.city} ({item.count})
                        </span>
                      </div>
                    ))}

                    {dashboard?.customers_by_city.length === 0 && (
                      <p className="text-slate-400 text-xs">No customer data</p>
                    )}
                  </div>
                )}
              </div>
            </div>
          </div>
        </section>

        {/* Bottom 3 cards */}
        {/* <section className="grid gap-4 cursor-pointer lg:grid-cols-3">
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
        </section> */}
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

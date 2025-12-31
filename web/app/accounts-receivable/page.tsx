"use client";
import { useState } from "react";
import { useAuth } from "../components/auth/AuthContext";
import { FileText, Truck } from "lucide-react";
import AppShell from "../components/layout/AppShell";
import AccountsDr from "./components/accountdr/AccountsDr";
import AccountsSales from "./components/accountsales/AccountsSales";

export default function WarehousingPage() {
  const { user } = useAuth();
  const displayName = user?.name || user?.email || "Admin";
  const [activeSection, setActiveSection] = useState<string | null>(null);

  const billingCards = [
    {
      key: "invoice",
      title: "Sales Invoice",
      desc: "Issue invoices against fulfilled orders..",
      statLabel: "Invoices sent",
      statValue: "214",
      icon: FileText,
      component: <AccountsSales />,
    },
    {
      key: "delivery",
      title: "Delivery Receipt",
      desc: "Confirm shipments handed to customers",
      statLabel: "Receipts issued",
      statValue: "189",
      icon: Truck,
      component: <AccountsDr />,
    },
  ];

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

        <section className="rounded-[24px] bg-white border border-slate-200 px-8 py-8 space-y-10 overflow-hidden">
          {activeSection === null ? (
            <>
              <div className="space-y-3">
                <p className="text-xs font-semibold tracking-[0.24em] uppercase text-slate-400">
                  Accounts Receivable
                </p>
                <h2 className="text-xl font-semibold text-slate-900">
                  Billing & Dispatch
                </h2>
              </div>
              {/* Cards */}
              <div className="space-y-6">
                {billingCards.map((item) => {
                  const Icon = item.icon;

                  return (
                    <div
                      key={item.key}
                      onClick={() => setActiveSection(item?.key)}
                      className="flex items-center justify-between rounded-[18px] border cursor-pointer border-slate-300 bg-white px-6 py-6 hover:shadow-lg transition"
                    >
                      <div className="flex items-center gap-4">
                        <div className="h-10 w-10 rounded-full border border-slate-200 flex items-center justify-center text-slate-700">
                          <Icon size={18} />
                        </div>

                        <div className="tracking-wide">
                          <h3 className="text-xl font-semibold text-slate-900">
                            {item.title}
                          </h3>
                          <p className="text-sm font-normal  mt-1">
                            {item.desc}
                          </p>
                        </div>
                      </div>

                      <div className="text-right">
                        <p className="text-[11px] uppercase tracking-widest text-slate-400">
                          {item.statLabel}
                        </p>
                        <p className="text-2xl font-semibold text-slate-900 mt-1">
                          {item.statValue}
                        </p>
                      </div>
                    </div>
                  );
                })}
              </div>
            </>
          ) : (
            <>
              <button
                onClick={() => setActiveSection(null)}
                className="mb-6 text-sm font-medium cursor-pointer text-slate-600 hover:text-slate-900"
              >
                ← Back to Billing & Dispatch
              </button>

              {billingCards.find((c) => c.key === activeSection)?.component}
            </>
          )}
        </section>
      </div>
    </AppShell>
  );
}

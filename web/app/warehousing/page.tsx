"use client";
import { useState } from "react";
import { useAuth } from "../components/auth/AuthContext";
import AppShell from "../components/layout/AppShell";
import { PackageCheck, Boxes, UserPlus, FileText, Truck } from "lucide-react";
import Inventory from "./components/inventory/Inventory";
import AddSupplier from "./components/addsupplier/AddSupplier";
import SalesInvoice from "./components/salesinvoice/SalesInvoice";
import ReceivingReport from "./components/receivingreport/ReceivingReport";
import DeliveryReceipt from "./components/deliveryreceipt/DeliveryReceipt";

export default function WarehousingPage() {
  const { user } = useAuth();
  const displayName = user?.name || user?.email || "Admin";
  const [activeSection, setActiveSection] = useState<string | null>(null);

  const warehouseCards = [
    {
      key: "invoice",
      title: "Sales Invoice",
      desc: "Prepare invoices from the warehouse.",
      statLabel: "Invoices sent",
      statValue: "214",
      icon: FileText,
      component: <SalesInvoice />,
    },
    {
      key: "delivery",
      title: "Delivery Receipt",
      desc: "Track items released from the warehouse.",
      statLabel: "Receipts issued",
      statValue: "189",
      icon: Truck,
      component: <DeliveryReceipt />,
    },

    {
      key: "supplier",
      title: "Add Supplier",
      desc: "Register a new vendor for purchasing.",
      statLabel: "Active suppliers",
      statValue: "62",
      icon: UserPlus,
      component: <AddSupplier />,
    },

    {
      key: "receiving",
      title: "Receiving Report",
      desc: "Log deliveries as they arrive at the depot.",
      statLabel: "Total logged",
      statValue: "148",
      icon: PackageCheck,
      component: <ReceivingReport />,
    },
    {
      key: "inventory",
      title: "Inventory",
      desc: "Review on-hand stock across locations.",
      statLabel: "Units on hand",
      statValue: "4,382",
      icon: Boxes,
      component: <Inventory />,
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
                  Warehousing
                </p>
                <h2 className="text-xl font-semibold text-slate-900">
                  Warehouse Operations
                </h2>
              </div>
              {/* Cards */}
              <div className="space-y-6">
                {warehouseCards.map((item) => {
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
                ← Back to Warehouse Operations
              </button>

              {warehouseCards.find((c) => c.key === activeSection)?.component}
            </>
          )}
        </section>
      </div>
    </AppShell>
  );
}

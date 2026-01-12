"use client";

import { useEffect } from "react";
import AppShell from "../components/layout/AppShell";
import { useConfirmToast } from "../hooks/useConfirmToast";
import CreateSalesOrderCard from "./components/CreateSalesOrderCard";
import SalesOrdersListCard from "./components/SalesOrdersListCard";
import { useSalesOrders } from "./hooks/useSalesOrders";
import { useAuth } from "../components/auth/AuthContext";

export default function SalesOrdersPage() {
  const so = useSalesOrders();
  const confirmToast = useConfirmToast();
  const { user } = useAuth();
  const displayName = user?.name || user?.email || "Admin";
  const handleDelete = (row: any) => {
    confirmToast.confirm({
      title: "Delete Sales Order",
      message: `Delete sales order "${row.salesOrderId}"?`,
      confirmText: "Delete",
      cancelText: "Cancel",
      onConfirm: () => so.deleteOrder(row),
    });
  };

  useEffect(() => {
    so.loadProjectName();
  }, []);

  return (
    <AppShell>
      <div className="space-y-6">
        <header className="flex flex-col gap-3 md:flex-row md:items-center md:justify-between">
          <div>
            <p className="text-xs font-semibold tracking-[0.2em] uppercase text-slate-400">
              Supplier Purchase Orders
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

        {so.mode === "list" ? (
          <SalesOrdersListCard
            loading={so.loading}
            orders={so.orders}
            onCreate={() => {
              so.setEditing(null);
              so.setMode("create");
            }}
            onEdit={so.editOrder}
            onDelete={handleDelete}
          />
        ) : (
          <CreateSalesOrderCard
            saving={so.saving}
            initialValues={so.editing ?? undefined}
            projectsName={so.projectName}
            customers={so.customers}
            aircons={so.aircons}
            onCancel={() => {
              so.setMode("list");
              so.setEditing(null);
            }}
            onSubmit={so.saveOrder}
            loadCustomerByProject={so.loadCustomerByProject}
          />
        )}
      </div>
    </AppShell>
  );
}

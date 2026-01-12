"use client";

import { useAuth } from "../components/auth/AuthContext";
import AppShell from "../components/layout/AppShell";
import { useConfirmToast } from "../hooks/useConfirmToast";
import CustomerFormCard from "./components/CustomerFormCard";
import CustomersListCard from "./components/CustomersListCard";
import { CustomerRow, useCustomers } from "./hooks/useCustomers";

export default function CustomersPage() {
  const {
    mode,
    customers,
    loading,
    saving,
    editing,
    setMode,
    setEditing,
    saveCustomer,
    deleteCustomer,
  } = useCustomers();
  const confirmToast = useConfirmToast();
  const { user } = useAuth();
  const displayName = user?.name || user?.email || "Admin";
  const handleDelete = (row: CustomerRow) => {
    confirmToast.confirm({
      title: "Delete Customer",
      message: `Are you sure you want to delete "${row.name}"?`,
      confirmText: "Delete",
      cancelText: "Cancel",
      onConfirm: async () => {
        await deleteCustomer(row.id);
      },
    });
  };

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

        {mode === "list" ? (
          <CustomersListCard
            customers={customers}
            loading={loading}
            onCreate={() => {
              setEditing(null);
              setMode("create");
            }}
            onEdit={(row) => {
              setEditing(row);
              setMode("create");
            }}
            onDelete={handleDelete}
          />
        ) : (
          <CustomerFormCard
            saving={saving}
            initialValues={editing ?? undefined}
            onCancel={() => {
              setMode("list");
              setEditing(null);
            }}
            onSubmit={saveCustomer}
          />
        )}
      </div>
    </AppShell>
  );
}

"use client";

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
    </AppShell>
  );
}

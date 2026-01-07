"use client";

import { useEffect } from "react";
import AppShell from "../components/layout/AppShell";
import { useConfirmToast } from "../hooks/useConfirmToast";
import { useProjects } from "../projects/hooks/useProjects";
import CreateSalesOrderCard from "./components/CreateSalesOrderCard";
import SalesOrdersListCard from "./components/SalesOrdersListCard";
import { useSalesOrders } from "./hooks/useSalesOrders";

export default function SalesOrdersPage() {
  const so = useSalesOrders();
  const confirmToast = useConfirmToast();
  const { loadProjects, page } = useProjects();

  const handleDelete = (row: any) => {
    confirmToast.confirm({
      title: "Delete Sales Order",
      message: `Delete sales order "${row.id}"?`,
      confirmText: "Delete",
      cancelText: "Cancel",
      onConfirm: () => so.deleteOrder(row),
    });
  };

  useEffect(() => {
    loadProjects();
  }, [page]);

  return (
    <AppShell>
      {so.mode === "list" ? (
        <SalesOrdersListCard
          loading={so.loading || so.saving}
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
          projects={so.projects}
          customers={so.customers}
          aircons={so.aircons}
          onCancel={() => {
            so.setMode("list");
            so.setEditing(null);
          }}
          onSubmit={so.saveOrder}
        />
      )}
    </AppShell>
  );
}

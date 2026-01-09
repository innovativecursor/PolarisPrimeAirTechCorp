import CreateSalesInvioce from "./CreateSalesInvoice";
import { useSalesInvoice } from "./hooks/useSalesInvoice";

import SalesInvioceList from "./SalesInvoiceList";
import { useCallback, useEffect } from "react";
import { useSupplier } from "../addsupplier/hooks/useSupplier";
import { useConfirmToast } from "@/app/hooks/useConfirmToast";
import { SupplierInvoice } from "./type";
import { useSalesOrders } from "@/app/sales-orders/hooks/useSalesOrders";

export default function SalesInvioce() {
  const salesInvoice = useSalesInvoice();
  const { loadProjectName, projectName } = useSalesOrders();
  const { GetSupplier, allSupplier } = useSupplier();
  const confirmToast = useConfirmToast();
  useEffect(() => {
    void loadProjectName();
    void GetSupplier();
    void salesInvoice.GetSalesInvoice(1, true);
  }, []);

  const handleDelete = useCallback(
    (invoice: SupplierInvoice) => {
      confirmToast.confirm({
        title: "Delete Invoice",
        message: `Are you sure you want to delete invoice "${invoice.invoice_no}"?`,
        confirmText: "Delete",
        cancelText: "Cancel",
        onConfirm: async () => {
          await salesInvoice.deleteSalesInvoice(invoice._id);
        },
      });
    },
    [salesInvoice.deleteSalesInvoice, confirmToast]
  );

  return (
    <div className="space-y-6">
      {salesInvoice.mode === "list" ? (
        <SalesInvioceList
          onCreate={() => salesInvoice.setMode("create")}
          loading={salesInvoice.loading}
          allSalesInvoice={salesInvoice.allSalesInvoice}
          onEdit={(id) => {
            salesInvoice.setEditing(id);
            salesInvoice.setMode("create");
          }}
          onDelete={handleDelete}
          page={salesInvoice.page}
          totalPages={salesInvoice.totalPages}
          onPageChange={(p) => {
            salesInvoice.setPage(p);
            salesInvoice.GetSalesInvoice(p, true);
          }}
        />
      ) : (
        <CreateSalesInvioce
          {...salesInvoice}
          projectsName={projectName}
          allSupplier={allSupplier}
          onCancel={() => {
            salesInvoice.setMode("list");
            salesInvoice.setEditing(null);
          }}
        />
      )}
    </div>
  );
}

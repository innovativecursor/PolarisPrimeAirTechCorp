import CreateDeliveryReceipt from "./CreateDeliveryReceipt";
import DeliveryReceiptList from "./DeliveryReceiptList";
import { useDeliveryReceipt } from "./hooks/useDeliveryReceipt";
import { useSupplier } from "../addsupplier/hooks/useSupplier";
import { useCallback, useEffect } from "react";
import { useConfirmToast } from "@/app/hooks/useConfirmToast";
import { SupplierDeliveryReceipt } from "./type";
import { useSalesOrders } from "@/app/sales-orders/hooks/useSalesOrders";

export default function DeliveryReceipt() {
  const dr = useDeliveryReceipt();
  const { loadProjectName, projectName } = useSalesOrders();
  const { GetSupplier, allSupplier } = useSupplier();
  const confirmToast = useConfirmToast();

  const handleDelete = useCallback(
    (row: SupplierDeliveryReceipt) => {
      confirmToast.confirm({
        title: "Delete Invoice",
        message: `Are you sure you want to delete invoice "${row.your_po_no}"?`,
        confirmText: "Delete",
        cancelText: "Cancel",
        onConfirm: async () => {
          await dr.deleteDr(row.id);
        },
      });
    },
    [dr.deleteDr, confirmToast]
  );

  useEffect(() => {
    void loadProjectName();
    void GetSupplier();
  }, []);

  useEffect(() => {
    dr.GetDrReceipts(1, true);
  }, []);

  return (
    <div className="space-y-6">
      {dr.mode === "list" ? (
        <DeliveryReceiptList
          onCreate={() => {
            dr.setEditing(null);
            dr.setMode("create");
          }}
          loading={dr.loading}
          allDr={dr.allDrReceipts}
          onEdit={(id) => {
            dr.setEditing(id);
            dr.setMode("create");
          }}
          onDelete={handleDelete}
          page={dr.page}
          total={dr.total}
          limit={dr.limit}
          onPageChange={(p) => dr.GetDrReceipts(p, true)}
        />
      ) : (
        <CreateDeliveryReceipt
          {...dr}
          projectsName={projectName}
          allSupplier={allSupplier}
          onCancel={() => {
            dr.setMode("list");
            dr.setEditing(null);
          }}
        />
      )}
    </div>
  );
}

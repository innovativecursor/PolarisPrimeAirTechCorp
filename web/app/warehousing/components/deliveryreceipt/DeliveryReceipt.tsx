import { useSupplierPO } from "@/app/purchase-orders/hooks/useSupplierPO";
import CreateDeliveryReceipt from "./CreateDeliveryReceipt";
import DeliveryReceiptList from "./DeliveryReceiptList";
import { useDeliveryReceipt } from "./hooks/useDeliveryReceipt";
import { useSupplier } from "../addsupplier/hooks/useSupplier";
import { useCallback, useEffect } from "react";
import { useConfirmToast } from "@/app/hooks/useConfirmToast";
import { SupplierDeliveryReceipt } from "./type";

export default function DeliveryReceipt() {
  const dr = useDeliveryReceipt();
  const { projectsOptions, loadOptions } = useSupplierPO();
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
    void loadOptions();
    void GetSupplier();
    void dr.GetDrReceipts();
  }, []);

  return (
    <div className="space-y-6">
      {dr.mode === "list" ? (
        <DeliveryReceiptList
          onCreate={() => {
            dr.setEditing(null);
            dr.setMode("create");
          }}
          loading={dr.loading || dr.saving}
          allDr={dr.allDrReceipts}
          onEdit={(id) => {
            dr.setEditing(id);
            dr.setMode("create");
          }}
          onDelete={handleDelete}
        />
      ) : (
        <CreateDeliveryReceipt
          {...dr}
          projects={projectsOptions}
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

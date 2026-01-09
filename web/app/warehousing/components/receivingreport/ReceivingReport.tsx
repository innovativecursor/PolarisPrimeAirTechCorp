import ReceivingListCard from "./ReceivingListCard";
import CreateReceivingCard from "./CreateReceivingCard";
import useReceivingReport from "./hooks/useReceivingReport";
import { useEffect } from "react";
import { useConfirmToast } from "@/app/hooks/useConfirmToast";
import { toast } from "react-toastify";
import { fetchWithError } from "@/app/lib/fetchData";
import { ReceivingReportItem } from "./type";
import endpoints from "@/app/lib/endpoints";
import { useSalesOrders } from "@/app/sales-orders/hooks/useSalesOrders";

export default function ReceivingReport() {
  const {
    mode,
    setMode,
    setEditing,
    editing,
    loading,
    saving,

    createReceivingReport,
    receivingReports,
    loadReceivingReports,
    setSaving,
    loadSupplierInvoice,
    loadSupplierDeliveryR,
    supplierInvoice,
    supplierDeliveryR,
    page,
    totalPages,
    loadSupplierPO,
    supplierPo,
  } = useReceivingReport();

  const { loadOrders, orders } = useSalesOrders();

  const confirmToast = useConfirmToast();

  const handleCreateClick = () => {
    setEditing(null);
    setMode("create");
  };

  const handleEdit = (row: ReceivingReportItem) => {
    setEditing(row);
    setMode("create");
  };

  const handleCancelForm = () => {
    setMode("list");
    setEditing(null);
  };

  useEffect(() => {
    void loadOrders();
    void loadReceivingReports(1);
    void loadSupplierInvoice();
    void loadSupplierDeliveryR();
    void loadSupplierPO();
  }, []);

  const handleDelete = (row: ReceivingReportItem) => {
    confirmToast.confirm({
      title: "Delete Receiving Report",
      message: `Are you sure you want to delete receiving report "${row.dr_number}"?`,
      confirmText: "Delete",
      cancelText: "Cancel",
      onConfirm: async () => {
        try {
          setSaving(true);

          await fetchWithError(endpoints.receivingReport.delete(row.id), {
            method: "DELETE",
          });

          toast.success("Receiving report deleted successfully");
          await loadReceivingReports();
        } catch (e: any) {
          toast.error(e.message ?? "Failed to delete receiving report");
        } finally {
          setSaving(false);
        }
      },
    });
  };

  return (
    <div className="space-y-6">
      {mode === "list" ? (
        <ReceivingListCard
          loading={loading || saving}
          onEdit={handleEdit}
          onCreate={handleCreateClick}
          receivingReports={receivingReports}
          onDelete={handleDelete}
          page={page}
          totalPages={totalPages}
          onPageChange={(p) => loadReceivingReports(p)}
        />
      ) : (
        <CreateReceivingCard
          onCancel={handleCancelForm}
          salesOrder={orders}
          createReceivingReport={createReceivingReport}
          saving={saving}
          loadReceivingReports={loadReceivingReports}
          editing={editing}
          supplierInvoice={supplierInvoice}
          supplierDeliveryR={supplierDeliveryR}
          supplierPo={supplierPo}
        />
      )}
    </div>
  );
}

import ReceivingListCard from "./ReceivingListCard";
import CreateReceivingCard from "./CreateReceivingCard";
import useReceivingReport from "./hooks/useReceivingReport";
import { useEffect } from "react";
import { useSupplierPO } from "@/app/purchase-orders/hooks/useSupplierPO";
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
    deliveryReceipts,
    loadDeliveryReceipts,
    // loadSalesOrders,
    // salesOrder,
    loadInvoices,
    invoices,
    createReceivingReport,
    receivingReports,
    loadReceivingReports,
    setSaving,
  } = useReceivingReport();

  const { loadProjectName, projectName, loadOrders, orders } = useSalesOrders();
  
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

  console.log(invoices, "kllll");
  

  useEffect(() => {
    void loadDeliveryReceipts();
    void loadProjectName();
    void loadOrders();
    void loadInvoices();
    void loadReceivingReports();
  }, []);

  const handleDelete = (row: ReceivingReportItem) => {
    confirmToast.confirm({
      title: "Delete Receiving Report",
      message: `Are you sure you want to delete receiving report "${row.id}"?`,
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
        />
      ) : (
        <CreateReceivingCard
          onCancel={handleCancelForm}
          deliveryReceipts={deliveryReceipts}
          projectsName={projectName}
          salesOrder={orders}
          invoices={invoices}
          createReceivingReport={createReceivingReport}
          saving={saving}
          loadReceivingReports={loadReceivingReports}
          editing={editing}
        />
      )}
    </div>
  );
}

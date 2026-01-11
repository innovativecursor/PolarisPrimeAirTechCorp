import { useCallback, useState } from "react";
import { SalesInvoice } from "../../accountsales/type";
import { toast } from "react-toastify";
import {
  fetchDataDelete,
  fetchDataGet,
  fetchDataPost,
  fetchDataPut,
} from "@/app/lib/fetchData";
import endpoints from "@/app/lib/endpoints";
import { DeliveryReceipt, DeliveryReceiptListRes, DrForm } from "../type";

export function useAccountDr() {
  const [mode, setMode] = useState<"list" | "create">("list");
  const [editing, setEditing] = useState<string | null>(null);
  const [loading, setLoading] = useState(false);
  const [saving, setSaving] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [selectedInvoice, setSelectedInvoice] = useState<SalesInvoice | null>(
    null
  );
  const [refreshing, setRefreshing] = useState(false);

  const [allAccountDr, setAllAccountDr] = useState<DeliveryReceipt[]>([]);
  const onSelectInvoice = useCallback((invoice: SalesInvoice | null) => {
    setSelectedInvoice(invoice);
  }, []);
  const [page, setPage] = useState(1);
  const [totalPages, setTotalPages] = useState(1);

  const GetAccountDr = useCallback(
    async (pageNo = page, showSkeleton: boolean = true) => {
      try {
        if (showSkeleton) {
          setLoading(true);
        } else {
          setRefreshing(true);
        }
        setError(null);

        const res = await fetchDataGet<any>(
          endpoints.deliveryReceipt.getAll(pageNo)
        );

        setAllAccountDr(Array.isArray(res?.data) ? res.data : []);

        const total = res?.total || 0;
        const limit = res?.limit || 10;

        setTotalPages(Math.ceil(total / limit));
        setPage(pageNo);
      } catch (err: any) {
        setError(err.message || "Failed to fetch delivery receipts");
        setAllAccountDr([]);
      } finally {
        setLoading(false);
        setRefreshing(false);
      }
    },
    [page]
  );

  const createDeliveryReceipt = useCallback(
    async (data: {
      projectId: string;
      customerId: string;
      salesOrderId: string;
      salesInvoiceId: string;
    }) => {
      const payload: DrForm = {
        project_id: data.projectId,
        customer_id: data.customerId,
        sales_order_id: data.salesOrderId,
        sales_invoice_id: data.salesInvoiceId,
      };

      try {
        setSaving(true);
        await fetchDataPost(endpoints.deliveryReceipt.create, payload);
        toast.success("Delivery receipt created");
        setMode("list");
        GetAccountDr(page, false);
      } catch (err: any) {
        setError(err.message || "Something went wrong");
      } finally {
        setSaving(false);
      }
    },
    [GetAccountDr]
  );

  const deleteAccountDr = useCallback(
    async (id: string) => {
      if (!id) return;

      try {
        setSaving(true);
        setError(null);

        await fetchDataDelete(endpoints.deliveryReceipt.delete(id));

        toast.success("Account DR deleted");
        GetAccountDr(page, false);
      } catch (err: any) {
        setError(err?.message || "Delete failed");
      } finally {
        setSaving(false);
      }
    },
    [GetAccountDr]
  );

  const updateDeliveryReceiptStatus = useCallback(
    async (id: string, status: "Ready" | "Issued") => {
      if (!id) return;

      try {
        setSaving(true);
        await fetchDataPut(endpoints.deliveryReceipt.update(id), {
          status,
        });

        toast.success("Delivery receipt updated");
        GetAccountDr(page, false);
      } catch (err: any) {
        toast.error(err.message || "Update failed");
      } finally {
        setSaving(false);
      }
    },
    [GetAccountDr]
  );

  return {
    mode,
    setMode,
    editing,
    setEditing,
    loading,
    setLoading,
    saving,
    setSaving,
    selectedInvoice,
    onSelectInvoice,
    createDeliveryReceipt,
    GetAccountDr,
    allAccountDr,
    deleteAccountDr,
    updateDeliveryReceiptStatus,
    page,
    setPage,
    totalPages,
  };
}

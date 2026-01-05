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
  const [allAccountDr, setAllAccountDr] = useState<DeliveryReceipt[]>([]);
  const onSelectInvoice = useCallback((invoice: SalesInvoice | null) => {
    setSelectedInvoice(invoice);
  }, []);

  const GetAccountDr = useCallback(async () => {
    try {
      setLoading(true);
      setError(null);
      const res = await fetchDataGet<DeliveryReceiptListRes>(
        endpoints.deliveryReceipt.getAll
      );
      setAllAccountDr(Array.isArray(res?.data) ? res?.data : []);
    } catch (err: any) {
      setError(err.message || "Failed to fetch inventories");
      setAllAccountDr([]);
    } finally {
      setLoading(false);
    }
  }, []);

  const createDeliveryReceipt = useCallback(async () => {
    if (!selectedInvoice) {
      toast.error("Please select project");
      return;
    }

    const payload: DrForm = {
      project_id: selectedInvoice.project_id,
      customer_id: selectedInvoice.customer_id,
      sales_order_id: selectedInvoice.sales_order_id,
      sales_invoice_id: selectedInvoice.id,
    };

    try {
      setSaving(true);
      await fetchDataPost(endpoints.deliveryReceipt.create, payload);
      toast.success("Delivery receipt created");
      setMode("list");
      setSelectedInvoice(null);
      GetAccountDr();
    } catch (err: any) {
      setError(err.message || "Something went wrong");
    } finally {
      setSaving(false);
    }
  }, [selectedInvoice]);

  const deleteAccountDr = useCallback(
    async (id: string) => {
      if (!id) return;

      try {
        setLoading(true);
        setError(null);

        await fetchDataDelete(endpoints.deliveryReceipt.delete(id));

        toast.success("Account DR deleted");
        GetAccountDr();
      } catch (err: any) {
        setError(err?.message || "Delete failed");
      } finally {
        setLoading(false);
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
        GetAccountDr();
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
    updateDeliveryReceiptStatus
  };
}

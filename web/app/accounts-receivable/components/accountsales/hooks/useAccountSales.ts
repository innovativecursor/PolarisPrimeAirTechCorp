import { useCallback, useState } from "react";
import { InvoiceItem, SalesInvoice, SalesInvoiceListRes } from "../type";
import {
  fetchDataDelete,
  fetchDataGet,
  fetchDataPost,
  fetchDataPut,
} from "@/app/lib/fetchData";
import endpoints from "@/app/lib/endpoints";
import { toast } from "react-toastify";

export function useAccountSales() {
  const [mode, setMode] = useState<"list" | "create">("list");
  const [editing, setEditing] = useState<string | null>(null);
  const [loading, setLoading] = useState(false);
  const [saving, setSaving] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [allAccountSales, setAllAccountSales] = useState<SalesInvoice[]>([]);

  const [form, setForm] = useState({
    project_id: "",
    customer_id: "",
    sales_order_id: "",
  });

  const [items, setItems] = useState<InvoiceItem[]>([]);

  const updateForm = (key: keyof typeof form, value: string) => {
    setForm((p) => ({ ...p, [key]: value }));
  };

  const addItem = () => {
    setItems((p) => [
      ...p,
      {
        sku: "",
        quantity: 1,
      },
    ]);
  };

  const updateItem = (index: number, key: keyof InvoiceItem, value: any) => {
    setItems((p) =>
      p.map((it, i) => (i === index ? { ...it, [key]: value } : it))
    );
  };

  const removeItem = (index: number) => {
    setItems((p) => p.filter((_, i) => i !== index));
  };

  const GetAccountSales = useCallback(async () => {
    try {
      setLoading(true);
      setError(null);
      const res = await fetchDataGet<SalesInvoiceListRes>(
        endpoints.salesInvoice.getAll
      );
      setAllAccountSales(Array.isArray(res?.data) ? res?.data : []);
    } catch (err: any) {
      setError(err.message || "Failed to fetch inventories");
      setAllAccountSales([]);
    } finally {
      setLoading(false);
    }
  }, []);

  const createSalesInvoice = useCallback(async () => {
    if (!form.project_id || !form.customer_id || !form.sales_order_id) {
      toast.error("Required fields missing");
      return;
    }

    if (items.length === 0) {
      toast.error("Add at least one item");
      return;
    }

    setSaving(true);
    setError(null);

    try {
      const payload = {
        project_id: form.project_id,
        customer_id: form.customer_id,
        sales_order_id: form.sales_order_id,
        items: items.map((it) => ({
          sku: it.sku,
          quantity: it.quantity,
        })),
      };

      if (editing) {
        await fetchDataPut(endpoints.salesInvoice.update(editing), payload);
        toast.success("Sales invoice updated");
      } else {
        await fetchDataPost(endpoints.salesInvoice.create, payload);
        toast.success("Sales invoice created");
      }

      setMode("list");
      setEditing(null);
      GetAccountSales();
    } catch (err: any) {
      setError(err?.message || "Something went wrong");
    } finally {
      setSaving(false);
    }
  }, [form, items, editing, GetAccountSales]);

  const deleteSalesInvoice = useCallback(
    async (id: string) => {
      if (!id) return;

      try {
        setLoading(true);
        setError(null);

        await fetchDataDelete(endpoints.salesInvoice.delete(id));

        toast.success("Sales invoice deleted");
        GetAccountSales();
      } catch (err: any) {
        setError(err?.message || "Delete failed");
      } finally {
        setLoading(false);
      }
    },
    [GetAccountSales]
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
    form,
    updateForm,

    items,
    addItem,
    updateItem,
    removeItem,

    createSalesInvoice,
    onSubmit: createSalesInvoice,
    GetAccountSales,
    allAccountSales,
    deleteSalesInvoice,
  };
}

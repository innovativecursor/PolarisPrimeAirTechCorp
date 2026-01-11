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
import { useSalesOrders } from "@/app/sales-orders/hooks/useSalesOrders";

export function useAccountSales() {
  const [mode, setMode] = useState<"list" | "create">("list");
  const [editing, setEditing] = useState<string | null>(null);
  const [loading, setLoading] = useState(false);
  const [saving, setSaving] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const { loadCustomerByProject } = useSalesOrders();
  const [allAccountSales, setAllAccountSales] = useState<SalesInvoice[]>([]);
  const initialForm = {
    project_id: "",
    customer_id: "",
    customer_name: "",
    sales_order_id: "",
  };

  const [form, setForm] = useState(initialForm);
  const [items, setItems] = useState<InvoiceItem[]>([]);
  const [page, setPage] = useState(1);
  const [limit, setLimit] = useState(10);
  const [total, setTotal] = useState(0);
  const [refreshing, setRefreshing] = useState(false);

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

  const GetAccountSales = useCallback(
    async (showSkeleton: boolean = true) => {
      try {
        if (showSkeleton) {
          setLoading(true);
        } else {
          setRefreshing(true);
        }
        setError(null);

        const res = await fetchDataGet<any>(
          `${endpoints.salesInvoice.getAll}?page=${page}`
        );

        setAllAccountSales(res?.data || []);
        setTotal(res?.total || 0);
        setLimit(res?.limit || 10);
      } catch (err: any) {
        setError(err.message || "Failed to fetch inventories");
        setAllAccountSales([]);
      } finally {
        setLoading(false);
        setRefreshing(false);
      }
    },
    [page]
  );

  const loadInvoiceForEdit = useCallback(async (id: string) => {
    try {
      setSaving(true);

      const res = await fetchDataGet<any>(endpoints.salesInvoice.getById(id));

      const invoice = res.data ?? res;

      setForm({
        project_id: invoice.project?.id || invoice.project_id || "",

        customer_id: invoice.customer?.id || invoice.customer_id || "",

        customer_name: "",

        sales_order_id: invoice.sales_order?.id || invoice.sales_order_id || "",
      });

      setItems(
        invoice.items?.map((it: any) => ({
          sku: it.sku,
          quantity: it.quantity,
        })) || []
      );

      const projectId = invoice.project?.id || invoice.project_id;

      if (projectId) {
        const customer = await loadCustomerByProject(projectId);
        if (customer) {
          setForm((p) => ({
            ...p,
            customer_id: customer.id,
            customer_name: customer.name,
          }));
        }
      }

      setEditing(id);
      setMode("create");
    } catch {
      toast.error("Failed to load invoice");
    } finally {
      setSaving(false);
    }
  }, []);

  const submitSalesInvoice = useCallback(async () => {
    if (!form.project_id || !form.customer_id || !form.sales_order_id) {
      toast.error("Required fields missing");
      return;
    }

    if (
      items.length === 0 ||
      items.some((it) => !it.sku || it.sku.trim() === "")
    ) {
      toast.error("SKU is required for all items");
      return;
    }

    const payload = {
      project_id: form.project_id,
      customer_id: form.customer_id,
      sales_order_id: form.sales_order_id,
      items: items.map((it) => ({
        sku: it.sku,
        quantity: it.quantity,
      })),
    };

    try {
      setSaving(true);

      if (editing) {
        // 👉 EDIT CASE (PUT)
        await fetchDataPut(endpoints.salesInvoice.update(editing), payload);
        toast.success("Sales invoice updated");
      } else {
        // 👉 CREATE CASE (POST)
        await fetchDataPost(endpoints.salesInvoice.create, payload);
        toast.success("Sales invoice created");
      }

      setForm(initialForm);
      setItems([]);
      setEditing(null);
      setMode("list");
      GetAccountSales(false);
    } catch (err: any) {
      toast.error(err?.message || "Something went wrong");
    } finally {
      setSaving(false);
    }
  }, [form, items, editing, GetAccountSales]);

  const deleteSalesInvoice = useCallback(
    async (id: string) => {
      if (!id) return;

      try {
        setSaving(true);
        setError(null);

        await fetchDataDelete(endpoints.salesInvoice.delete(id));

        toast.success("Sales invoice deleted");
        GetAccountSales(false);
      } catch (err: any) {
        setError(err?.message || "Delete failed");
      } finally {
        setSaving(false);
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
    setForm,
    items,
    setItems,
    addItem,
    updateItem,
    removeItem,
    page,
    setPage,
    limit,
    total,
    submitSalesInvoice,
    onSubmit: submitSalesInvoice,
    GetAccountSales,
    allAccountSales,
    deleteSalesInvoice,
    loadInvoiceForEdit,
  };
}

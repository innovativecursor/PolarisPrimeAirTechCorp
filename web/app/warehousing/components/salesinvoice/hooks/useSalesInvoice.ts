import { useCallback, useEffect, useMemo, useState } from "react";
import {
  InvoiceItem,
  SalesInvoiceForm,
  SupplierInvoice,
  SupplierInvoiceListResponse,
} from "../type";
import {
  fetchDataGet,
  fetchDataPost,
  fetchDataPut,
  fetchWithError,
} from "@/app/lib/fetchData";
import endpoints from "@/app/lib/endpoints";
import { toast } from "react-toastify";

export function useSalesInvoice() {
  const [mode, setMode] = useState<"list" | "create">("list");
  const [editing, setEditing] = useState<string | null>(null);
  const [loading, setLoading] = useState(false);
  const [saving, setSaving] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [form, setForm] = useState<SalesInvoiceForm>({
    supplier_id: "",
    project_id: "",
    invoice_number: "",
    invoice_date: "",
    delivery_number: "",
    po_number: "",
    due_date: "",
    delivery_address: "",
    vat_type: "",
    total_sales: 0,
    grand_total: 0,
  });
  const [items, setItems] = useState<InvoiceItem[]>([]);
  const [allSalesInvoice, setAllSalesInvoice] = useState<SupplierInvoice[]>([]);

  const updateForm = (key: keyof SalesInvoiceForm, value: any) => {
    setForm((p) => ({ ...p, [key]: value }));
  };

  const addItem = () => {
    setItems((p) => [
      ...p,
      {
        description: "",
        qty: 1,
        unit: "unit",
        unit_price: 0,
        amount: 0,
      },
    ]);
  };

  const updateItem = (index: number, key: keyof InvoiceItem, value: any) => {
    setItems((prev) =>
      prev.map((it, i) => {
        if (i !== index) return it;
        const updated = { ...it, [key]: value };
        updated.amount = updated.qty * updated.unit_price;
        return updated;
      })
    );
  };

  const removeItem = (index: number) => {
    setItems((p) => p.filter((_, i) => i !== index));
  };

  const totalSales = useMemo(() => {
    return items.reduce((sum, item) => sum + item.amount, 0);
  }, [items]);

  const vatAmount = useMemo(() => {
    if (form.vat_type === "vatable") {
      return totalSales * 0.12;
    }

    // NON-VATABLE & VAT-EXEMPT
    return 0;
  }, [form.vat_type, totalSales]);

  const grandTotal = useMemo(() => {
    return totalSales + vatAmount;
  }, [totalSales, vatAmount]);

  const GetSalesInvoice = useCallback(async () => {
    try {
      setLoading(true);
      setError(null);
      const res = await fetchDataGet<SupplierInvoiceListResponse>(
        endpoints.supplierInvoice.getAll
      );
      setAllSalesInvoice(Array.isArray(res?.invoices) ? res?.invoices : []);
    } catch (err: any) {
      setError(err.message || "Failed to fetch inventories");
      setAllSalesInvoice([]);
    } finally {
      setLoading(false);
    }
  }, []);

  const loadInvoiceForEdit = useCallback(async (id: string) => {
    const res = await fetchDataGet<{ invoice: SupplierInvoice }>(
      endpoints.supplierInvoice.getById(id)
    );

    const inv = res.invoice;

    setForm({
      supplier_id: inv.supplier_id,
      project_id: inv.project_id,
      invoice_number: inv.invoice_no,
      invoice_date: inv.invoice_date.split("T")[0],
      delivery_number: inv.delivery_no,
      po_number: inv.purchase_order_no,
      due_date: inv.due_date.split("T")[0],
      delivery_address: inv.delivery_address,
      vat_type: inv.vat > 0 ? "vatable" : "non-vatable",
      total_sales: inv.total_sales,
      grand_total: inv.grand_total,
    });

    setItems(inv.items ?? []);
  }, []);

  useEffect(() => {
    if (editing) loadInvoiceForEdit(editing);
  }, [editing]);

  const validateInvoice = () => {
    if (!form.supplier_id) {
      toast.error("Supplier is required");
      return false;
    }

    if (!form.project_id) {
      toast.error("Project is required");
      return false;
    }

    if (!form.invoice_number) {
      toast.error("Invoice number is required");
      return false;
    }

    if (!form.invoice_date) {
      toast.error("Invoice date is required");
      return false;
    }

    if (!form.due_date) {
      toast.error("Due date is required");
      return false;
    }

    if (!form.vat_type) {
      toast.error("Please select VAT type");
      return false;
    }

    if (items.length === 0) {
      toast.error("Please add at least one item");
      return false;
    }

    for (let i = 0; i < items.length; i++) {
      const item = items[i];

      if (item.qty <= 0) {
        toast.error(`Item ${i + 1}: Quantity must be greater than 0`);
        return false;
      }

      if (item.unit_price <= 0) {
        toast.error(`Item ${i + 1}: Unit price must be greater than 0`);
        return false;
      }
    }

    return true;
  };

  const createInvoice = useCallback(async () => {
    if (!validateInvoice()) return;

    const payload = {
      id: editing || undefined,
      supplier_id: form.supplier_id,
      project_id: form.project_id,
      invoice_no: form.invoice_number,
      invoice_date: form.invoice_date,
      delivery_no: form.delivery_number,
      purchase_order_no: form.po_number,
      due_date: form.due_date,
      delivery_address: form.delivery_address,
      items,
      total_sales: totalSales,
      vat: vatAmount,
      grand_total: grandTotal,
    };

    if (editing) {
      await fetchDataPut(endpoints.supplierInvoice.edit, payload);
      toast.success("Invoice updated");
    } else {
      await fetchDataPost(endpoints.supplierInvoice.create, payload);
      toast.success("Invoice created");
    }

    setForm({
      supplier_id: "",
      project_id: "",
      invoice_number: "",
      invoice_date: "",
      delivery_number: "",
      po_number: "",
      due_date: "",
      delivery_address: "",
      vat_type: "",
      total_sales: 0,
      grand_total: 0,
    });

    setItems([]);
    setEditing(null);
    setMode("list");
    GetSalesInvoice();
  }, [editing, form, items, totalSales, vatAmount, grandTotal]);

  const deleteSalesInvoice = useCallback(
    async (id: string) => {
      try {
        setSaving(true);
        setError(null);

        await fetchWithError(endpoints.supplierInvoice.delete, {
          method: "DELETE",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify({
            id,
          }),
        });

        toast.success("Supplier deleted successfully");
        await GetSalesInvoice();
      } catch (err) {
        const error = err as Error;
        toast.error(error.message || "Failed to delete supplier");
      } finally {
        setSaving(false);
      }
    },
    [GetSalesInvoice]
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
    totalSales,
    vatAmount,
    grandTotal,
    createInvoice,
    GetSalesInvoice,
    allSalesInvoice,
    deleteSalesInvoice,
  };
}

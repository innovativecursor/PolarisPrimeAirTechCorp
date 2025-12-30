import { useState } from "react";
import { InvoiceItem, SalesInvoiceForm } from "../type";

export function useSalesInvoice() {
  const [mode, setMode] = useState<"list" | "create">("list");
  const [editing, setEditing] = useState<string | null>(null);
  const [loading, setLoading] = useState(false);
  const [saving, setSaving] = useState(false);
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
  };
}

/* eslint-disable @typescript-eslint/no-explicit-any */
"use client";

import { useState } from "react";
import { FiPlus, FiTrash2 } from "react-icons/fi";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import {
  SupplierPORow,
  ProjectOption,
  SupplierOption,
  SalesOrderOption,
  SupplierPOFormValues,
} from "./types";

type LineItemForm = {
  id: string;
  description: string;
  quantity: string;
  uom: string;
  rate: string;
};

type CreateSupplierPOCardProps = {
  initialValues?: SupplierPORow;
  projects: ProjectOption[];
  suppliers: SupplierOption[];
  salesOrders: SalesOrderOption[];
  saving: boolean;
  onCancel: () => void;
  onSubmit: (values: SupplierPOFormValues) => Promise<void> | void;
};

export default function CreateSupplierPOCard({
  initialValues,
  projects,
  suppliers,
  salesOrders,
  saving,
  onCancel,
  onSubmit,
}: CreateSupplierPOCardProps) {
  const [form, setForm] = useState<SupplierPOFormValues>(() => {
    console.log("Initializing form with initialValues:", initialValues);

    // Extract line items from initialValues if editing
    let items: LineItemForm[] = [
      {
        id: crypto.randomUUID(),
        description: "",
        quantity: "0",
        uom: "NOS",
        rate: "0",
      },
    ];

    if (initialValues?._raw?.items && Array.isArray(initialValues._raw.items)) {
      items = initialValues._raw.items.map((item: any) => ({
        id: crypto.randomUUID(),
        description: item.description || "",
        quantity: String(item.quantity || 0),
        uom: item.uom || item.UOM || "NOS",
        rate: String(item.rate || 0),
      }));
    }

    const projectId =
      initialValues?._raw?.projectId || initialValues?._raw?.project_id || "";
    const supplierId =
      initialValues?._raw?.supplierId || initialValues?._raw?.supplier_id || "";
    const soId = initialValues?._raw?.soId || initialValues?._raw?.so_id || "";

    return {
      projectId,
      supplierId,
      soId,
      customerPoIds: initialValues?._raw?.customerPoIds || [],
      items,
    };
  });

  const isEdit = Boolean(initialValues);

  const updateItem = (id: string, patch: Partial<LineItemForm>) => {
    setForm((prev) => ({
      ...prev,
      items: prev.items.map((item) =>
        item.id === id ? { ...item, ...patch } : item
      ),
    }));
  };

  const addItem = () => {
    setForm((prev) => ({
      ...prev,
      items: [
        ...prev.items,
        {
          id: crypto.randomUUID(),
          description: "",
          quantity: "0",
          uom: "NOS",
          rate: "0",
        },
      ],
    }));
  };

  const removeItem = (id: string) => {
    setForm((prev) => ({
      ...prev,
      items: prev.items.filter((i) => i.id !== id),
    }));
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    onSubmit(form);
  };

  return (
    <section className="rounded-[32px] bg-white border border-slate-100 shadow-[0_24px_60px_rgba(15,23,42,0.08)] px-8 py-8">
      {/* Header */}
      <div className="flex items-start justify-between mb-8">
        <div>
          <p className="text-xs font-semibold tracking-[0.24em] uppercase text-slate-400 mb-2">
            Supplier purchase orders
          </p>
          <h2 className="text-lg md:text-xl font-semibold text-slate-900">
            {isEdit ? "Edit Supplier PO" : "Create Supplier PO"}
          </h2>
        </div>

        <button
          type="button"
          onClick={onCancel}
          className="text-xs font-medium text-slate-400 hover:text-slate-600"
        >
          Cancel
        </button>
      </div>

      <form onSubmit={handleSubmit} className="space-y-8">
        {/* Project + Supplier */}
        <div className="grid gap-4 md:grid-cols-2">
          {/* Project */}
          <div className="space-y-1.5">
            <label className="block text-sm font-medium text-slate-600">
              Project name
            </label>
            <Select
              value={form.projectId}
              onValueChange={(val) => setForm({ ...form, projectId: val })}
            >
              <SelectTrigger className="w-full rounded-2xl border border-slate-200 bg-slate-50 px-4 py-2.5 text-sm text-slate-900 focus:outline-none focus:ring-2 focus:ring-slate-900 focus:bg-white">
                <SelectValue placeholder="Choose project" />
              </SelectTrigger>
              <SelectContent>
                {projects.map((p) => (
                  <SelectItem key={p.id} value={p.id}>
                    {p.name}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>

          {/* Supplier */}
          <div className="space-y-1.5">
            <label className="block text-sm font-medium text-slate-600">
              Supplier name
            </label>
            <Select
              value={form.supplierId}
              onValueChange={(val) => setForm({ ...form, supplierId: val })}
            >
              <SelectTrigger className="w-full rounded-2xl border border-slate-200 bg-slate-50 px-4 py-2.5 text-sm text-slate-900 focus:outline-none focus:ring-2 focus:ring-slate-900 focus:bg-white">
                <SelectValue placeholder="Choose supplier" />
              </SelectTrigger>
              <SelectContent>
                {suppliers.map((s) => (
                  <SelectItem key={s.id} value={s.id}>
                    {s.name}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>
        </div>

        {/* Sales Order (Optional) */}
        <div className="space-y-1.5">
          <label className="block text-sm font-medium text-slate-600">
            Sales order (optional)
          </label>
          <Select
            value={form.soId || undefined}
            onValueChange={(val) => setForm({ ...form, soId: val })}
          >
            <SelectTrigger className="w-full rounded-2xl border border-slate-200 bg-slate-50 px-4 py-2.5 text-sm text-slate-900 focus:outline-none focus:ring-2 focus:ring-slate-900 focus:bg-white">
              <SelectValue placeholder="Choose sales order (optional)" />
            </SelectTrigger>
            <SelectContent>
              {salesOrders.map((so) => (
                <SelectItem key={so.id} value={so.id}>
                  {so.name}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
        </div>

        {/* Line items */}
        <div className="space-y-6">
          {form.items.map((item) => (
            <div
              key={item.id}
              className="grid gap-4 md:grid-cols-[2fr,1fr,1fr,1fr,1fr,auto]"
            >
              {/* Description */}
              <div className="space-y-1.5">
                <label className="block text-sm font-medium text-slate-600">
                  Description
                </label>
                <input
                  type="text"
                  value={item.description}
                  onChange={(e) =>
                    updateItem(item.id, { description: e.target.value })
                  }
                  className="block w-full rounded-2xl border border-slate-200 bg-slate-50 px-4 py-2.5 text-sm text-slate-900 focus:outline-none focus:ring-2 focus:ring-slate-900 focus:bg-white"
                  placeholder="Item description"
                />
              </div>

              {/* Quantity */}
              <div className="space-y-1.5">
                <label className="block text-sm font-medium text-slate-600">
                  Quantity
                </label>
                <input
                  type="number"
                  min={0}
                  value={item.quantity}
                  onChange={(e) =>
                    updateItem(item.id, { quantity: e.target.value })
                  }
                  className="block w-full rounded-2xl border border-slate-200 bg-slate-50 px-4 py-2.5 text-sm text-slate-900 focus:outline-none focus:ring-2 focus:ring-slate-900 focus:bg-white"
                />
              </div>

              {/* UOM */}
              <div className="space-y-1.5">
                <label className="block text-sm font-medium text-slate-600">
                  UOM
                </label>
                <input
                  type="text"
                  value={item.uom}
                  onChange={(e) => updateItem(item.id, { uom: e.target.value })}
                  className="block w-full rounded-2xl border border-slate-200 bg-slate-50 px-4 py-2.5 text-sm text-slate-900 focus:outline-none focus:ring-2 focus:ring-slate-900 focus:bg-white"
                  placeholder="NOS"
                />
              </div>

              {/* Rate */}
              <div className="space-y-1.5">
                <label className="block text-sm font-medium text-slate-600">
                  Rate
                </label>
                <input
                  type="number"
                  min={0}
                  step="0.01"
                  value={item.rate}
                  onChange={(e) =>
                    updateItem(item.id, { rate: e.target.value })
                  }
                  className="block w-full rounded-2xl border border-slate-200 bg-slate-50 px-4 py-2.5 text-sm text-slate-900 focus:outline-none focus:ring-2 focus:ring-slate-900 focus:bg-white"
                />
              </div>

              {/* Amount */}
              <div className="space-y-1.5">
                <label className="block text-sm font-medium text-slate-600">
                  Amount
                </label>
                <input
                  type="number"
                  min={0}
                  step="0.01"
                  value={
                    (Number(item.quantity) || 0) * (Number(item.rate) || 0)
                  }
                  onChange={(e) => {
                    const newAmount = Number(e.target.value) || 0;
                    const qty = Number(item.quantity) || 0;
                    const newRate = qty > 0 ? newAmount / qty : 0;
                    updateItem(item.id, { rate: newRate.toString() });
                  }}
                  className="block w-full rounded-2xl border border-slate-200 bg-slate-50 px-4 py-2.5 text-sm text-slate-900 focus:outline-none focus:ring-2 focus:ring-slate-900 focus:bg-white"
                />
              </div>

              {/* Remove line */}
              <div className="flex items-end">
                {form.items.length > 1 && (
                  <button
                    type="button"
                    onClick={() => removeItem(item.id)}
                    className="inline-flex h-10 w-10 items-center justify-center rounded-2xl bg-rose-50 text-rose-500 hover:bg-rose-100"
                  >
                    <FiTrash2 className="h-4 w-4" />
                  </button>
                )}
              </div>
            </div>
          ))}
        </div>

        {/* Add + Save */}
        <div className="mt-6 flex items-center justify-between">
          <button
            type="button"
            onClick={addItem}
            className="inline-flex items-center gap-2 rounded-2xl border border-slate-200 bg-white px-4 py-2 text-xs font-medium text-slate-600 hover:bg-slate-50"
          >
            <FiPlus className="h-4 w-4" />
            Add line
          </button>

          <button
            type="submit"
            disabled={saving}
            className="inline-flex items-center rounded-[999px] bg-[#1f285c] text-white px-6 py-2.5 text-sm font-semibold shadow-[0_18px_40px_rgba(15,23,42,0.35)] hover:bg-[#171e48] disabled:opacity-60"
          >
            {saving ? "Saving…" : "Save supplier PO"}
          </button>
        </div>
      </form>
    </section>
  );
}

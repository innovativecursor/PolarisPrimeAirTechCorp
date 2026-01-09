import { useState } from "react";
import { FiPlus, FiTrash2 } from "react-icons/fi";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { SupplierPORow, SupplierPOFormValues } from "./types";
import {
  ProjectOption,
  SalesOrderRow,
} from "@/app/sales-orders/hooks/useSalesOrders";
import { Supplier } from "@/app/warehousing/components/addsupplier/type";
import Required from "@/components/ui/Required";

type LineItemForm = {
  id: string;
  description: string;
  quantity: string;
  uom: string;
};

type CreateSupplierPOCardProps = {
  initialValues?: SupplierPORow;
  projectsName: ProjectOption[];
  suppliers: Supplier[];
  salesOrders: SalesOrderRow[];
  saving: boolean;
  onCancel: () => void;
  onSubmit: (values: SupplierPOFormValues) => Promise<void> | void;
};

export default function CreateSupplierPOCard({
  initialValues,
  projectsName,
  suppliers,
  salesOrders,
  saving,
  onCancel,
  onSubmit,
}: CreateSupplierPOCardProps) {
  const [form, setForm] = useState<SupplierPOFormValues>(() => {
    let items: LineItemForm[] = [
      {
        id: crypto.randomUUID(),
        description: "",
        quantity: "0",
        uom: "unit",
      },
    ];

    if (initialValues?._raw?.items && Array.isArray(initialValues._raw.items)) {
      items = initialValues._raw.items.map((item: any) => ({
        id: crypto.randomUUID(),
        description: item.description || "",
        quantity: String(item.quantity || 0),
        uom: item.uom || item.UOM || "unit",
      }));
    }
    const status = initialValues?._raw?.status || "draft";

    const projectId = initialValues?._raw?.project?.id || "";
    const supplierId = initialValues?._raw?.supplier?.id || "";
    const soId =
      salesOrders.find(
        (so) => so.salesOrderId === initialValues?._raw?.sales_order_id
      )?.id || "";

    return {
      projectId,
      supplierId,
      soId,
      status,
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
          uom: "unit",
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
          className="text-xs  cursor-pointer font-medium text-slate-400 hover:text-slate-600"
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
              Project name <Required />
            </label>
            <Select
              required
              value={form.projectId}
              onValueChange={(val) => setForm({ ...form, projectId: val })}
              disabled={isEdit}
            >
              <SelectTrigger
                disabled={isEdit}
                className={`w-full rounded-2xl border border-slate-200 px-4 py-2.5 text-sm ${
                  isEdit
                    ? "bg-slate-100 cursor-not-allowed opacity-70"
                    : "bg-slate-50"
                }`}
              >
                <SelectValue placeholder="Choose project" />
              </SelectTrigger>
              <SelectContent>
                {projectsName.map((p) => (
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
              Supplier name <Required />
            </label>
            <Select
              required
              value={form.supplierId}
              onValueChange={(val) => setForm({ ...form, supplierId: val })}
              disabled={isEdit}
            >
              <SelectTrigger
                disabled={isEdit}
                className={`w-full rounded-2xl border border-slate-200 px-4 py-2.5 text-sm ${
                  isEdit
                    ? "bg-slate-100 cursor-not-allowed opacity-70"
                    : "bg-slate-50"
                }`}
              >
                <SelectValue placeholder="Choose supplier" />
              </SelectTrigger>
              <SelectContent>
                {suppliers.map((s) => (
                  <SelectItem key={s.id} value={s.id}>
                    {s.supplier_name}
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
            disabled={isEdit}
          >
            <SelectTrigger
              disabled={isEdit}
              className={`w-full rounded-2xl border border-slate-200 px-4 py-2.5 text-sm ${
                isEdit
                  ? "bg-slate-100 cursor-not-allowed opacity-70"
                  : "bg-slate-50"
              }`}
            >
              <SelectValue placeholder="Choose sales order (optional)" />
            </SelectTrigger>
            <SelectContent>
              {salesOrders.map((so) => (
                <SelectItem key={so.id} value={so.id}>
                  {so.salesOrderId}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
        </div>

        {isEdit && (
          <div className="space-y-1.5">
            <label className="block text-sm font-medium text-slate-600">
              Status
            </label>

            <Select
              value={form.status}
              onValueChange={(val) =>
                setForm({ ...form, status: val as "draft" | "approved" })
              }
            >
              <SelectTrigger className="w-full rounded-2xl border border-slate-200 bg-slate-50 px-4 py-2.5 text-sm">
                <SelectValue placeholder="Select status" />
              </SelectTrigger>

              <SelectContent>
                <SelectItem value="draft">Draft</SelectItem>
                <SelectItem value="approved">Approved</SelectItem>
              </SelectContent>
            </Select>
          </div>
        )}

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
                  Quantity <Required />
                </label>
                <input
                  type="number"
                  required
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
                  Unit of measurement
                </label>

                <Select
                  value={item.uom}
                  onValueChange={(val) => updateItem(item.id, { uom: val })}
                >
                  <SelectTrigger className="w-full rounded-2xl border border-slate-200 bg-slate-50 px-4 py-2.5 text-sm text-slate-900 focus:outline-none focus:ring-2 focus:ring-slate-900 focus:bg-white">
                    <SelectValue placeholder="Select UOM" />
                  </SelectTrigger>

                  <SelectContent>
                    <SelectItem value="unit">unit</SelectItem>
                    <SelectItem value="pcs">pcs</SelectItem>
                    <SelectItem value="set">set</SelectItem>
                  </SelectContent>
                </Select>
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
            className="inline-flex  cursor-pointer items-center gap-2 rounded-2xl border border-slate-200 bg-white px-4 py-2 text-xs font-medium text-slate-600 hover:bg-slate-50"
          >
            <FiPlus className="h-4 w-4" />
            Add line
          </button>

          <button
            type="submit"
            disabled={saving}
            className="inline-flex  cursor-pointer items-center rounded-[999px] bg-[#1f285c] text-white px-6 py-2.5 text-sm font-semibold shadow-[0_18px_40px_rgba(15,23,42,0.35)] hover:bg-[#171e48] disabled:opacity-60"
          >
            {saving ? "Saving…" : "Save supplier PO"}
          </button>
        </div>
      </form>
    </section>
  );
}

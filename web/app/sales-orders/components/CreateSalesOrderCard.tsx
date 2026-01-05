import { ProjectOption } from "../hooks/useSalesOrders";
import {
  AirconOption,
  CustomerOption,
  LineItemForm,
  SalesOrderFormValues,
  SalesOrderRow,
} from "../hooks/useSalesOrders";
import { useState } from "react";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { FiPlus, FiTrash2 } from "react-icons/fi";

type CreateSalesOrderCardProps = {
  initialValues?: SalesOrderRow;
  projects: ProjectOption[];
  customers: CustomerOption[];
  aircons: AirconOption[];
  saving: boolean;
  onCancel: () => void;
  onSubmit: (values: SalesOrderFormValues) => Promise<void> | void;
};

export default function CreateSalesOrderCard({
  initialValues,
  projects,
  customers,
  aircons,
  saving,
  onCancel,
  onSubmit,
}: CreateSalesOrderCardProps) {
  const [form, setForm] = useState<SalesOrderFormValues>(() => {
    console.log("Initializing form with initialValues:", initialValues);
    console.log("Available aircons:", aircons);
    console.log("Available projects:", projects);
    console.log("Available customers:", customers);

    // Extract line items from initialValues if editing
    let items: LineItemForm[] = [
      {
        id: crypto.randomUUID(),
        airconId: "",
        quantity: "0",
        uom: "unit",
        price: "0",
      },
    ];

    if (initialValues?._raw?.items && Array.isArray(initialValues._raw.items)) {
      items = initialValues._raw.items.map((item: any) => {
        // Try to find airconId by matching airconName with aircons list
        let airconId = item.airconId || item.aircon_id || "";

        if (!airconId && item.airconName && aircons.length > 0) {
          const matchedAircon = aircons.find((a) => a.name === item.airconName);
          airconId = matchedAircon?.id || "";
        }

        return {
          id: crypto.randomUUID(), // Generate new local ID for React
          airconId,
          quantity: String(item.qty || item.quantity || 0),
          uom: item.uom || "unit",
          price: String(item.price || 0),
        };
      });
    }

    // Try to get projectId and customerId from _raw, or match by name
    let projectId =
      initialValues?._raw?.projectId || initialValues?._raw?.project_id || "";
    let customerId =
      initialValues?._raw?.customerId || initialValues?._raw?.customer_id || "";

    // If IDs not found, try to match by name
    if (!projectId && initialValues?.projectName && projects.length > 0) {
      const matchedProject = projects.find(
        (p) => p.name === initialValues.projectName
      );
      projectId = matchedProject?.id || "";
    }

    if (!customerId && initialValues?.customerName && customers.length > 0) {
      const matchedCustomer = customers.find(
        (c) => c.name === initialValues.customerName
      );
      customerId = matchedCustomer?.id || "";
    }

    return {
      projectId,
      customerId,
      projectName:
        initialValues?.projectName || initialValues?._raw?.projectName || "",
      customerName:
        initialValues?.customerName || initialValues?._raw?.customerName || "",
      status:
        initialValues?._raw?.status === "approved" ? "approved" : "notapproved",
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
          airconId: "",
          quantity: "0",
          uom: "unit",
          price: "0",
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

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    await onSubmit(form);
  };

  return (
    <section className="rounded-[32px] bg-white border border-slate-100 shadow-[0_24px_60px_rgba(15,23,42,0.08)] px-8 py-8">
      {/* Header */}
      <div className="flex items-start justify-between mb-8">
        <div>
          <p className="text-xs font-semibold tracking-[0.24em] uppercase text-slate-400 mb-2">
            Sales orders
          </p>
          <h2 className="text-lg md:text-xl font-semibold text-slate-900">
            {isEdit ? "Edit Sales Order" : "Create Sales Order"}
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
        {/* Project + customer */}
        <div className="grid gap-4 md:grid-cols-2">
          {/* Project */}
          <div className="space-y-1.5">
            <label className="block text-sm font-medium text-slate-600">
              Project name
            </label>
            <Select
              value={form.projectId}
              onValueChange={(val) => {
                const proj = projects.find((p) => p.id === val);
                setForm((prev) => ({
                  ...prev,
                  projectId: val,
                  projectName: proj?.name || "",
                }));
              }}
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

          {/* Customer */}
          <div className="space-y-1.5">
            <label className="block text-sm font-medium text-slate-600">
              Customer name
            </label>
            <Select
              value={form.customerId}
              onValueChange={(val) => {
                const cust = customers.find((c) => c.id === val);
                setForm((prev) => ({
                  ...prev,
                  customerId: val,
                  customerName: cust?.name || "",
                }));
              }}
            >
              <SelectTrigger className="w-full rounded-2xl border border-slate-200 bg-slate-50 px-4 py-2.5 text-sm text-slate-900 focus:outline-none focus:ring-2 focus:ring-slate-900 focus:bg-white">
                <SelectValue placeholder="Choose customer" />
              </SelectTrigger>
              <SelectContent>
                {customers.map((c) => (
                  <SelectItem key={c.id} value={c.id}>
                    {c.name}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>
        </div>

        {isEdit && (
          <div className="space-y-1.5">
            <label className="block text-sm font-medium text-slate-600">
              Status
            </label>

            <Select
              value={form.status}
              onValueChange={(val) =>
                setForm((prev) => ({
                  ...prev,
                  status: val as "approved" | "notapproved",
                }))
              }
            >
              <SelectTrigger className="w-full rounded-2xl border border-slate-200 bg-slate-50 px-4 py-2.5 text-sm">
                <SelectValue placeholder="Select status" />
              </SelectTrigger>

              <SelectContent>
                <SelectItem value="approved">Approved</SelectItem>
                <SelectItem value="notapproved">Not Approved</SelectItem>
              </SelectContent>
            </Select>
          </div>
        )}

        {/* Line items */}
        <div className="space-y-6">
          {form.items.map((item) => (
            <div
              key={item.id}
              className="grid gap-4 md:grid-cols-[2fr,1fr,1.4fr,1fr,auto]"
            >
              {/* Aircon (shadcn select) */}
              <div className="space-y-1.5">
                <label className="block text-sm font-medium text-slate-600">
                  Select aircon
                </label>

                <Select
                  value={item.airconId}
                  onValueChange={(val) =>
                    updateItem(item.id, { airconId: val })
                  }
                >
                  <SelectTrigger className="w-full rounded-2xl border border-slate-200 bg-slate-50 px-4 py-2.5 text-sm text-slate-900 focus:outline-none focus:ring-2 focus:ring-slate-900 focus:bg-white">
                    <SelectValue placeholder="Choose a unit" />
                  </SelectTrigger>
                  <SelectContent>
                    {aircons.map((a) => (
                      <SelectItem key={a.id} value={a.id}>
                        {a.name}
                        {a.model ? ` • ${a.model}` : ""}
                        {a.brand ? ` • ${a.brand}` : ""}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
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

              {/* Price */}
              <div className="space-y-1.5">
                <label className="block text-sm font-medium text-slate-600">
                  Price
                </label>
                <input
                  type="number"
                  min={0}
                  step="0.01"
                  value={item.price}
                  onChange={(e) =>
                    updateItem(item.id, { price: e.target.value })
                  }
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
            {saving ? "Saving…" : "Save sales order"}
          </button>
        </div>
      </form>
    </section>
  );
}

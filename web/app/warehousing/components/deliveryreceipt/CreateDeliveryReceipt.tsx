import { ProjectOption } from "@/app/purchase-orders/components/types";
import { Supplier } from "../addsupplier/type";
import { DeliveryReceiptForm, DeliveryReceiptItem } from "./type";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { FiPlus, FiTrash2 } from "react-icons/fi";

type CreateDRProps = {
  onCancel: () => void;

  projects: ProjectOption[];
  allSupplier: Supplier[];

  form: DeliveryReceiptForm;
  updateForm: (key: keyof DeliveryReceiptForm, value: any) => void;

  items: DeliveryReceiptItem[];
  addItem: () => void;
  updateItem: (
    index: number,
    key: keyof DeliveryReceiptItem,
    value: any
  ) => void;
  removeItem: (index: number) => void;

  createDeliveryReceipt: () => void;
  saving: boolean;
  editing?: string | null;
};

export default function CreateDeliveryReceipt({
  onCancel,
  projects,
  allSupplier,
  form,
  updateForm,
  items,
  addItem,
  updateItem,
  removeItem,
  createDeliveryReceipt,
  saving,
  editing,
}: CreateDRProps) {
  return (
    <>
      {/* Header */}
      <div className="flex items-start justify-between mb-8">
        <div>
          <h2 className="text-lg md:text-xl font-semibold text-slate-900">
            {editing ? "Edit delivery receipt" : "Create delivery receipt"}
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

      {/* Form */}
      <form
        className="space-y-8"
        onSubmit={(e) => {
          e.preventDefault();
          createDeliveryReceipt();
        }}
      >
        <div className="grid gap-4 md:grid-cols-3">
          {/* Supplier */}
          <div className="space-y-1.5">
            <label className="text-sm font-medium text-slate-600">
              Supplier
            </label>
            <Select
              value={form.supplier_id}
              onValueChange={(v) => updateForm("supplier_id", v)}
            >
              <SelectTrigger className="w-full rounded-2xl">
                <SelectValue placeholder="Select supplier" />
              </SelectTrigger>
              <SelectContent>
                {allSupplier.map((s) => (
                  <SelectItem key={s.id} value={s.id}>
                    {s.supplier_name}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>

          {/* Project */}
          <div className="space-y-1.5">
            <label className="text-sm font-medium text-slate-600">
              Project
            </label>
            <Select
              value={form.project_id}
              onValueChange={(v) => updateForm("project_id", v)}
            >
              <SelectTrigger className="w-full rounded-2xl">
                <SelectValue placeholder="Select project" />
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

          {/* DR No */}
          <div className="space-y-1.5">
            <label className="text-sm font-medium text-slate-600">
              Supplier DR No
            </label>
            <input
              value={form.supplier_dr_no}
              onChange={(e) => updateForm("supplier_dr_no", e.target.value)}
              className="w-full rounded-2xl border px-4 py-2.5 text-sm"
              placeholder="DR-10045"
            />
          </div>

          {/* PO No */}
          <div className="space-y-1.5">
            <label className="text-sm font-medium text-slate-600">
              Your PO No
            </label>
            <input
              value={form.your_po_no}
              onChange={(e) => updateForm("your_po_no", e.target.value)}
              className="w-full rounded-2xl border px-4 py-2.5 text-sm"
              placeholder="PO-887766"
            />
          </div>

          <div className="space-y-1.5">
            <label className="text-sm font-medium text-slate-600">
              Dispatch Date
            </label>
            <input
              type="date"
              value={form.dispatch_date}
              onChange={(e) => updateForm("dispatch_date", e.target.value)}
              className="w-full rounded-2xl border px-4 py-2.5 text-sm"
            />
          </div>

          <div className="space-y-1.5">
            <label className="text-sm font-medium text-slate-600">
              Ship To
            </label>
            <input
              type="text"
              value={form.ship_to}
              onChange={(e) => updateForm("ship_to", e.target.value)}
              className="w-full rounded-2xl border px-4 py-2.5 text-sm"
              placeholder="Ship To"
            />
          </div>

          <div className="space-y-1.5">
            <label className="text-sm font-medium text-slate-600">
              Reference
            </label>
            <input
              type="text"
              value={form.reference}
              onChange={(e) => updateForm("reference", e.target.value)}
              className="w-full rounded-2xl border px-4 py-2.5 text-sm"
              placeholder="Reference"
            />
          </div>

          {/* Date */}
          <div className="space-y-1.5">
            <label className="text-sm font-medium text-slate-600">Date</label>
            <input
              type="date"
              value={form.date}
              onChange={(e) => updateForm("date", e.target.value)}
              className="w-full rounded-2xl border px-4 py-2.5 text-sm"
            />
          </div>

          {/* Items */}
          {items.map((item, index) => (
            <div
              key={index}
              className="md:col-span-3 rounded-2xl border p-4 space-y-4 border-slate-200 bg-slate-50/40"
            >
              <div className="flex justify-between items-center">
                <p className="text-sm font-semibold">Item {index + 1}</p>
                <button
                  type="button"
                  onClick={() => removeItem(index)}
                  className="text-red-600 text-xs flex items-center gap-1"
                >
                  <FiTrash2 />
                  Remove
                </button>
              </div>

              <div className="grid gap-4 md:grid-cols-2">
                {/* Description */}
                <div className="md:col-span-2 space-y-1.5">
                  <label className="block text-sm font-medium text-slate-600">
                    Description
                  </label>
                  <input
                    value={item.description}
                    onChange={(e) =>
                      updateItem(index, "description", e.target.value)
                    }
                    placeholder="Description"
                    className="block w-full rounded-2xl border border-slate-200 bg-white px-4 py-2.5 text-sm"
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium text-slate-600">
                    Model
                  </label>
                  <input
                    value={item.model}
                    onChange={(e) => updateItem(index, "model", e.target.value)}
                    placeholder="Model"
                    className="block w-full rounded-2xl border px-4 py-2.5 text-sm"
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium text-slate-600">
                    Plant
                  </label>
                  <input
                    value={item.plant}
                    onChange={(e) => updateItem(index, "plant", e.target.value)}
                    placeholder="Plant"
                    className="block w-full rounded-2xl border px-4 py-2.5 text-sm"
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium text-slate-600">
                    Storage Location
                  </label>
                  <input
                    value={item.stor_loc}
                    onChange={(e) =>
                      updateItem(index, "stor_loc", e.target.value)
                    }
                    placeholder="Storage Location"
                    className="block w-full rounded-2xl border px-4 py-2.5 text-sm"
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium text-slate-600">
                    Total CBM
                  </label>
                  <input
                    type="number"
                    value={item.total_cbm}
                    onChange={(e) =>
                      updateItem(index, "total_cbm", Number(e.target.value))
                    }
                    placeholder="Total CBM"
                    className="block w-full rounded-2xl border px-4 py-2.5 text-sm"
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium text-slate-600">
                    Total KGS
                  </label>
                  <input
                    type="number"
                    value={item.total_kgs}
                    onChange={(e) =>
                      updateItem(index, "total_kgs", Number(e.target.value))
                    }
                    placeholder="Total KGS"
                    className="block w-full rounded-2xl border px-4 py-2.5 text-sm"
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium text-slate-600">
                    Serial Nos
                  </label>
                  <input
                    value={item.serial_nos.join(",")}
                    onChange={(e) =>
                      updateItem(
                        index,
                        "serial_nos",
                        e.target.value.split(",").map((s) => s.trim())
                      )
                    }
                    placeholder="Serial Nos (comma separated)"
                    className="block w-full rounded-2xl border px-4 py-2.5 text-sm"
                  />
                </div>

                {/* Qty */}
                <div className="space-y-1.5">
                  <label className="block text-sm font-medium text-slate-600">
                    Ship Qty
                  </label>

                  <input
                    type="number"
                    value={item.ship_qty}
                    onChange={(e) =>
                      updateItem(index, "ship_qty", Number(e.target.value))
                    }
                    placeholder="Qty"
                    className="block w-full rounded-2xl border border-slate-200 bg-white px-4 py-2.5 text-sm"
                  />
                </div>

                <div className="space-y-1.5">
                  <label className="block text-sm font-medium text-slate-600">
                    Unit of measurement
                  </label>
                  <Select
                    value={item.unit}
                    onValueChange={(v) => updateItem(index, "unit", v)}
                  >
                    <SelectTrigger className="w-full rounded-2xl border border-slate-200 bg-white px-4 py-2.5 text-sm text-slate-900 focus:outline-none focus:ring-2 focus:ring-slate-900">
                      <SelectValue placeholder="Unit" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="unit">unit</SelectItem>
                      <SelectItem value="pcs">pcs</SelectItem>
                      <SelectItem value="set">set</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
              </div>
            </div>
          ))}
        </div>

        {/* Footer */}
        <div className="flex justify-between items-center">
          <button
            type="button"
            onClick={addItem}
            className="flex items-center gap-2 border rounded-2xl px-4 py-2 text-xs"
          >
            <FiPlus />
            Add item
          </button>

          <button
            type="submit"
            disabled={saving}
            className="rounded-full bg-[#1f285c] text-white px-6 py-2.5 text-sm font-semibold disabled:opacity-60"
          >
            {saving
              ? "Saving..."
              : editing
              ? "Update delivery receipt"
              : "Save delivery receipt"}
          </button>
        </div>
      </form>
    </>
  );
}

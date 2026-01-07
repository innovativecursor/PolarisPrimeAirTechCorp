// import { ProjectOption } from "@/app/purchase-orders/components/types";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { FiPlus, FiTrash2 } from "react-icons/fi";
import { Supplier } from "../addsupplier/type";
import { InvoiceItem, SalesInvoiceForm } from "./type";
import { ProjectOption } from "@/app/sales-orders/hooks/useSalesOrders";

type CreateSalesInvioceProps = {
  onCancel: () => void;
  projectsName: ProjectOption[];
  allSupplier: Supplier[];

  form: SalesInvoiceForm;
  updateForm: (key: keyof SalesInvoiceForm, value: any) => void;

  items: InvoiceItem[];
  addItem: () => void;
  updateItem: (index: number, key: keyof InvoiceItem, value: any) => void;
  removeItem: (index: number) => void;

  totalSales: number;
  vatAmount: number;
  grandTotal: number;
  createInvoice: () => void;
  saving: boolean;
  editing: string | null;
};

export default function CreateSalesInvioce({
  onCancel,
  projectsName,
  allSupplier,

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
  saving,
  editing,
}: CreateSalesInvioceProps) {
  return (
    <>
      <div className="flex items-start justify-between mb-8">
        <div>
          <p className="text-xs font-semibold tracking-[0.24em] uppercase text-slate-400 mb-2">
            Accounts Receivable
          </p>
          <h2 className="text-lg md:text-xl font-semibold text-slate-900">
            {editing ? "Edit invoice" : " Create invoice"}
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

      <form
        className="space-y-8"
        onSubmit={(e) => {
          e.preventDefault();
          createInvoice();
        }}
      >
        <div className="grid gap-4 md:grid-cols-3">
          <div className="space-y-1.5">
            <label className="block text-sm font-medium text-slate-600">
              Supplier Name
            </label>
            <Select
              value={form.supplier_id}
              onValueChange={(v) => updateForm("supplier_id", v)}
            >
              <SelectTrigger className="w-full rounded-2xl border border-slate-200 bg-slate-50 px-4 py-2.5 text-sm text-slate-900 focus:outline-none focus:ring-2 focus:ring-slate-900 focus:bg-white">
                <SelectValue placeholder="Choose Supplier" />
              </SelectTrigger>
              <SelectContent>
                {allSupplier.map((so) => (
                  <SelectItem key={so.id} value={so.id}>
                    {so?.supplier_name}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>

          <div className="space-y-1.5">
            <label className="block text-sm font-medium text-slate-600">
              Project name
            </label>
            <Select
              value={form.project_id}
              onValueChange={(v) => updateForm("project_id", v)}
            >
              <SelectTrigger className="w-full rounded-2xl border border-slate-200 bg-slate-50 px-4 py-2.5 text-sm text-slate-900 focus:outline-none focus:ring-2 focus:ring-slate-900 focus:bg-white">
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

          <div className="space-y-1.5">
            <label className="block text-sm font-medium text-slate-600">
              Invoice Number
            </label>
            <input
              value={form.invoice_number}
              onChange={(e) => updateForm("invoice_number", e.target.value)}
              type="text"
              className="block w-full rounded-2xl border border-slate-200 bg-slate-50 px-4 py-2.5 text-sm text-slate-900 focus:outline-none focus:ring-2 focus:ring-slate-900 focus:bg-white"
              placeholder=" Invoice Number"
            />
          </div>

          <div className="space-y-1.5">
            <label className="block text-sm font-medium text-slate-600">
              Invoice Date
            </label>
            <input
              type="date"
              value={form.invoice_date}
              onChange={(e) => updateForm("invoice_date", e.target.value)}
              className="block w-full rounded-2xl border border-slate-200 bg-slate-50 px-4 py-2.5 text-sm text-slate-900 focus:outline-none focus:ring-2 focus:ring-slate-900 focus:bg-white"
              placeholder=" Invoice Date"
            />
          </div>

          <div className="space-y-1.5">
            <label className="block text-sm font-medium text-slate-600">
              Delivery Number
            </label>
            <input
              type="number"
              value={form.delivery_number}
              onChange={(e) => updateForm("delivery_number", e.target.value)}
              className="block w-full rounded-2xl border border-slate-200 bg-slate-50 px-4 py-2.5 text-sm text-slate-900 focus:outline-none focus:ring-2 focus:ring-slate-900 focus:bg-white"
              placeholder="  Delivery Number"
            />
          </div>

          <div className="space-y-1.5">
            <label className="block text-sm font-medium text-slate-600">
              Purchase order no
            </label>
            <input
              value={form.po_number}
              onChange={(e) => updateForm("po_number", e.target.value)}
              type="number"
              className="block w-full rounded-2xl border border-slate-200 bg-slate-50 px-4 py-2.5 text-sm text-slate-900 focus:outline-none focus:ring-2 focus:ring-slate-900 focus:bg-white"
              placeholder=" Purchase order no"
            />
          </div>

          <div className="space-y-1.5">
            <label className="block text-sm font-medium text-slate-600">
              Due Date
            </label>
            <input
              type="date"
              value={form.due_date}
              onChange={(e) => updateForm("due_date", e.target.value)}
              className="block w-full rounded-2xl border border-slate-200 bg-slate-50 px-4 py-2.5 text-sm text-slate-900 focus:outline-none focus:ring-2 focus:ring-slate-900 focus:bg-white"
              placeholder="due date"
            />
          </div>

          <div className="space-y-1.5">
            <label className="block text-sm font-medium text-slate-600">
              Delivery address
            </label>
            <input
              type="text"
              value={form.delivery_address}
              onChange={(e) => updateForm("delivery_address", e.target.value)}
              className="block w-full rounded-2xl border border-slate-200 bg-slate-50 px-4 py-2.5 text-sm text-slate-900 focus:outline-none focus:ring-2 focus:ring-slate-900 focus:bg-white"
              placeholder="Delivery address"
            />
          </div>

          <div className="space-y-1.5">
            <label className="block text-sm font-medium text-slate-600">
              Total Sales
            </label>
            <input
              value={totalSales}
              disabled
              className="block w-full rounded-2xl border border-slate-200 bg-slate-50 px-4 py-2.5 text-sm text-slate-900 focus:outline-none focus:ring-2 focus:ring-slate-900 focus:bg-white"
              placeholder="total sales"
            />
          </div>

          <div className="space-y-1.5">
            <label className="block text-sm font-medium text-slate-600">
              VAT
            </label>
            <Select
              value={form.vat_type}
              onValueChange={(v) => updateForm("vat_type", v)}
            >
              <SelectTrigger className="w-full rounded-2xl border border-slate-200 bg-slate-50 px-4 py-2.5 text-sm text-slate-900 focus:outline-none focus:ring-2 focus:ring-slate-900 focus:bg-white">
                <SelectValue placeholder="Select VAT" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="vatable">VATABLE 12%</SelectItem>
                <SelectItem value="non-vatable">NON-VATABLE</SelectItem>
                <SelectItem value="vat-exempt">VAT-EXEMPT</SelectItem>
              </SelectContent>
            </Select>
          </div>

          <div className="space-y-1.5">
            <label className="block text-sm font-medium text-slate-600">
              VAT Amount
            </label>
            <input
              value={vatAmount}
              disabled
              className="block w-full rounded-2xl border border-slate-200 bg-slate-50 px-4 py-2.5 text-sm text-slate-900 focus:outline-none focus:ring-2 focus:ring-slate-900 focus:bg-white"
              placeholder="total sales"
            />
          </div>

          <div className="space-y-1.5">
            <label className="block text-sm font-medium text-slate-600">
              Grand Total
            </label>
            <input
              value={grandTotal}
              disabled
              className="block w-full rounded-2xl border border-slate-200 bg-slate-50 px-4 py-2.5 text-sm text-slate-900 focus:outline-none focus:ring-2 focus:ring-slate-900 focus:bg-white"
              placeholder="grand total"
            />
          </div>

          {items.map((item, index) => (
            <div
              key={index}
              className="grid gap-4 md:grid-cols-3 col-span-3 rounded-2xl border border-slate-200 p-4 bg-slate-50/40"
            >
              {/* Header */}
              <div className="md:col-span-3 flex items-center justify-between">
                <p className="text-sm font-semibold text-slate-700">
                  Item {index + 1}
                </p>

                <button
                  type="button"
                  onClick={() => removeItem(index)}
                  className="inline-flex  cursor-pointer items-center gap-1 text-xs text-red-600 hover:text-red-700"
                >
                  <FiTrash2 className="h-4 w-4" />
                  Remove
                </button>
              </div>

              {/* Description */}
              <div className="md:col-span-3 space-y-1.5">
                <label className="block text-sm font-medium text-slate-600">
                  Description
                </label>
                <input
                  value={item.description}
                  onChange={(e) =>
                    updateItem(index, "description", e.target.value)
                  }
                  className="block w-full rounded-2xl border border-slate-200 bg-white px-4 py-2.5 text-sm"
                />
              </div>

              {/* Qty */}
              <div className="space-y-1.5">
                <label className="block text-sm font-medium text-slate-600">
                  Quantity
                </label>
                <input
                  type="number"
                  value={item.qty}
                  onChange={(e) =>
                    updateItem(index, "qty", Number(e.target.value))
                  }
                  className="block w-full rounded-2xl border border-slate-200 bg-white px-4 py-2.5 text-sm"
                />
              </div>

              {/* Unit */}
              {/* UOM */}
              <div className="space-y-1.5">
                <label className="block text-sm font-medium text-slate-600">
                  Unit of measurement
                </label>
                <Select
                  value={item.unit}
                  onValueChange={(v) => updateItem(index, "unit", v)}
                >
                  <SelectTrigger className="w-full rounded-2xl border border-slate-200 bg-white px-4 py-2.5 text-sm text-slate-900 focus:outline-none focus:ring-2 focus:ring-slate-900">
                    <SelectValue placeholder="Select UOM" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="unit">unit</SelectItem>
                    <SelectItem value="pcs">pcs</SelectItem>
                    <SelectItem value="set">set</SelectItem>
                  </SelectContent>
                </Select>
              </div>

              {/* Unit Price */}
              <div className="space-y-1.5">
                <label className="block text-sm font-medium text-slate-600">
                  Unit Price
                </label>
                <input
                  type="number"
                  value={item.unit_price}
                  onChange={(e) =>
                    updateItem(index, "unit_price", Number(e.target.value))
                  }
                  className="block w-full rounded-2xl border border-slate-200 bg-white px-4 py-2.5 text-sm"
                />
              </div>

              {/* Amount */}
              <div className="space-y-1.5 md:col-span-3">
                <label className="block text-sm font-medium text-slate-600">
                  Amount
                </label>
                <input
                  value={item.amount}
                  disabled
                  className="block w-full rounded-2xl border border-slate-200 bg-slate-100 px-4 py-2.5 text-sm"
                />
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
            {saving ? "Saving..." : editing ? "Update invoice" : "Save invoice"}
          </button>
        </div>
      </form>
    </>
  );
}

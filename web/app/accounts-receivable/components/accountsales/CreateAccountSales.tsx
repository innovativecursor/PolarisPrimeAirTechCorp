import {
  ProjectOption,
  SalesOrderOption,
} from "@/app/purchase-orders/components/types";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { AccountSalesForm, InvoiceItem } from "./type";
import { InventoryItem } from "@/app/warehousing/components/inventory/type";

type CreateAccountProps = {
  onCancel: () => void;
  salesOrders: SalesOrderOption[];
  projects: ProjectOption[];
  saving: boolean;
  form: AccountSalesForm;
  updateForm: (
    key: "project_id" | "customer_id" | "sales_order_id",
    value: string
  ) => void;

  items: InvoiceItem[];
  addItem: () => void;
  updateItem: (i: number, k: keyof InvoiceItem, v: any) => void;
  removeItem: (i: number) => void;

  onSubmit: () => void;
  allInventories: InventoryItem[];
};

export default function CreateAccountSales({
  onCancel,
  projects,
  saving,
  salesOrders,
  form,
  updateForm,

  items,
  addItem,
  updateItem,
  removeItem,
  onSubmit,
  allInventories,
}: CreateAccountProps) {
  return (
    <>
      <div className="flex items-start justify-between mb-8">
        <div>
          <p className="text-xs font-semibold tracking-[0.24em] uppercase text-slate-400 mb-2">
            Accounts Receivable
          </p>
          <h2 className="text-lg md:text-xl font-semibold text-slate-900">
            Sales Invoice Registry
          </h2>
        </div>

        <button
          type="button"
          onClick={onCancel}
          className="text-xs cursor-pointer font-medium text-slate-400 hover:text-slate-600"
        >
          Cancel
        </button>
      </div>

      <form className="space-y-8">
        <div className="grid gap-4 md:grid-cols-3">
          <div className="space-y-1.5">
            <label className="text-sm font-medium text-slate-600">
              Project
            </label>
            <Select
              value={form.project_id}
              onValueChange={(v) => {
                const selectedProject = projects.find((p) => p.id === v);
                updateForm("project_id", v);

                const customerId = selectedProject?.customer_id;
                if (customerId) {
                  updateForm("customer_id", customerId);
                } else {
                  updateForm("customer_id", "");
                }
              }}
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

          <div className="space-y-1.5">
            <label className="text-sm font-medium text-slate-600">
              Customer Id
            </label>
            <input
              value={form.customer_id}
              disabled
              className="w-full rounded-2xl border px-4 py-2.5 text-sm"
              placeholder="    Customer Id"
            />
          </div>

          <div className="space-y-1.5">
            <label className="block text-sm font-medium text-slate-600">
              Sales order
            </label>
            <Select
              value={form.sales_order_id}
              onValueChange={(v) => updateForm("sales_order_id", v)}
            >
              <SelectTrigger className="w-full rounded-2xl border border-slate-200 bg-slate-50 px-4 py-2.5 text-sm text-slate-900 focus:outline-none focus:ring-2 focus:ring-slate-900 focus:bg-white">
                <SelectValue placeholder="Choose sales order" />
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

          <div className="md:col-span-3 space-y-4">
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
                    className="text-red-600  cursor-pointer text-xs flex items-center gap-1"
                  >
                    Remove
                  </button>
                </div>
                <div className="grid gap-4 md:grid-cols-2">
                  <div>
                    <label className="block text-sm font-medium text-slate-600">
                      SKU
                    </label>
                    <Select
                      value={item.sku}
                      onValueChange={(v) => updateItem(index, "sku", v)}
                    >
                      <SelectTrigger className="block w-full rounded-2xl border border-slate-200 bg-white px-4 py-2.5 text-sm">
                        <SelectValue placeholder="Select SKU" />
                      </SelectTrigger>
                      <SelectContent>
                        {allInventories.map((inv) => (
                          <SelectItem key={inv.id} value={inv.sku}>
                            {inv.sku}
                          </SelectItem>
                        ))}
                      </SelectContent>
                    </Select>
                  </div>

                  <div>
                    <label className="block text-sm font-medium text-slate-600">
                      Quantity
                    </label>
                    <input
                      type="number"
                      value={item.quantity}
                      onChange={(e) =>
                        updateItem(index, "quantity", Number(e.target.value))
                      }
                      className="block w-full rounded-2xl border border-slate-200 bg-white px-4 py-2.5 text-sm"
                    />
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>

        <div className="flex justify-between items-center">
          <button
            type="button"
            onClick={addItem}
            className="flex  cursor-pointer items-center gap-2 border rounded-2xl px-4 py-2 text-xs"
          >
            + Add item
          </button>
          <button
            type="button"
            onClick={onSubmit}
            disabled={saving}
            className="rounded-full  cursor-pointer bg-[#1f285c] text-white px-6 py-2.5 text-sm font-semibold disabled:opacity-60"
          >
            Save Sales Invoice
          </button>
        </div>
      </form>
    </>
  );
}

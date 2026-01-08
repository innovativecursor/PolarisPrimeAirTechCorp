import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { AccountSalesForm, InvoiceItem } from "./type";
import { InventoryItem } from "@/app/warehousing/components/inventory/type";
import {
  ProjectOption,
  SalesOrderRow,
} from "@/app/sales-orders/hooks/useSalesOrders";
import Required from "@/components/ui/Required";

type CreateAccountProps = {
  onCancel: () => void;
  salesOrders: SalesOrderRow[];
  projectsName: ProjectOption[];
  saving: boolean;
  form: AccountSalesForm;
  updateForm: (key: keyof AccountSalesForm, value: string) => void;

  items: InvoiceItem[];
  addItem: () => void;
  updateItem: (i: number, k: keyof InvoiceItem, v: any) => void;
  removeItem: (i: number) => void;
  loadCustomerByProject: (projectId: string) => Promise<any>;
  onSubmit: () => void;
  allInventories: InventoryItem[];
  isEdit: boolean;
};

export default function CreateAccountSales({
  onCancel,
  projectsName,
  saving,
  salesOrders,
  form,
  updateForm,
  loadCustomerByProject,
  items,
  addItem,
  updateItem,
  removeItem,
  onSubmit,
  allInventories,
  isEdit,
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
              Project <Required />
            </label>
            <Select
              value={form.project_id}
              disabled={isEdit}
              onValueChange={async (val) => {
                updateForm("project_id", val);

                if (!isEdit) {
                  updateForm("customer_id", "");
                  updateForm("customer_name", "");

                  const customer = await loadCustomerByProject(val);

                  if (customer) {
                    updateForm("customer_id", customer.id);
                    updateForm("customer_name", customer.name);
                  }
                }
              }}
            >
              <SelectTrigger className="w-full rounded-2xl">
                <SelectValue placeholder="Select project" />
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
            <label className="text-sm font-medium text-slate-600">
              Customer name
            </label>
            <input
              value={form.customer_name}
              disabled
              className="w-full rounded-2xl border px-4 py-2.5 text-sm bg-slate-100 text-slate-700"
              placeholder="Customer auto-filled from project"
            />
          </div>

          <div className="space-y-1.5">
            <label className="block text-sm font-medium text-slate-600">
              Sales order <Required />
            </label>
            <Select
              value={form.sales_order_id}
              disabled={isEdit}
              onValueChange={(v) => updateForm("sales_order_id", v)}
            >
              <SelectTrigger className="w-full rounded-2xl border border-slate-200 bg-slate-50 px-4 py-2.5 text-sm text-slate-900 focus:outline-none focus:ring-2 focus:ring-slate-900 focus:bg-white">
                <SelectValue placeholder="Choose sales order" />
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
                      SKU <Required />
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

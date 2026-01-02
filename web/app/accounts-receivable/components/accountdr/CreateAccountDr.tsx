import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { SalesInvoice } from "../accountsales/type";

type CreateSupplierProps = {
  onCancel: () => void;
  allAccountSales: SalesInvoice[];
  saving: boolean;
  selectedInvoice: SalesInvoice | null;
  onSelectInvoice: (invoice: SalesInvoice | null) => void;
  onSubmit: () => void;
};

export default function CreateAccountDr({
  onCancel,
  allAccountSales,
  saving,
  selectedInvoice,
  onSelectInvoice,
  onSubmit,
}: CreateSupplierProps) {
  return (
    <>
      <div className="flex items-start justify-between mb-8">
        <div>
          <p className="text-xs font-semibold tracking-[0.24em] uppercase text-slate-400 mb-2">
            Accounts Receivable
          </p>
          <h2 className="text-lg md:text-xl font-semibold text-slate-900">
            Create delivery receipt
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
        <div className="grid gap-4 md:grid-cols-2">
          <div className="space-y-1.5">
            <label className="text-sm font-medium text-slate-600">
              Project
            </label>
            <Select
              onValueChange={(invoiceId) => {
                const found = allAccountSales.find((a) => a.id === invoiceId);
                onSelectInvoice(found || null);
              }}
            >
              <SelectTrigger className="w-full rounded-2xl">
                <SelectValue placeholder="Select project" />
              </SelectTrigger>
              <SelectContent>
                {allAccountSales.map((a) => (
                  <SelectItem key={a.id} value={a.id}>
                    {a.project_id}
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
              disabled
              value={selectedInvoice?.customer_id || ""}
              className="w-full rounded-2xl border px-4 py-2.5 text-sm"
              placeholder="Customer Id"
            />
          </div>

          <div className="space-y-1.5">
            <label className="text-sm font-medium text-slate-600">
              Sales Order Id
            </label>
            <input
              disabled
              value={selectedInvoice?.sales_order_id || ""}
              className="w-full rounded-2xl border px-4 py-2.5 text-sm"
              placeholder="Sales Order Id"
            />
          </div>

          <div className="space-y-1.5">
            <label className="text-sm font-medium text-slate-600">
              Sales Invoice Id
            </label>
            <input
              disabled
              value={selectedInvoice?.invoice_id || ""}
              className="w-full rounded-2xl border px-4 py-2.5 text-sm"
              placeholder="Sales Invoice Id"
            />
          </div>
        </div>

        <div className="flex justify-end ">
          <button
            type="button"
            disabled={saving}
            onClick={onSubmit}
            className="rounded-full cursor-pointer bg-[#1f285c] text-white px-6 py-2.5 text-sm font-semibold disabled:opacity-60"
          >
            Save delivery receipt
          </button>
        </div>
      </form>
    </>
  );
}

import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { SalesInvoice } from "../accountsales/type";
import { ProjectOption } from "@/app/sales-orders/hooks/useSalesOrders";
import { useState } from "react";
import { toast } from "react-toastify";
import { fetchDataGet } from "@/app/lib/fetchData";
import endpoints from "@/app/lib/endpoints";
import Required from "@/components/ui/Required";

type CreateSupplierProps = {
  onCancel: () => void;
  allAccountSales: SalesInvoice[];
  saving: boolean;
  selectedInvoice: SalesInvoice | null;
  onSelectInvoice: (invoice: SalesInvoice | null) => void;
  onSubmit: (data: {
    projectId: string;
    customerId: string;
    salesOrderId: string;
    salesInvoiceId: string;
  }) => void;

  projectsName: ProjectOption[];
  loadCustomerByProject: (projectId: string) => Promise<any>;
};

export default function CreateAccountDr({
  onCancel,
  allAccountSales,
  saving,
  selectedInvoice,
  onSelectInvoice,
  onSubmit,
  projectsName,
  loadCustomerByProject,
}: CreateSupplierProps) {
  const [selectedProjectId, setSelectedProjectId] = useState<string>("");

  const [autoFill, setAutoFill] = useState<{
    customerId: string;
    salesOrderId: string;
    salesInvoiceId: string;
  } | null>(null);

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
              Project <Required />
            </label>
            <Select
              onValueChange={async (projectId) => {
                setSelectedProjectId(projectId);

                await loadCustomerByProject(projectId);

                const res = await fetchDataGet<any>(
                  endpoints.salesInvoice.customerByProject(projectId)
                );

                console.log("FULL API RES ===>", res);
                console.log("SO ID ===>", res.project.sales_order_id);
                console.log("SI ID ===>", res.sales_invoice_id);

                setAutoFill({
                  customerId: res.customer.customername,
                  salesOrderId: res.project.sales_order_id,
                  salesInvoiceId: res.project.sales_invoice_id,
                });
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
              Customer Id
            </label>
            <input
              disabled
              value={autoFill?.customerId || ""}
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
              value={autoFill?.salesOrderId || ""}
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
              value={autoFill?.salesInvoiceId || ""}
              className="w-full rounded-2xl border px-4 py-2.5 text-sm"
              placeholder="Sales Invoice Id"
            />
          </div>
        </div>

        <div className="flex justify-end ">
          <button
            className="rounded-full cursor-pointer bg-[#1f285c] text-white px-6 py-2.5 text-sm font-semibold disabled:opacity-60"
            type="button"
            disabled={saving}
            onClick={() => {
              if (!selectedProjectId || !autoFill) {
                toast.error("Please select project");
                return;
              }

              onSubmit({
                projectId: selectedProjectId,
                customerId: autoFill.customerId,
                salesOrderId: autoFill.salesOrderId,
                salesInvoiceId: autoFill.salesInvoiceId,
              });
            }}
          >
            Save delivery receipt
          </button>
        </div>
      </form>
    </>
  );
}

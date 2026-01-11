import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { ProjectOption } from "@/app/sales-orders/hooks/useSalesOrders";
import { useState } from "react";
import { toast } from "react-toastify";
import { fetchDataGet } from "@/app/lib/fetchData";
import endpoints from "@/app/lib/endpoints";
import Required from "@/components/ui/Required";

type CreateSupplierProps = {
  onCancel: () => void;
  saving: boolean;
  onSubmit: (data: {
    projectId: string;
    customerId: string;
    salesOrderId: string;
    salesInvoiceId: string;
  }) => void;

  projectsName: ProjectOption[];
};

export default function CreateAccountDr({
  onCancel,
  saving,
  onSubmit,
  projectsName,
}: CreateSupplierProps) {
  const [selectedProjectId, setSelectedProjectId] = useState("");
  const [autoFill, setAutoFill] = useState<{
    projectMongoId: string;
    customerMongoId: string;
    salesOrderMongoId: string;
    salesInvoiceMongoId: string;

    customerName: string;
    salesOrderCode: string;
    salesInvoiceCode: string;
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
                try {
                  setSelectedProjectId(projectId);

                  const res = await fetchDataGet<any>(
                    endpoints.projectinfo.infobyproject(projectId)
                  );

                  setAutoFill({
                    projectMongoId: res.project_mongo_id,
                    customerMongoId: res.customer_mongo_id,
                    salesOrderMongoId: res.sales_order_mongo_id,
                    salesInvoiceMongoId: res.invoice_mongo_id,

                    customerName: res.customer_name,
                    salesOrderCode: res.sales_order_id,
                    salesInvoiceCode: res.invoice_id,
                  });
                } catch (err) {
                  toast.error("Failed to load project data");
                  setAutoFill(null);
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
              Customer Id
            </label>
            <input
              disabled
              value={autoFill?.customerName || ""}
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
              value={autoFill?.salesOrderCode || ""}
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
              value={autoFill?.salesInvoiceCode || ""}
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
                projectId: autoFill.projectMongoId,
                customerId: autoFill.customerMongoId,
                salesOrderId: autoFill.salesOrderMongoId,
                salesInvoiceId: autoFill.salesInvoiceMongoId,
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

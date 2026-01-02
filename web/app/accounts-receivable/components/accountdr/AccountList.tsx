import { useMemo } from "react";
import { DeliveryReceipt } from "../accountsales/type";
import PolarisTable, {
  PolarisTableColumn,
} from "@/app/components/table/PolarisTable";
import { FiEdit2, FiTrash2 } from "react-icons/fi";

type AccountListProps = {
  onCreate: () => void;
  loading: boolean;
  allAccountDr: DeliveryReceipt[];
  onDelete: (row: DeliveryReceipt) => void;
};

export default function AccountList({
  onCreate,
  loading,
  allAccountDr,
  onDelete,
}: AccountListProps) {
  const columns: PolarisTableColumn[] = useMemo(
    () => [
      { key: "drnumber", header: "dr_number" },
      { key: "project", header: "Project" },

      { key: "customername", header: "Customer Name" },
      { key: "salesorderid", header: "Sales Order Id" },
      { key: "salesinvoiceid", header: "Sales Invoice Id" },
      { key: "status", header: "status" },
      { key: "actions", header: "Actions", align: "right" },
    ],
    []
  );

  const columnWidths = "1.2fr 2fr 2fr 1.5fr 1.2fr 1.2fr";

  return (
    <>
      <div className="flex items-start justify-between mb-6">
        <div>
          <p className="text-xs font-semibold tracking-[0.24em] uppercase text-slate-400 mb-2">
            Accounts Receivable
          </p>
          <h2 className="text-lg md:text-xl font-semibold text-slate-900">
            Delivery Receipt Registry
          </h2>
        </div>

        <button
          type="button"
          onClick={onCreate}
          disabled={loading}
          className="inline-flex cursor-pointer items-center rounded-[999px] bg-[#1f285c] text-white px-6 py-2.5 text-xs md:text-sm font-semibold shadow-[0_18px_40px_rgba(15,23,42,0.35)] hover:bg-[#171e48] disabled:opacity-60"
        >
          Delivery Receipt Registry
        </button>
      </div>

      <PolarisTable
        columns={columns}
        data={allAccountDr}
        columnWidths={columnWidths}
        getCell={(row, key) => {
          const o = row as DeliveryReceipt;

          if (key === "drnumber") {
            return (
              <span className="font-mono text-xs text-slate-700">
                {o?.dr_number}
              </span>
            );
          }
              if (key === "project") {
            return <span className="text-slate-900">-</span>;
          }
          if (key === "customername") {
            return <span className="text-slate-900">{o?.customer_name}</span>;
          }
          if (key === "salesorderid") {
            return <span className="text-slate-700">{o?.sales_order_id}</span>;
          }
          if (key === "salesinvoiceid") {
            return (
              <span className="text-slate-700">{o?.sales_invoice_id}</span>
            );
          }
          if (key === "status") {
            const isApproved =
              o.status.toLowerCase() === "Issued" ||
              o.status.toLowerCase() === "Ready";
            return (
              <span
                className={`inline-flex items-center rounded-full px-3 py-1 text-xs font-medium ${
                  isApproved
                    ? "bg-emerald-50 text-emerald-600"
                    : "bg-amber-50 text-amber-600"
                }`}
              >
                {o.status || "Pending"}
              </span>
            );
          }

          return (
            <div className="flex justify-end gap-3">
              <button
                type="button"
                className="inline-flex h-9 w-9 items-center justify-center rounded-full border border-slate-200 bg-white text-slate-500 hover:bg-slate-100"
              >
                <FiEdit2 className="h-3.5 w-3.5" />
              </button>

              <button
                type="button"
                onClick={() => onDelete(o)}
                className="inline-flex h-9 w-9 items-center justify-center rounded-full bg-rose-50 text-rose-500 hover:bg-rose-100"
              >
                <FiTrash2 className="h-3.5 w-3.5" />
              </button>
            </div>
          );
        }}
      />
    </>
  );
}

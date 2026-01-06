import { useMemo } from "react";
// import { DeliveryReceipt } from "../accountsales/type";
import PolarisTable, {
  PolarisTableColumn,
} from "@/app/components/table/PolarisTable";
import { FiEdit2, FiTrash2 } from "react-icons/fi";
import { DeliveryReceipt } from "./type";

type AccountListProps = {
  onCreate: () => void;
  loading: boolean;
  allAccountDr: DeliveryReceipt[];
  onDelete: (row: DeliveryReceipt) => void;
  onUpdateStatus: (id: string, status: "Ready" | "Issued") => void;
};

export default function AccountList({
  onCreate,
  loading,
  allAccountDr,
  onDelete,
  onUpdateStatus,
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
            const isReady = o.status === "Ready";
            const isIssued = o.status === "Issued";

            return (
              <span
                className={`inline-flex  items-center rounded-full px-3 py-1 text-xs font-medium
        ${
          isIssued
            ? "bg-emerald-50 text-emerald-600"
            : isReady
            ? "bg-blue-50 text-blue-600"
            : "bg-slate-100 text-slate-600"
        }`}
              >
                {o.status}
              </span>
            );
          }

          return (
            <div className="flex justify-end items-center gap-2">
              <div className="inline-flex  rounded-full border border-slate-200 bg-slate-50 p-1">
                {(["Ready", "Issued"] as const).map((status) => {
                  const active = o.status === status;

                  return (
                    <button
                      key={status}
                      type="button"
                      onClick={() => onUpdateStatus(o.id, status)}
                      className={`px-3 py-1  cursor-pointer text-xs font-medium rounded-full transition
          ${
            active
              ? status === "Issued"
                ? "bg-emerald-500 text-white shadow"
                : "bg-blue-500 text-white shadow"
              : "text-slate-600 hover:bg-slate-200"
          }`}
                    >
                      {status}
                    </button>
                  );
                })}
              </div>

              <button
                type="button"
                onClick={() => onDelete(o)}
                className="inline-flex  cursor-pointer h-9 w-9 items-center justify-center rounded-full
                 bg-rose-50 text-rose-500 hover:bg-rose-100"
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

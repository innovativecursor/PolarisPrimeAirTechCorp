import PolarisTable, {
  PolarisTableColumn,
} from "@/app/components/table/PolarisTable";
import { SalesInvoice } from "./type";
import { useMemo } from "react";
import { FiEdit2, FiTrash2 } from "react-icons/fi";

type AccountListProps = {
  onCreate: () => void;
  loading: boolean;
  allAccountSales: SalesInvoice[];
  onEdit: (id: string) => void;
  onDelete: (row: SalesInvoice) => void;
};

export default function AccountSalesList({
  onCreate,
  loading,
  allAccountSales,
  onEdit,
  onDelete,
}: AccountListProps) {
  const columns: PolarisTableColumn[] = useMemo(
    () => [
      { key: "invoiceid", header: "Invoice Id" },
      { key: "customerid", header: "Customer Id" },
      { key: "salesorderid", header: "Sales Order Id" },
      { key: "totalamount", header: "Total Amount" },
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
            Sales Invoice Registry
          </h2>
        </div>

        <button
          type="button"
          onClick={onCreate}
          disabled={loading}
          className="inline-flex cursor-pointer items-center rounded-[999px] bg-[#1f285c] text-white px-6 py-2.5 text-xs md:text-sm font-semibold shadow-[0_18px_40px_rgba(15,23,42,0.35)] hover:bg-[#171e48] disabled:opacity-60"
        >
          Sales Invoice Registry
        </button>
      </div>

      <PolarisTable
        columns={columns}
        data={allAccountSales}
        columnWidths={columnWidths}
        getCell={(row, key) => {
          const o = row as SalesInvoice;

          if (key === "invoiceid") {
            return (
              <span className="font-mono text-xs text-slate-700">
                {o?.invoice_id}
              </span>
            );
          }
          if (key === "customerid") {
            return <span className="text-slate-900">{o?.customer_id}</span>;
          }
          if (key === "salesorderid") {
            return <span className="text-slate-700">{o?.sales_order_id}</span>;
          }
          if (key === "totalamount") {
            return <span className="text-slate-700"> ₱{o?.total_amount}</span>;
          }

          return (
            <div className="flex justify-end gap-3">
              <button
                type="button"
                onClick={() => onEdit(o.id)}
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

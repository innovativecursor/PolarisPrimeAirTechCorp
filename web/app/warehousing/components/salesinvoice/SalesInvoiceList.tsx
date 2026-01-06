import PolarisTable, {
  PolarisTableColumn,
} from "@/app/components/table/PolarisTable";
import { SupplierInvoice } from "./type";
import { useMemo } from "react";
import { FiEdit2, FiTrash2 } from "react-icons/fi";

type SalesInvioceListProps = {
  onCreate: () => void;
  loading: boolean;
  allSalesInvoice: SupplierInvoice[];
  onEdit: (id: string) => void;
  onDelete: (invoice: SupplierInvoice) => void;
};

export default function SalesInvioceList({
  onCreate,
  loading,
  allSalesInvoice,
  onEdit,
  onDelete,
}: SalesInvioceListProps) {
  const columns: PolarisTableColumn[] = useMemo(
    () => [
      { key: "invoiceno", header: "Invoice No" },
      { key: "projectname", header: "Project Name" },
      { key: "customername", header: "Customer Name" },
      // { key: "salesorder", header: "Sales order" },
      { key: "vat", header: "Vat" },
      { key: "grandtotal", header: "Grand Total" },
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
            Warehousing
          </p>
          <h2 className="text-lg md:text-xl font-semibold text-slate-900">
            Sales Invoice Registry
          </h2>
        </div>

        <button
          type="button"
          onClick={onCreate}
          disabled={loading}
          className="inline-flex  cursor-pointer items-center rounded-[999px] bg-[#1f285c] text-white px-6 py-2.5 text-xs md:text-sm font-semibold shadow-[0_18px_40px_rgba(15,23,42,0.35)] hover:bg-[#171e48] disabled:opacity-60"
        >
          Add Invoice
        </button>
      </div>

      <PolarisTable
        columns={columns}
        data={allSalesInvoice}
        columnWidths={columnWidths}
        getCell={(row, key) => {
          const o = row as SupplierInvoice;

          if (key === "invoiceno") {
            return (
              <span className="font-mono text-xs text-slate-700">
                {o?.invoice_no}
              </span>
            );
          }
          if (key === "projectname") {
            return <span className="text-slate-900">-</span>;
          }
          if (key === "customername") {
            return (
              <span className="text-slate-700">-</span>
            );
          }
          //      if (key === "salesorder") {
          //   return (
          //     <span className="text-slate-700">-</span>
          //   );
          // }
          if (key === "vat") {
            return <span className="text-slate-700">{o?.vat}</span>;
          }
          if (key === "grandtotal") {
            return (
              <span className="text-slate-900 font-medium">
                ₱{o?.grand_total.toLocaleString()}
              </span>
            );
          }

          return (
            <div className="flex justify-end gap-3">
              <button
                type="button"
                onClick={() => onEdit(o.id)}
                className="inline-flex  cursor-pointer h-9 w-9 items-center justify-center rounded-full border border-slate-200 bg-white text-slate-500 hover:bg-slate-100"
              >
                <FiEdit2 className="h-3.5 w-3.5" />
              </button>

              <button
                type="button"
                onClick={() => onDelete(o)}
                className="inline-flex  cursor-pointer h-9 w-9 items-center justify-center rounded-full bg-rose-50 text-rose-500 hover:bg-rose-100"
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

import PolarisTable, {
  PolarisTableColumn,
} from "@/app/components/table/PolarisTable";
import { useMemo } from "react";
import { FiEdit2, FiTrash2 } from "react-icons/fi";
import { ReceivingReportItem } from "./type";

type ReceivingListCardProps = {
  loading: boolean;
  onCreate: () => void;
  receivingReports: ReceivingReportItem[];
  onDelete: (row: ReceivingReportItem) => void;
  onEdit: (row: ReceivingReportItem) => void;
};

export default function ReceivingListCard({
  loading,
  onCreate,
  receivingReports,
  onDelete,
  onEdit,
}: ReceivingListCardProps) {
  const columns: PolarisTableColumn[] = useMemo(
    () => [
      { key: "id", header: "Receiving Report ID" },
      { key: "deliveryreceipt", header: "Delivery Receipt" },
      { key: "purchaseorder", header: "Purchase Order" },
      { key: "salesorder", header: "Sales Order" },
      { key: "supplierinvoice", header: "Supplier Invoice" },
      { key: "actions", header: "Actions", align: "right" },
    ],
    []
  );
  const columnWidths = "1.2fr 2fr 2fr 1.5fr 1.2fr 1.2fr";
  return (
    <div className="overflow-hidden">
      {/* Card header */}
      <div className="flex items-start justify-between mb-6">
        <div>
          <p className="text-xs font-semibold tracking-[0.24em] uppercase text-slate-400 mb-2">
            Warehousing
          </p>
          <h2 className="text-lg md:text-xl font-semibold text-slate-900">
            Receiving Report Registry
          </h2>
        </div>

        <button
          type="button"
          onClick={onCreate}
          disabled={loading}
          className="inline-flex  cursor-pointer items-center rounded-[999px] bg-[#1f285c] text-white px-6 py-2.5 text-xs md:text-sm font-semibold shadow-[0_18px_40px_rgba(15,23,42,0.35)] hover:bg-[#171e48] disabled:opacity-60"
        >
          Create Receiving Report
        </button>
      </div>

      <PolarisTable
        columns={columns}
        data={receivingReports}
        columnWidths={columnWidths}
        getCell={(row, key) => {
          const o = row as ReceivingReportItem;

          if (key === "id") {
            return (
              <span className="font-mono text-xs text-slate-700">{o.id}</span>
            );
          }
          if (key === "deliveryreceipt") {
            return <span className="text-slate-900">{o.supplier_dr_id}</span>;
          }
          if (key === "purchaseorder") {
            return (
              <span className="text-slate-700">{o.purchase_order_id}</span>
            );
          }
          if (key === "salesorder") {
            return <span className="text-slate-700">{o.sales_order_id}</span>;
          }
          if (key === "supplierinvoice") {
            return (
              <span className="text-slate-700">{o.supplier_invoice_id}</span>
            );
          }

          return (
            <div className="flex justify-end gap-3">
              <button
                type="button"
                onClick={() => onEdit(o)}
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
    </div>
  );
}

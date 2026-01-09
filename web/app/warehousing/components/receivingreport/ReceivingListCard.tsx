import PolarisTable, {
  PolarisTableColumn,
} from "@/app/components/table/PolarisTable";
import { useMemo } from "react";
import { FiEdit2, FiTrash2 } from "react-icons/fi";
import { ReceivingReportItem } from "./type";
import CardHeaderSkeleton from "@/app/components/skeletons/CardHeaderSkeleton";
import TableSkeleton from "@/app/components/skeletons/TableSkeleton";

type ReceivingListCardProps = {
  loading: boolean;
  onCreate: () => void;
  receivingReports: ReceivingReportItem[];
  onDelete: (row: ReceivingReportItem) => void;
  onEdit: (row: ReceivingReportItem) => void;
  page: number;
  totalPages: number;
  onPageChange: (page: number) => void;
};

export default function ReceivingListCard({
  loading,
  onCreate,
  receivingReports,
  onDelete,
  onEdit,
  page,
  totalPages,
  onPageChange,
}: ReceivingListCardProps) {
  const columns: PolarisTableColumn[] = useMemo(
    () => [
      { key: "drnumber", header: "DR Number" },
      { key: "invoiceid", header: "Invoice ID" },
      { key: "barcode", header: "Barcode" },
      { key: "salesorder", header: "Sales Order ID" },
      { key: "sku", header: "Sku" },
      { key: "price", header: "Price" },
      { key: "actions", header: "Actions", align: "right" },
    ],
    []
  );
  const columnWidths = "1.2fr 2fr 2fr 1.5fr 1.2fr 1.2fr";
  return (
    <div className="overflow-hidden">
      {/* Card header */}
      <div className="flex items-start justify-between mb-6">
        {loading ? (
          <CardHeaderSkeleton />
        ) : (
          <div>
            <p className="text-xs font-semibold tracking-[0.24em] uppercase text-slate-400 mb-2">
              Warehousing
            </p>
            <h2 className="text-lg md:text-xl font-semibold text-slate-900">
              Receiving Report Registry
            </h2>
          </div>
        )}

        <button
          type="button"
          onClick={onCreate}
          disabled={loading}
          className="inline-flex  cursor-pointer items-center rounded-[999px] bg-[#1f285c] text-white px-6 py-2.5 text-xs md:text-sm font-semibold shadow-[0_18px_40px_rgba(15,23,42,0.35)] hover:bg-[#171e48] disabled:opacity-60"
        >
          Create Receiving Report
        </button>
      </div>

      {loading ? (
        <TableSkeleton rows={5} columns={6} />
      ) : (
        <PolarisTable
          columns={columns}
          data={receivingReports}
          columnWidths={columnWidths}
          getCell={(row, key) => {
            const o = row as ReceivingReportItem;

            if (key === "drnumber") {
              return (
                <span className="font-mono text-xs text-slate-700">
                  {o.dr_number}
                </span>
              );
            }
            if (key === "invoiceid") {
              return <span className="text-slate-900">{o.invoice_id}</span>;
            }
            if (key === "barcode") {
              return <span className="text-slate-700">{o.barcode}</span>;
            }
            if (key === "salesorder") {
              return <span className="text-slate-700">{o.sales_order_id}</span>;
            }
            if (key === "sku") {
              return <span className="text-slate-700">{o.sku}</span>;
            }
            if (key === "price") {
              return (
                <span className="font-medium text-slate-800">
                  ₱ {o.price.toLocaleString()}
                </span>
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
      )}

      <div className="flex justify-end items-center gap-3 mt-4">
        <button
          disabled={page === 1}
          onClick={() => onPageChange(page - 1)}
          className="px-3 py-1 text-sm rounded border disabled:opacity-50"
        >
          Prev
        </button>

        <span className="text-sm text-slate-600">
          Page {page} of {totalPages}
        </span>

        <button
          disabled={page === totalPages}
          onClick={() => onPageChange(page + 1)}
          className="px-3 py-1 text-sm rounded border disabled:opacity-50"
        >
          Next
        </button>
      </div>
    </div>
  );
}

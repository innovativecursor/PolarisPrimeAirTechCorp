import PolarisTable, {
  PolarisTableColumn,
} from "@/app/components/table/PolarisTable";
import { SupplierDeliveryReceipt } from "./type";
import { useMemo } from "react";
import { FiEdit2, FiTrash2 } from "react-icons/fi";
import CardHeaderSkeleton from "@/app/components/skeletons/CardHeaderSkeleton";
import TableSkeleton from "@/app/components/skeletons/TableSkeleton";

type DeliveryRLProps = {
  onCreate: () => void;
  loading: boolean;
  allDr: SupplierDeliveryReceipt[];
  onEdit: (id: string) => void;
  onDelete: (row: SupplierDeliveryReceipt) => void;
  page: number;
  onPageChange: (page: number) => void;
  total: number;
  limit: number;
};

export default function DeliveryReceiptList({
  onCreate,
  loading,
  allDr,
  onEdit,
  onDelete,
  page,
  onPageChange,
  total,
  limit,
}: DeliveryRLProps) {
  const columns: PolarisTableColumn[] = useMemo(
    () => [
      { key: "supplierdrno", header: "Supplier DR No" },
      { key: "projectname", header: "Project Name" },
      { key: "yourpono", header: "Your PO No" },
      { key: "shipto", header: "Ship To" },
      { key: "date", header: "Date" },
      { key: "dispatchdate", header: "Dispatch Date" },
      { key: "actions", header: "Actions", align: "right" },
    ],
    []
  );

  const columnWidths = "1.2fr 2fr 2fr 1.5fr 1.2fr 1.2fr";

  return (
    <>
      <div className="flex items-start justify-between mb-6">
        {loading ? (
          <CardHeaderSkeleton />
        ) : (
          <div>
            <h2 className="text-lg md:text-xl font-semibold text-slate-900">
              Delivery Receipt Registry
            </h2>
          </div>
        )}

        <button
          type="button"
          onClick={onCreate}
          disabled={loading}
          className="inline-flex  cursor-pointer items-center rounded-[999px] bg-[#1f285c] text-white px-6 py-2.5 text-xs md:text-sm font-semibold shadow-[0_18px_40px_rgba(15,23,42,0.35)] hover:bg-[#171e48] disabled:opacity-60"
        >
          Create Delivery Receipt
        </button>
      </div>

      {loading ? (
        <TableSkeleton rows={5} columns={6} />
      ) : (
        <PolarisTable
          columns={columns}
          data={allDr}
          columnWidths={columnWidths}
          getCell={(row, key) => {
            const o = row as SupplierDeliveryReceipt;

            if (key === "supplierdrno") {
              return (
                <span className="font-mono text-xs text-slate-700">
                  {o.supplier_dr_no || "-"}
                </span>
              );
            }

            if (key === "projectname") {
              return (
                <span className="text-slate-900">{o.project_name || "-"}</span>
              );
            }

            if (key === "yourpono") {
              return (
                <span className="text-slate-900">{o.your_po_no || "-"}</span>
              );
            }

            if (key === "shipto") {
              return <span className="text-slate-900">{o.ship_to || "-"}</span>;
            }

            if (key === "date") {
              return (
                <span className="text-slate-700">
                  {o.date ? new Date(o.date).toLocaleDateString() : "-"}
                </span>
              );
            }

            if (key === "dispatchdate") {
              return (
                <span className="text-slate-700">
                  {o.dispatch_date
                    ? new Date(o.dispatch_date).toLocaleDateString()
                    : "-"}
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
      )}

      <div className="mt-6 flex items-center justify-end gap-3">
        <button
          disabled={page <= 1}
          onClick={() => onPageChange(page - 1)}
          className="px-4 py-2 text-xs rounded-lg border disabled:opacity-50"
        >
          Prev
        </button>

        <span className="text-xs text-slate-600">
          Page {page} of {Math.ceil(total / limit)}
        </span>

        <button
          disabled={page * limit >= total}
          onClick={() => onPageChange(page + 1)}
          className="px-4 py-2 text-xs rounded-lg border disabled:opacity-50"
        >
          Next
        </button>
      </div>
    </>
  );
}

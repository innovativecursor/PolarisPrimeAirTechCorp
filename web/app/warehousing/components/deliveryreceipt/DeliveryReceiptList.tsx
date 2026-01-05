import PolarisTable, {
  PolarisTableColumn,
} from "@/app/components/table/PolarisTable";
import { SupplierDeliveryReceipt } from "./type";
import { useMemo } from "react";
import { FiEdit2, FiTrash2 } from "react-icons/fi";

type DeliveryRLProps = {
  onCreate: () => void;
  loading: boolean;
  allDr: SupplierDeliveryReceipt[];
  onEdit: (id: string) => void;
  onDelete: (row: SupplierDeliveryReceipt) => void;
};

export default function DeliveryReceiptList({
  onCreate,
  loading,
  allDr,
  onEdit,
  onDelete,
}: DeliveryRLProps) {
  const columns: PolarisTableColumn[] = useMemo(
    () => [
      { key: "supplierdrno", header: "Supplier DR ID" },
      { key: "projectname", header: "Project Name" },
      { key: "salesorder", header: "Sales order" },
      { key: "salesinvoice", header: "	Sales invoice" },
      { key: "date", header: "date" },
      { key: "actions", header: "Actions", align: "right" },
    ],
    []
  );

  const columnWidths = "1.2fr 2fr 2fr 1.5fr 1.2fr 1.2fr";

  return (
    <>
      <div className="flex items-start justify-between mb-6">
        <div>
          <h2 className="text-lg md:text-xl font-semibold text-slate-900">
            Delivery Receipt Registry
          </h2>
        </div>

        <button
          type="button"
          onClick={onCreate}
          disabled={loading}
          className="inline-flex items-center rounded-[999px] bg-[#1f285c] text-white px-6 py-2.5 text-xs md:text-sm font-semibold shadow-[0_18px_40px_rgba(15,23,42,0.35)] hover:bg-[#171e48] disabled:opacity-60"
        >
          Create Delivery Receipt
        </button>
      </div>

      <PolarisTable
        columns={columns}
        data={allDr}
        columnWidths={columnWidths}
        getCell={(row, key) => {
          const o = row as SupplierDeliveryReceipt;

          if (key === "supplierdrno") {
            return (
              <span className="font-mono text-xs text-slate-700">
                {o?.supplier_dr_no}
              </span>
            );
          }
          if (key === "projectname") {
            return <span className="text-slate-900">-</span>;
          }
          if (key === "salesorder") {
            return <span className="text-slate-700">-</span>;
          }
          if (key === "salesinvoice") {
            return <span className="text-slate-700">-</span>;
          }

          if (key === "date") {
            return (
              <span className="text-slate-700">
                {o?.date ? new Date(o.date).toLocaleDateString() : "-"}
              </span>
            );
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

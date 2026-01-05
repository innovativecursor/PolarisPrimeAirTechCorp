import PolarisTable, {
  PolarisTableColumn,
} from "@/app/components/table/PolarisTable";
import { SalesOrderRow } from "../hooks/useSalesOrders";
import { useMemo } from "react";
import { FiEdit2, FiTrash2 } from "react-icons/fi";

type SalesOrdersListProps = {
  orders: SalesOrderRow[];
  loading: boolean;
  onCreate: () => void;
  onEdit: (row: SalesOrderRow) => void;
  onDelete: (row: SalesOrderRow) => void;
};

export default function SalesOrdersListCard({
  orders,
  loading,
  onCreate,
  onEdit,
  onDelete,
}: SalesOrdersListProps) {
  const columns: PolarisTableColumn[] = useMemo(
    () => [
      { key: "id", header: "Sales order ID" },
      { key: "projectName", header: "Project name" },
      { key: "customerName", header: "Customer name" },
      { key: "status", header: "Status" },
      { key: "actions", header: "Actions", align: "right" },
    ],
    []
  );

  const columnWidths = "1.2fr 2.4fr 2.4fr 1.4fr 1.2fr";

  return (
    <section className="w-full mx-auto rounded-[32px] bg-white border border-slate-100 shadow-[0_24px_60px_rgba(15,23,42,0.08)] px-8 py-8">
      {/* Card header */}
      <div className="flex items-start justify-between mb-6">
        <div>
          <p className="text-xs font-semibold tracking-[0.24em] uppercase text-slate-400 mb-2">
            Sales orders
          </p>
          <h2 className="text-lg md:text-xl font-semibold text-slate-900">
            Sales Order Registry
          </h2>
        </div>

        <button
          type="button"
          onClick={onCreate}
          disabled={loading}
          className="inline-flex items-center rounded-[999px] bg-[#1f285c] text-white px-6 py-2.5 text-xs md:text-sm font-semibold shadow-[0_18px_40px_rgba(15,23,42,0.35)] hover:bg-[#171e48] disabled:opacity-60"
        >
          Create sales order
        </button>
      </div>

      <PolarisTable
        columns={columns}
        data={orders}
        columnWidths={columnWidths}
        getCell={(row, key) => {
          const o = row as SalesOrderRow;

          if (key === "id") {
            return (
              <span className="font-mono text-xs text-slate-700">{o.id}</span>
            );
          }
          if (key === "projectName") {
            return <span className="text-slate-900">{o.projectName}</span>;
          }
          if (key === "customerName") {
            return <span className="text-slate-700">{o.customerName}</span>;
          }
          if (key === "status") {
            const isApproved =
              o.status.toLowerCase() === "approved" ||
              o.status.toLowerCase() === "complete";
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
                onClick={() => onEdit(o)}
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
    </section>
  );
}

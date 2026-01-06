"use client";

import { useMemo } from "react";
import PolarisTable, {
  PolarisTableColumn,
} from "../../components/table/PolarisTable";
import { FiEdit2, FiTrash2 } from "react-icons/fi";
import { SupplierPORow } from "./types";

type SupplierPOListProps = {
  orders: SupplierPORow[];
  loading: boolean;
  onCreate: () => void;
  onEdit: (row: SupplierPORow) => void;
  onDelete?: (row: SupplierPORow) => void;
  page: number;
  totalPages: number;
  setPage: (p: number) => void;
};

export default function SupplierPOListCard({
  orders,
  loading,
  onCreate,
  onEdit,
  onDelete,
  page,
  totalPages,
  setPage,
}: SupplierPOListProps) {
  const columns: PolarisTableColumn[] = useMemo(
    () => [
      { key: "poId", header: "PO ID" },
      { key: "projectName", header: "Project name" },
      { key: "supplierName", header: "Supplier name" },
      { key: "soId", header: "SO ID" },
      { key: "status", header: "Status" },
      { key: "actions", header: "Actions", align: "right" },
    ],
    []
  );

  const columnWidths = "1.2fr 2fr 2fr 1.5fr 1.2fr 1.2fr";

  console.log(orders, "kkkkk");

  return (
    <section className="w-full mx-auto rounded-[32px] bg-white border border-slate-100 shadow-[0_24px_60px_rgba(15,23,42,0.08)] px-8 py-8">
      {/* Card header */}
      <div className="flex items-start justify-between mb-6">
        <div>
          <p className="text-xs font-semibold tracking-[0.24em] uppercase text-slate-400 mb-2">
            Supplier purchase orders
          </p>
          <h2 className="text-lg md:text-xl font-semibold text-slate-900">
            Supplier PO Registry
          </h2>
        </div>

        <button
          type="button"
          onClick={onCreate}
          disabled={loading}
          className="inline-flex  cursor-pointer items-center rounded-[999px] bg-[#1f285c] text-white px-6 py-2.5 text-xs md:text-sm font-semibold shadow-[0_18px_40px_rgba(15,23,42,0.35)] hover:bg-[#171e48] disabled:opacity-60"
        >
          Create supplier PO
        </button>
      </div>

      <PolarisTable
        columns={columns}
        data={orders}
        columnWidths={columnWidths}
        getCell={(row, key) => {
          const o = row as SupplierPORow;

          if (key === "poId") {
            return (
              <span className="font-mono text-xs text-slate-700">{o.poId}</span>
            );
          }
          if (key === "projectName") {
            return <span className="text-slate-900">{o.projectName}</span>;
          }
          if (key === "supplierName") {
            return <span className="text-slate-700">{o.supplierName}</span>;
          }
          if (key === "soId") {
            return (
              <span className="font-mono text-xs text-slate-700">{o.soId}</span>
            );
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
                className="inline-flex  cursor-pointer h-9 w-9 items-center justify-center rounded-full border border-slate-200 bg-white text-slate-500 hover:bg-slate-100"
              >
                <FiEdit2 className="h-3.5 w-3.5" />
              </button>

              {onDelete && (
                <button
                  type="button"
                  onClick={() => onDelete(o)}
                  className="inline-flex  cursor-pointer h-9 w-9 items-center justify-center rounded-full bg-rose-50 text-rose-500 hover:bg-rose-100"
                >
                  <FiTrash2 className="h-3.5 w-3.5" />
                </button>
              )}
            </div>
          );
        }}
      />
      <div className="mt-6 flex items-center justify-end gap-3">
        <button
          disabled={page <= 1}
          onClick={() => setPage(page - 1)}
          className="px-4 py-2 text-xs  cursor-pointer rounded-lg border disabled:opacity-50"
        >
          Prev
        </button>

        <span className="text-xs text-slate-600">
          Page {page} of {totalPages}
        </span>

        <button
          disabled={page >= totalPages}
          onClick={() => setPage(page + 1)}
          className="px-4 py-2 text-xs  cursor-pointer rounded-lg border disabled:opacity-50"
        >
          Next
        </button>
      </div>
    </section>
  );
}

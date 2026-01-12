import PolarisTable, {
  PolarisTableColumn,
} from "@/app/components/table/PolarisTable";
import { Supplier } from "./type";
import { useMemo } from "react";
import { FiEdit2, FiTrash2 } from "react-icons/fi";
import CardHeaderSkeleton from "@/app/components/skeletons/CardHeaderSkeleton";
import TableSkeleton from "@/app/components/skeletons/TableSkeleton";

type SupplierListProps = {
  onCreate: () => void;
  loading: boolean;
  allSupplier: Supplier[];
  onEdit: (id: string) => void;
  onDelete: (supplier: Supplier) => void;
};

export default function SupplierList({
  onCreate,
  loading,
  allSupplier,
  onEdit,
  onDelete,
}: SupplierListProps) {
  const columns: PolarisTableColumn[] = useMemo(
    () => [
      { key: "suppliercode", header: "Supplier code" },
      { key: "suppliername", header: "Supplier name" },
      { key: "tinnumber", header: "TIN number" },
      { key: "organization", header: "Organization" },
      { key: "location", header: "Location" },
      { key: "actions", header: "Actions", align: "right" },
    ],
    []
  );

  const columnWidths = "1.2fr 2fr 2fr 1.5fr 1.2fr 1.2fr";
  return (
    <>
      <div className="flex md:items-start md:flex-row flex-col md:gap-0 gap-4 md:justify-between justify-center mb-6">
        {loading ? (
          <CardHeaderSkeleton />
        ) : (
          <div className="text-center md:text-start">
            <p className="text-xs font-semibold tracking-[0.24em] uppercase text-slate-400 mb-2">
              Warehousing
            </p>
            <h2 className="text-lg md:text-xl font-semibold text-slate-900">
              Supplier Registry
            </h2>
          </div>
        )}

        <button
          type="button"
          onClick={onCreate}
          disabled={loading}
          className=" text-center  cursor-pointer items-center rounded-[999px] bg-[#1f285c] text-white px-6 py-2.5 text-xs md:text-sm font-semibold shadow-[0_18px_40px_rgba(15,23,42,0.35)] hover:bg-[#171e48] disabled:opacity-60"
        >
          Add Supplier
        </button>
      </div>

      {loading ? (
        <TableSkeleton rows={5} columns={6} />
      ) : (
        <PolarisTable
          columns={columns}
          data={allSupplier}
          columnWidths={columnWidths}
          getCell={(row, key) => {
            const o = row as Supplier;

            if (key === "suppliercode") {
              return <span className="text-slate-900">{o?.supplier_code}</span>;
            }
            if (key === "suppliername") {
              return <span className="text-slate-700">{o?.supplier_name}</span>;
            }

            if (key === "tinnumber") {
              return <span className="text-slate-700">{o?.tin_number}</span>;
            }

            if (key === "organization") {
              return <span className="text-slate-700">{o?.organization}</span>;
            }

            if (key === "location") {
              return <span className="text-slate-700">{o?.location}</span>;
            }

            return (
              <div className="flex justify-end gap-3">
                <button
                  type="button"
                  onClick={() => onEdit(o?.id)}
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
    </>
  );
}

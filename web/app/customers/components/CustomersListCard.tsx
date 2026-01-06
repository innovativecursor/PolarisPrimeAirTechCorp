import PolarisTable, {
  PolarisTableColumn,
} from "@/app/components/table/PolarisTable";
import { CustomerRow } from "../hooks/useCustomers";
import { useMemo } from "react";
import { FiEdit2, FiTrash2 } from "react-icons/fi";

type CustomersListProps = {
  customers: CustomerRow[];
  loading: boolean;
  onCreate: () => void;
  onEdit: (row: CustomerRow) => void;
  onDelete: (row: CustomerRow) => void;
};

export default function CustomersListCard({
  customers,
  loading,
  onCreate,
  onEdit,
  onDelete,
}: CustomersListProps) {
  const columns: PolarisTableColumn[] = useMemo(
    () => [
      { key: "id", header: "Customer ID" },
      { key: "name", header: "Customer name" },
      { key: "org", header: "Customer organization" },
      { key: "location", header: "Location" },
      { key: "tin", header: "TIN number" },
      { key: "actions", header: "Actions", align: "right" },
    ],
    []
  );

  const columnWidths = "1.4fr 2.2fr 2.2fr 2fr 1.4fr 1.2fr";

  return (
    <section className="w-full mx-auto rounded-[32px] bg-white border border-slate-100 shadow-[0_24px_60px_rgba(15,23,42,0.08)] px-8 py-8">
      {/* Card header */}
      <div className="flex items-start justify-between mb-6">
        <div>
          <p className="text-xs font-semibold tracking-[0.24em] uppercase text-slate-400 mb-2">
            Customers
          </p>
          <h2 className="text-lg md:text-xl font-semibold text-slate-900">
            Customer directory
          </h2>
        </div>

        <button
          type="button"
          onClick={onCreate}
          className="inline-flex cursor-pointer items-center rounded-[999px] bg-[#1f285c] text-white px-6 py-2.5 text-xs md:text-sm font-semibold shadow-[0_18px_40px_rgba(15,23,42,0.35)] hover:bg-[#171e48]"
        >
          Add customer
        </button>
      </div>

      <PolarisTable
        columns={columns}
        data={customers}
        columnWidths={columnWidths}
        getCell={(row, key) => {
          const c = row as CustomerRow;

          if (key === "id") {
            return (
              <span className="font-mono text-xs text-slate-700">{c.id}</span>
            );
          }
          if (key === "name") {
            return <span className="text-slate-900">{c.name}</span>;
          }
          if (key === "org") {
            return <span className="text-slate-700">{c.org}</span>;
          }
          if (key === "location") {
            return <span className="text-slate-600">{c.location}</span>;
          }
          if (key === "tin") {
            return <span className="text-slate-600">{c.tin}</span>;
          }

          return (
            <div className="flex justify-end gap-3">
              {/* Edit */}
              <button
                type="button"
                onClick={() => onEdit(c)}
                className="inline-flex items-center  cursor-pointer gap-1.5 rounded-full border border-slate-300 bg-[#eef1f8] px-3 py-1.5 text-xs text-slate-600 hover:bg-[#e4e8f3]"
              >
                <span className="inline-flex h-5 w-5 items-center justify-center rounded-full text-slate-500">
                  <FiEdit2 className="h-3.5 w-3.5" />
                </span>
              </button>

              {/* Delete */}
              <button
                type="button"
                onClick={() => onDelete(c)}
                className="inline-flex   cursor-pointer items-center gap-1.5 rounded-full border border-[#f9a8b8] bg-[#ffe6eb] px-3 py-1.5 text-xs text-[#e11d48] hover:bg-[#ffd7e0]"
              >
                <span className="inline-flex h-5 w-5 items-center justify-center rounded-full  text-[#e11d48]">
                  <FiTrash2 className="h-3.5 w-3.5" />
                </span>
              </button>
            </div>
          );
        }}
      />
    </section>
  );
}

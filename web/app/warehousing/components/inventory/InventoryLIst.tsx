import { useMemo } from "react";
import { InventoryItem } from "./type";
import PolarisTable, {
  PolarisTableColumn,
} from "@/app/components/table/PolarisTable";
import { FiEdit2, FiTrash2 } from "react-icons/fi";

type InventoryListProps = {
  loading: boolean;
  onCreate: () => void;
  allInventories: InventoryItem[];
  onEdit: (item: InventoryItem) => void;
  onDelete: (item: InventoryItem) => void;
};

export default function InventoryList({
  onCreate,
  loading,
  allInventories,
  onEdit,
  onDelete,
}: InventoryListProps) {
  const columns: PolarisTableColumn[] = useMemo(
    () => [
      { key: "sku", header: "SKU" },
      { key: "modelnumber", header: "Model number" },
      { key: "airconname", header: "Aircon name" },
      { key: "hp", header: "HP" },
      { key: "type", header: "Type" },
      { key: "unit", header: "Unit" },
      { key: "actions", header: "Actions", align: "right" },
    ],
    []
  );

  const columnWidths = "1.2fr 2fr 2fr 1.5fr 1.2fr 1.2fr";
  return (
    <section>
      <div className="flex items-start justify-between mb-6">
        <div>
          <p className="text-xs font-semibold tracking-[0.24em] uppercase text-slate-400 mb-2">
            Warehousing
          </p>
          <h2 className="text-lg md:text-xl font-semibold text-slate-900">
            Inventory Registry
          </h2>
        </div>

        <button
          type="button"
          onClick={onCreate}
          disabled={loading}
          className="inline-flex items-center rounded-[999px] bg-[#1f285c] text-white px-6 py-2.5 text-xs md:text-sm font-semibold shadow-[0_18px_40px_rgba(15,23,42,0.35)] hover:bg-[#171e48] disabled:opacity-60"
        >
          Add Inventory
        </button>
      </div>

      <PolarisTable
        columns={columns}
        data={allInventories}
        columnWidths={columnWidths}
        getCell={(row, key) => {
          const o = row as InventoryItem;

          if (key === "sku") {
            return <span className="text-slate-900">{o.sku}</span>;
          }
          if (key === "modelnumber") {
            return (
              <span className="text-slate-700">{o.aircon_model_number}</span>
            );
          }

          if (key === "airconname") {
            return <span className="text-slate-700">{o.aircon_name}</span>;
          }

          if (key === "hp") {
            return <span className="text-slate-700">{o.hp}</span>;
          }

          if (key === "type") {
            return <span className="text-slate-700">{o.type_of_aircon}</span>;
          }

          if (key === "unit") {
            return (
              <span className="text-slate-700">{o.indoor_outdoor_unit}</span>
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

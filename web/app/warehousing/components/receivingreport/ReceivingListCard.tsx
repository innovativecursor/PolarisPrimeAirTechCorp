import PolarisTable, {
  PolarisTableColumn,
} from "@/app/components/table/PolarisTable";
import { useMemo } from "react";
import { FiEdit2, FiTrash2 } from "react-icons/fi";

type ReceivingListCardProps = {
  loading: boolean;
  onCreate: () => void;
};

export default function ReceivingListCard({
  loading,
  onCreate,
}: ReceivingListCardProps) {
  const columns: PolarisTableColumn[] = useMemo(
    () => [
      { key: "id", header: "Receiving Report ID" },
      { key: "deliveryreceipt", header: "Delivery Receipt" },
      { key: "purchaseorder", header: "Purchase Order" },
      { key: "salesorder", header: "Sales Order" },
      { key: "supplierinvoice", header: "Supplier Invoice" },
      { key: "status", header: "Status" },
      { key: "actions", header: "Actions", align: "right" },
    ],
    []
  );
  const columnWidths = "1.2fr 2fr 2fr 1.5fr 1.2fr 1.2fr";
  return (
    <div>
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
          className="inline-flex items-center rounded-[999px] bg-[#1f285c] text-white px-6 py-2.5 text-xs md:text-sm font-semibold shadow-[0_18px_40px_rgba(15,23,42,0.35)] hover:bg-[#171e48] disabled:opacity-60"
        >
          Create supplier PO
        </button>
      </div>

      <PolarisTable
        columns={columns}
        data={[]}
        columnWidths={columnWidths}
        getCell={(row, key) => {
          return (
            <div className="flex justify-end gap-3">
              <button
                type="button"
                className="inline-flex h-9 w-9 items-center justify-center rounded-full border border-slate-200 bg-white text-slate-500 hover:bg-slate-100"
              >
                <FiEdit2 className="h-3.5 w-3.5" />
              </button>

              <button
                type="button"
                className="inline-flex h-9 w-9 items-center justify-center rounded-full bg-rose-50 text-rose-500 hover:bg-rose-100"
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

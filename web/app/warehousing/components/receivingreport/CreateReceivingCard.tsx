type CreateReceivingCardProps = {
  onCancel: () => void;
};

export default function CreateReceivingCard({
  onCancel,
}: CreateReceivingCardProps) {
  return (
    <div className="space-y-8">
      {/*  HEADER */}
      <div className="flex items-start justify-between">
        <div>
          <p className="text-xs font-semibold tracking-[0.24em] uppercase text-slate-400 mb-2">
            Warehousing
          </p>
          <h2 className="text-lg md:text-xl font-semibold text-slate-900">
            Create receiving report
          </h2>
        </div>

        <button
          type="button"
          onClick={onCancel}
          className="text-xs font-medium text-slate-400 hover:text-slate-600"
        >
          Cancel
        </button>
      </div>

      <section className="rounded-[24px] bg-white border border-slate-200 px-8 py-8">
        <div className="grid gap-6 lg:grid-cols-3">
          <div className="space-y-2">
            <label className="text-sm font-medium text-slate-600">
              Select delivery receipt
            </label>
            <select className="w-full rounded-2xl border border-slate-300 bg-slate-100 px-4 py-3 text-sm">
              <option>Choose a delivery receipt</option>
            </select>
          </div>

          <div className="space-y-2">
            <label className="text-sm font-medium text-slate-600">
              Select purchase order
            </label>
            <select className="w-full rounded-2xl border border-slate-300 bg-slate-100 px-4 py-3 text-sm">
              <option>Choose a purchase order</option>
            </select>
          </div>

          <div className="space-y-2">
            <label className="text-sm font-medium text-slate-600">
              Select sales order
            </label>
            <select className="w-full rounded-2xl border border-slate-300 bg-slate-100 px-4 py-3 text-sm">
              <option>Choose a sales order</option>
            </select>
          </div>

          <div className="space-y-2 md:col-span-1">
            <label className="text-sm font-medium text-slate-600">
              Supplier invoice number
            </label>
            <select className="w-full rounded-2xl border border-slate-300 bg-slate-100 px-4 py-3 text-sm">
              <option>Choose supplier invoice</option>
            </select>
          </div>
        </div>
      </section>

      <section className="rounded-[24px] bg-white border border-slate-300 px-8 py-8 space-y-6">
        <div>
          <h3 className="text-lg font-semibold text-slate-900 mb-1">
            Add item
          </h3>
          <p className="text-sm text-slate-500">
            Use camera or scanner to capture SKU barcode.
          </p>
        </div>

        <div className="grid gap-6 lg:grid-cols-3">
          <div className="space-y-2">
            <label className="text-sm font-medium text-slate-600">SKU</label>
            <input
              placeholder="Eg. SKU-001-AC"
              className="w-full rounded-2xl border border-slate-300 bg-slate-100 px-4 py-3 text-sm"
            />
          </div>

          <div className="space-y-2">
            <label className="text-sm font-medium text-slate-600">
              Aircon model number
            </label>
            <input
              placeholder="Eg. MX-1200"
              className="w-full rounded-2xl border border-slate-300 bg-slate-100 px-4 py-3 text-sm"
            />
          </div>

          <div className="space-y-2">
            <label className="text-sm font-medium text-slate-600">
              Aircon name
            </label>
            <input
              placeholder="Eg. 1.5HP Window aircon"
              className="w-full rounded-2xl border border-slate-300 bg-slate-100 px-4 py-3 text-sm"
            />
          </div>

          <div className="space-y-2">
            <label className="text-sm font-medium text-slate-600">
              HP (Horsepower)
            </label>
            <input
              placeholder="1.5"
              className="w-full rounded-2xl border border-slate-300 bg-slate-100 px-4 py-3 text-sm"
            />
          </div>

          <div className="space-y-2">
            <label className="text-sm font-medium text-slate-600">
              Type of aircon
            </label>
            <select className="w-full rounded-2xl border border-slate-300 bg-slate-100 px-4 py-3 text-sm">
              <option>Select type</option>
              <option>Window</option>
              <option>Split</option>
              <option>Cassette</option>
              <option>VRF</option>
            </select>
          </div>

          <div className="space-y-2">
            <label className="text-sm font-medium text-slate-600">
              Indoor / outdoor unit
            </label>
            <select className="w-full rounded-2xl border border-slate-300 bg-slate-100 px-4 py-3 text-sm">
              <option>Select unit type</option>
              <option>Indoor</option>
              <option>Outdoor</option>
            </select>
          </div>
        </div>
      </section>

      <div className="flex items-center justify-end gap-4 pt-4">
        <button
          type="button"
          onClick={onCancel}
          className="rounded-full px-6 py-2.5 text-sm font-medium text-slate-500 hover:text-slate-700"
        >
          Cancel
        </button>

        <button
          type="button"
          className="rounded-full bg-[#1f285c] px-6 py-2.5 text-sm font-semibold text-white shadow hover:bg-[#171e48]"
        >
          Save receiving report
        </button>
      </div>
    </div>
  );
}

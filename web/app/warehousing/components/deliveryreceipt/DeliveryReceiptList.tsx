type DeliveryRLProps = {
  onCreate: () => void;
  loading: boolean;
};

export default function DeliveryReceiptList({
  onCreate,
  loading,
}: DeliveryRLProps) {
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
    </>
  );
}

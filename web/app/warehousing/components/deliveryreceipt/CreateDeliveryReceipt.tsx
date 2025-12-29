type CreateDRProps = {
  onCancel: () => void;
};

export default function CreateDeliveryReceipt({ onCancel }: CreateDRProps) {
  return (
    <>
      <div className="flex items-start justify-between mb-8">
        <div>
          <h2 className="text-lg md:text-xl font-semibold text-slate-900">
            Create delivery receipt
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
    </>
  );
}

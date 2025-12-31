import { useEffect, useState } from "react";

type CreateSupplierProps = {
  onCancel: () => void;

  saving: boolean;
};

export default function CreateAccountDr({
  onCancel,

  saving,
}: CreateSupplierProps) {
  return (
    <>
      <div className="flex items-start justify-between mb-8">
        <div>
          <p className="text-xs font-semibold tracking-[0.24em] uppercase text-slate-400 mb-2">
            Accounts Receivable
          </p>
          <h2 className="text-lg md:text-xl font-semibold text-slate-900">
            Create delivery receipt
          </h2>
        </div>

        <button
          type="button"
          onClick={onCancel}
          className="text-xs cursor-pointer font-medium text-slate-400 hover:text-slate-600"
        >
          Cancel
        </button>
      </div>
    </>
  );
}

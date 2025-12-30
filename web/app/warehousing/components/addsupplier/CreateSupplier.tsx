import { useEffect, useState } from "react";
import { Supplier, SupplierForm } from "./type";

type CreateSupplierProps = {
  onCancel: () => void;
  onSubmit: (data: SupplierForm) => void;
  saving: boolean;
  initialData?: Supplier | null;
};

export default function CreateSupplier({
  onCancel,
  onSubmit,
  saving,
  initialData,
}: CreateSupplierProps) {
  const [form, setForm] = useState<SupplierForm>({
    supplier_code: "",
    supplier_name: "",
    tin_number: "",
    organization: "",
    location: "",
  });

  const handleChange = (
    e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>
  ) => {
    const { name, value } = e.target;
    setForm((p) => ({ ...p, [name]: value }));
  };

  useEffect(() => {
    if (initialData) {
      setForm({
        supplier_code: initialData.supplier_code,
        supplier_name: initialData.supplier_name,
        tin_number: initialData.tin_number,
        organization: initialData.organization,
        location: initialData.location,
      });
    }
  }, [initialData]);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    onSubmit(form);
  };

  return (
    <>
      <div className="flex items-start justify-between mb-8">
        <div>
          <p className="text-xs font-semibold tracking-[0.24em] uppercase text-slate-400 mb-2">
            Warehousing
          </p>
          <h2 className="text-lg md:text-xl font-semibold text-slate-900">
            {initialData ? "Edit supplier" : "Add supplier"}
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
      <form className="space-y-8" onSubmit={handleSubmit}>
        <div className="grid gap-6 lg:grid-cols-3">
          <div className="space-y-1.5">
            <label className="block text-sm font-medium text-slate-600">
              Supplier name
            </label>
            <input
              name="supplier_name"
              value={form.supplier_name}
              onChange={handleChange}
              type="text"
              className="block w-full rounded-2xl border border-slate-200 bg-slate-50 px-4 py-2.5 text-sm text-slate-900 focus:outline-none focus:ring-2 focus:ring-slate-900 focus:bg-white"
              placeholder="Supplier name"
            />
          </div>

          <div className="space-y-1.5">
            <label className="block text-sm font-medium text-slate-600">
              Supplier code
            </label>
            <input
              name="supplier_code"
              value={form.supplier_code}
              onChange={handleChange}
              type="text"
              className="block w-full rounded-2xl border border-slate-200 bg-slate-50 px-4 py-2.5 text-sm text-slate-900 focus:outline-none focus:ring-2 focus:ring-slate-900 focus:bg-white"
              placeholder="Supplier code"
            />
          </div>

          <div className="space-y-1.5">
            <label className="block text-sm font-medium text-slate-600">
              TIN number
            </label>
            <input
              name="tin_number"
              value={form.tin_number}
              onChange={handleChange}
              type="text"
              className="block w-full rounded-2xl border border-slate-200 bg-slate-50 px-4 py-2.5 text-sm text-slate-900 focus:outline-none focus:ring-2 focus:ring-slate-900 focus:bg-white"
              placeholder="TIN number"
            />
          </div>

          <div className="space-y-1.5">
            <label className="block text-sm font-medium text-slate-600">
              Organization name
            </label>
            <input
              name="organization"
              value={form.organization}
              onChange={handleChange}
              type="text"
              className="block w-full rounded-2xl border border-slate-200 bg-slate-50 px-4 py-2.5 text-sm text-slate-900 focus:outline-none focus:ring-2 focus:ring-slate-900 focus:bg-white"
              placeholder="Organization name"
            />
          </div>

          <div className="space-y-1.5">
            <label className="block text-sm font-medium text-slate-600">
              Location
            </label>

            <select
              name="location"
              value={form.location}
              onChange={handleChange}
              className="w-full rounded-2xl border border-slate-300 bg-slate-100 px-4 py-3 text-sm"
            >
              <option value="" hidden>
                Choose a location
              </option>
              <option value="apac">APAC</option>
              <option value="emea">EMEA</option>
              <option value="americas">Americas</option>
            </select>
          </div>
        </div>
        <div className="flex items-center justify-end gap-4 pt-4">
          <button
            className="rounded-full px-6 py-2.5 text-sm font-medium text-slate-500 hover:text-slate-700"
            type="button"
            onClick={onCancel}
          >
            Cancel
          </button>
          <button
            type="submit"
            disabled={saving}
            className="inline-flex cursor-pointer items-center rounded-[999px] bg-[#1f285c] text-white px-6 py-2.5 text-sm font-semibold shadow-[0_18px_40px_rgba(15,23,42,0.35)] hover:bg-[#171e48] disabled:opacity-60"
          >
            {saving
              ? "Saving..."
              : initialData
              ? "Update supplier"
              : "Save supplier"}
          </button>
        </div>
      </form>
    </>
  );
}

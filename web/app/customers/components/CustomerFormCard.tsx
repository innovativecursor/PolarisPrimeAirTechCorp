import { useState } from "react";
import { CustomerFormValues, CustomerRow } from "../hooks/useCustomers";
import Required from "@/components/ui/Required";

type CustomerFormCardProps = {
  initialValues?: CustomerRow;
  saving: boolean;
  onCancel: () => void;
  onSubmit: (values: CustomerFormValues) => Promise<void> | void;
};

export default function CustomerFormCard({
  initialValues,
  saving,
  onCancel,
  onSubmit,
}: CustomerFormCardProps) {
  const [form, setForm] = useState<CustomerFormValues>(() => ({
    id: initialValues?.id,
    name: initialValues?.name || "",
    org: initialValues?.org || "",
    location: initialValues?.location || "",
    city: initialValues?.city || "",
    tin: initialValues?.tin || "",
  }));


  const isEdit = Boolean(initialValues);

  const handleChange =
    (field: keyof CustomerFormValues) =>
    (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>) => {
      setForm((prev) => ({ ...prev, [field]: e.target.value }));
    };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    await onSubmit(form);
  };

  return (
    <section className=" bg-white border border-slate-100 shadow-[0_24px_60px_rgba(15,23,42,0.08)]  md:rounded-[32px] rounded-md md:px-8 px-4 py-8">
      {/* Header */}
      <div className="flex items-start justify-between mb-8">
        <div>
          <p className="text-xs font-semibold tracking-[0.24em] uppercase text-slate-400 mb-2">
            Customers
          </p>
          <h2 className="text-2xl font-semibold text-slate-900">
            {isEdit ? "Edit customer" : "Add new customer"}
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

      {/* Form layout – matches screenshot structure */}
      <form onSubmit={handleSubmit} className="space-y-6">
        <div className="grid gap-5 md:grid-cols-2">
          {/* Customer ID (readonly / informational) */}
          <div className="space-y-2">
            <label className="block text-xs font-semibold tracking-[0.16em] uppercase text-slate-500">
              Customer ID
            </label>
            <input
              type="text"
              value={form.id || "Auto-assigned"}
              disabled
              className="block w-full rounded-2xl border border-slate-200 bg-slate-50 px-4 py-3 text-sm text-slate-500"
            />
          </div>

          {/* Customer name */}
          <div className="space-y-2">
            <label className="block text-xs font-semibold tracking-[0.16em] uppercase text-slate-500">
              Customer name <Required />
            </label>
            <input
              type="text"
              value={form.name}
              onChange={handleChange("name")}
              required
              placeholder="Eg. MetroCool Services"
              className="block w-full rounded-2xl border border-slate-200 bg-[#f7f8fb] px-4 py-3 text-sm text-slate-900 placeholder:text-slate-400 focus:outline-none focus:ring-2 focus:ring-slate-900 focus:bg-white"
            />
          </div>

          {/* TIN number */}
          <div className="space-y-2">
            <label className="block text-xs font-semibold tracking-[0.16em] uppercase text-slate-500">
              TIN number <Required />
            </label>
            <input
              type="text"
              value={form.tin}
              onChange={handleChange("tin")}
              required
              placeholder="1as"
              className="block w-full rounded-2xl border border-slate-200 bg-[#f7f8fb] px-4 py-3 text-sm text-slate-900 placeholder:text-slate-400 focus:outline-none focus:ring-2 focus:ring-slate-900 focus:bg-white"
            />
          </div>

          {/* Customer organization */}
          <div className="space-y-2">
            <label className="block text-xs font-semibold tracking-[0.16em] uppercase text-slate-500">
              Customer organization <Required />
            </label>
            <input
              type="text"
              value={form.org}
              onChange={handleChange("org")}
              required
              placeholder="Business unit"
              className="block w-full rounded-2xl border border-slate-200 bg-[#f7f8fb] px-4 py-3 text-sm text-slate-900 placeholder:text-slate-400 focus:outline-none focus:ring-2 focus:ring-slate-900 focus:bg-white"
            />
          </div>

          {/* Customer location */}
          <div className="space-y-2">
            <label className="block text-xs font-semibold tracking-[0.16em] uppercase text-slate-500">
              Customer Address  <Required />
            </label>
            <input
              type="text"
              value={form.location}
              onChange={handleChange("location")}
              required
              placeholder="Choose a location or type an address"
              className="block w-full rounded-2xl border border-slate-200 bg-[#f7f8fb] px-4 py-3 text-sm text-slate-900 placeholder:text-slate-400 focus:outline-none focus:ring-2 focus:ring-slate-900 focus:bg-white"
            />
          </div>
          {/* Customer city */}
          <div className="space-y-2">
            <label className="block text-xs font-semibold tracking-[0.16em] uppercase text-slate-500">
              City <Required />
            </label>
            <input
              type="text"
              value={form.city}
              onChange={handleChange("city")}
              required
              placeholder="Eg. Mumbai"
              className="block w-full rounded-2xl border border-slate-200 bg-[#f7f8fb] px-4 py-3 text-sm text-slate-900 placeholder:text-slate-400 focus:outline-none focus:ring-2 focus:ring-slate-900 focus:bg-white"
            />
          </div>
        </div>

        {/* Footer actions */}
        <div className="mt-6 flex justify-end">
          <button
            type="submit"
            disabled={saving}
            className="inline-flex cursor-pointer items-center rounded-[999px] bg-[#1f285c] px-6 py-2.5 text-sm font-semibold text-white shadow-[0_18px_40px_rgba(15,23,42,0.35)] hover:bg-[#171e48] disabled:opacity-60 disabled:cursor-not-allowed"
          >
            {saving ? "Saving…" : "Save customer"}
          </button>
        </div>
      </form>
    </section>
  );
}

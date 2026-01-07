import { CustomerRow } from "@/app/customers/hooks/useCustomers";
import { ProjectFormValues, ProjectRow } from "../hooks/useProjects";
import { useEffect, useState } from "react";

type CreateProjectCardProps = {
  initialValues?: ProjectRow;
  saving: boolean;
  customers: CustomerRow[];
  onCancel: () => void;
  onSubmit: (values: ProjectFormValues) => Promise<void> | void;
};

export default function CreateProjectCard({
  initialValues,
  saving,
  onCancel,
  customers,
  onSubmit,
}: CreateProjectCardProps) {
  const [form, setForm] = useState<ProjectFormValues>(() => ({
    projectId:
      initialValues?._raw?.project_id || initialValues?.id || "PRJ-7122",
    projectName: initialValues?._raw?.project_name || "",
    customerLocation:
      initialValues?._raw?.customer?.address ||
      initialValues?._raw?.customer_address ||
      "",
    customerOrganisation: initialValues?._raw?.customer?.organization || "",
    customerId:
      initialValues?._raw?.customer?.id ||
      initialValues?._raw?.customer?._id ||
      "",
    deploymentNotes: initialValues?._raw?.notes || "",
  }));

  const handleCustomerSelect = (customerId: string) => {
    const selected = customers.find((c) => c.id === customerId);

    if (!selected) return;

    setForm((prev) => ({
      ...prev,
      customerId: selected.id,
      customerOrganisation: selected.org,
      customerLocation: selected.location,
    }));
  };

  useEffect(() => {
    if (!initialValues) return;

    const customerFromList = customers.find(
      (c) => c.id === initialValues._raw?.customer?.id
    );

    setForm({
      projectId: initialValues._raw?.project_id || "",
      projectName: initialValues._raw?.project_name || "",
      customerId: initialValues._raw?.customer?.id || "",
      customerOrganisation: initialValues._raw?.customer?.organization || "",
      customerLocation: customerFromList?.location || "",
      deploymentNotes: initialValues._raw?.notes || "",
    });
  }, [initialValues, customers]);

  const handleChange =
    (field: keyof ProjectFormValues) =>
    (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>) => {
      setForm((prev) => ({ ...prev, [field]: e.target.value }));
    };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    await onSubmit(form);
  };

  const isEdit = Boolean(initialValues);

  return (
    <section className="rounded-3xl bg-white border border-slate-100 shadow-md shadow-slate-200/60 px-6 py-6 md:px-10 md:py-8">
      {/* Card header */}
      <div className="flex items-start justify-between mb-6">
        <div>
          <p className="text-xs font-semibold tracking-[0.22em] uppercase text-slate-400 mb-2">
            Projects
          </p>
          <h2 className="text-lg md:text-xl font-semibold text-slate-900">
            {isEdit ? "Edit project" : "Create new project"}
          </h2>
        </div>

        <button
          type="button"
          onClick={onCancel}
          className="text-xs  cursor-pointer font-medium text-slate-400 hover:text-slate-600"
        >
          Cancel
        </button>
      </div>

      {/* Form */}
      <form onSubmit={handleSubmit} className="space-y-6">
        <div className="grid gap-4 md:grid-cols-2">
          {/* Project ID – purely display/client-side right now */}
          <div className="space-y-1.5">
            <label className="block text-xs font-semibold text-slate-500 uppercase tracking-[0.16em]">
              Project ID
            </label>
            <input
              type="text"
              value={form.projectId}
              onChange={handleChange("projectId")}
              className="block w-full rounded-2xl border border-slate-200 bg-slate-50 px-4 py-2.5 text-sm text-slate-900 placeholder:text-slate-400 focus:outline-none focus:ring-2 focus:ring-slate-900 focus:bg-white"
              placeholder="PRJ-7122"
            />
          </div>

          {/* Project name -> project_name */}
          <div className="space-y-1.5">
            <label className="block text-xs font-semibold text-slate-500 uppercase tracking-[0.16em]">
              Project name
            </label>
            <input
              type="text"
              value={form.projectName}
              onChange={handleChange("projectName")}
              className="block w-full rounded-2xl border border-slate-200 bg-slate-50 px-4 py-2.5 text-sm text-slate-900 placeholder:text-slate-400 focus:outline-none focus:ring-2 focus:ring-slate-900 focus:bg-white"
              placeholder="Eg. New Installation Project"
            />
          </div>

          {/* Customer location -> address_id (for now) */}
          <div className="space-y-1.5">
            <label className="block text-xs font-semibold text-slate-500 uppercase tracking-[0.16em]">
              Customer location (address id)
            </label>
            <input
              type="text"
              value={form.customerLocation}
              readOnly
              disabled
              className="block w-full rounded-2xl border border-slate-200 bg-slate-50 px-4 py-2.5 text-sm text-slate-900 placeholder:text-slate-400 focus:outline-none focus:ring-2 focus:ring-slate-900 focus:bg-white"
              placeholder="674000f6d842db9caa5e1699"
            />
          </div>

          {/* Customer organization -> customer_organization */}
          <div className="space-y-1.5">
            <label className="block text-xs font-semibold text-slate-500 uppercase tracking-[0.16em]">
              Customer organization
            </label>
            <input
              type="text"
              value={form.customerOrganisation}
              readOnly
              disabled
              className="block w-full rounded-2xl border border-slate-200 bg-slate-50 px-4 py-2.5 text-sm text-slate-900 focus:outline-none focus:ring-2 focus:ring-slate-900 focus:bg-white"
              placeholder="Prime Air Tech"
            />
          </div>

          {/* Select customer -> customer_id */}
          <div className="space-y-1.5">
            <label className="block text-xs font-semibold text-slate-500 uppercase tracking-[0.16em]">
              Customer
            </label>

            <select
              value={form.customerId}
              onChange={(e) => handleCustomerSelect(e.target.value)}
              className="block w-full rounded-2xl cursor-pointer border border-slate-200 bg-slate-50 px-4 py-2.5 text-sm text-slate-900 focus:outline-none focus:ring-2 focus:ring-slate-900"
            >
              <option value="" hidden>
                Select customer
              </option>

              {customers.map((c) => (
                <option key={c.id} value={c.id}>
                  {c.name} ({c.customerid})
                </option>
              ))}
            </select>
          </div>

          {/* Deployment notes – currently just local, not in payload */}
          <div className="space-y-1.5">
            <label className="block text-xs font-semibold text-slate-500 uppercase tracking-[0.16em]">
              Deployment notes (local only)
            </label>
            <input
              type="text"
              value={form.deploymentNotes}
              onChange={handleChange("deploymentNotes")}
              placeholder="Add internal note"
              className="block w-full rounded-2xl border border-slate-200 bg-slate-50 px-4 py-2.5 text-sm text-slate-900 placeholder:text-slate-400 focus:outline-none focus:ring-2 focus:ring-slate-900 focus:bg-white"
            />
          </div>
        </div>

        {/* Footer actions */}
        <div className="mt-4 flex justify-end">
          <button
            type="submit"
            disabled={saving}
            className="inline-flex  cursor-pointer items-center rounded-xl bg-slate-900 text-white px-5 py-2.5 text-sm font-semibold shadow-[0_16px_35px_rgba(15,23,42,0.35)] hover:bg-slate-800 disabled:opacity-60 disabled:cursor-not-allowed"
          >
            {saving ? "Saving…" : isEdit ? "Save changes" : "Create project"}
          </button>
        </div>
      </form>
    </section>
  );
}

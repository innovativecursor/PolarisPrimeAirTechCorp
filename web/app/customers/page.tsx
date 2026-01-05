/* eslint-disable @typescript-eslint/no-explicit-any */
"use client";

import { useEffect, useMemo, useState } from "react";
import AppShell from "../components/layout/AppShell";
import PolarisTable, {
  PolarisTableColumn,
} from "../components/table/PolarisTable";
import { FiEdit2, FiTrash2 } from "react-icons/fi";
import { useAuth } from "../components/auth/AuthContext";
import { fetchDataGet, fetchDataPost, fetchWithError } from "../lib/fetchData";
import endpoints from "../lib/endpoints";
import { useToast } from "../hooks/useToast";
import { useConfirmToast } from "../hooks/useConfirmToast";

/* ------------------------------------------------------------------ */
/*  TYPES                                                             */
/* ------------------------------------------------------------------ */

export type CustomerRow = {
  id: string; // backend id
  name: string; // customername
  org: string; // customerorg
  location: string; // address
  tin: string; // tinnumber
  _raw?: any;
};

type CustomerFormValues = {
  id?: string; // for update
  name: string;
  org: string;
  location: string;
  tin: string;
};

/* ------------------------------------------------------------------ */
/*  PAGE                                                              */
/* ------------------------------------------------------------------ */

export default function CustomersPage() {
  const [mode, setMode] = useState<"list" | "create">("list");
  const [customers, setCustomers] = useState<CustomerRow[]>([]);
  const [loading, setLoading] = useState(false);
  const [saving, setSaving] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [editing, setEditing] = useState<CustomerRow | null>(null);

  const { user } = useAuth();
  const toast = useToast();
  const confirmToast = useConfirmToast();
  const displayName = user?.name || user?.email || "Admin";

  // ------------ LOAD LIST ------------
  const loadCustomers = async () => {
    try {
      setLoading(true);
      setError(null);

      const apiData = await fetchDataGet<any>(endpoints.customer.getAll);
      console.log("📦 Customer API response:", apiData);

      // Ensure we have an array to work with
      let list: any[] = [];
      if (Array.isArray(apiData?.data)) {
        list = apiData.data;
      } else if (Array.isArray(apiData)) {
        list = apiData;
      } else if (apiData && typeof apiData === "object") {
        // If apiData is an object, try to find an array property
        const possibleArrays = Object.values(apiData).filter(Array.isArray);
        if (possibleArrays.length > 0) {
          list = possibleArrays[0] as any[];
        }
      }
      console.log("📋 Extracted list:", list);

      const rows: CustomerRow[] = list.map((c: any) => ({
        id: c.id || c._id || "",
        name: c.customername || c.customer_name || c.name || "",
        org:
          c.customerorg || c.customer_organization || c.customerorgname || "",
        location: c.address || c.customer_location || "",
        tin: c.tinnumber || c.tin_number || "",
        _raw: c,
      }));

      setCustomers(rows);
    } catch (e: any) {
      const errorMsg = e.message ?? "Failed to load customers";
      setError(errorMsg);
      toast.error(errorMsg);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    void loadCustomers();
  }, []);

  // ------------ HANDLERS ------------

  const handleCreateClick = () => {
    setEditing(null);
    setMode("create");
  };

  const handleEdit = (row: CustomerRow) => {
    setEditing(row);
    setMode("create");
  };

  const handleDelete = (row: CustomerRow) => {
    confirmToast.confirm({
      title: "Delete Customer",
      message: `Are you sure you want to delete "${row.name}" (${row.org})? This action cannot be undone.`,
      confirmText: "Delete",
      cancelText: "Cancel",
      onConfirm: async () => {
        try {
          setSaving(true);
          // delete endpoint expects body: { id }
          await fetchWithError(endpoints.customer.delete, {
            method: "DELETE",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify({ id: row.id }),
          });
          await loadCustomers();
          toast.success("Customer deleted successfully");
        } catch (e: any) {
          toast.error(e.message ?? "Failed to delete customer");
        } finally {
          setSaving(false);
        }
      },
    });
  };

  const handleCancelForm = () => {
    setMode("list");
    setEditing(null);
  };

  const handleSubmitForm = async (values: CustomerFormValues) => {
    try {
      setSaving(true);
      setError(null);

      const payload = {
        id: values.id ?? "",
        customername: values.name,
        customerorg: values.org,
        address: values.location,
        tinnumber: values.tin,
      };

      const isEdit = Boolean(values.id);
      console.log(
        isEdit ? "🔄 Updating customer:" : "➕ Creating customer:",
        payload
      );

      // same endpoint for create/update
      await fetchDataPost(endpoints.customer.addOrUpdate, payload);

      await loadCustomers();
      setMode("list");
      setEditing(null);
      toast.success(
        isEdit
          ? "Customer updated successfully"
          : "Customer created successfully"
      );
    } catch (e: any) {
      const errorMsg = e.message ?? "Failed to save customer";
      setError(errorMsg);
      toast.error(errorMsg);
    } finally {
      setSaving(false);
    }
  };

  return (
    <AppShell>
      <div className="space-y-6">
        {/* Top header (same pattern as dashboard/projects) */}
        <header className="flex flex-col gap-3 md:flex-row md:items-center md:justify-between">
          <div>
            <p className="text-xs font-semibold tracking-[0.2em] uppercase text-slate-400">
              Operations overview
            </p>
            <h1 className="mt-1 text-2xl md:text-3xl font-semibold text-slate-900">
              Polaris Prime Air Tech Corp
            </h1>
          </div>
          <div className="text-xs text-slate-500 text-right">
            <p className="uppercase tracking-[0.16em] text-slate-400 mb-1">
              Welcome back
            </p>
            <p className="font-medium text-slate-700">{displayName}</p>
          </div>
        </header>

        {error && (
          <p className="text-xs font-medium text-rose-500 bg-rose-50 border border-rose-100 rounded-xl px-3 py-2 inline-flex">
            {error}
          </p>
        )}

        {mode === "list" ? (
          <CustomersListCard
            customers={customers}
            loading={loading || saving}
            onCreate={handleCreateClick}
            onEdit={handleEdit}
            onDelete={handleDelete}
          />
        ) : (
          <CustomerFormCard
            saving={saving}
            initialValues={editing ?? undefined}
            onCancel={handleCancelForm}
            onSubmit={handleSubmitForm}
          />
        )}
      </div>
    </AppShell>
  );
}

/* ------------------------------------------------------------------ */
/*  LIST CARD                                                          */
/* ------------------------------------------------------------------ */

type CustomersListProps = {
  customers: CustomerRow[];
  loading: boolean;
  onCreate: () => void;
  onEdit: (row: CustomerRow) => void;
  onDelete: (row: CustomerRow) => void;
};

function CustomersListCard({
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
                className="inline-flex items-center gap-1.5 rounded-full border border-slate-300 bg-[#eef1f8] px-3 py-1.5 text-xs text-slate-600 hover:bg-[#e4e8f3]"
              >
                <span className="inline-flex h-5 w-5 items-center justify-center rounded-full text-slate-500">
                  <FiEdit2 className="h-3.5 w-3.5" />
                </span>
              </button>

              {/* Delete */}
              <button
                type="button"
                onClick={() => onDelete(c)}
                className="inline-flex items-center gap-1.5 rounded-full border border-[#f9a8b8] bg-[#ffe6eb] px-3 py-1.5 text-xs text-[#e11d48] hover:bg-[#ffd7e0]"
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

/* ------------------------------------------------------------------ */
/*  CREATE / EDIT FORM CARD                                           */
/* ------------------------------------------------------------------ */

type CustomerFormCardProps = {
  initialValues?: CustomerRow;
  saving: boolean;
  onCancel: () => void;
  onSubmit: (values: CustomerFormValues) => Promise<void> | void;
};

function CustomerFormCard({
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
    <section className="rounded-[32px] bg-white border border-slate-100 shadow-[0_24px_60px_rgba(15,23,42,0.08)] px-8 py-8">
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
          className="text-xs font-medium text-slate-400 hover:text-slate-600"
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
              Customer name
            </label>
            <input
              type="text"
              value={form.name}
              onChange={handleChange("name")}
              placeholder="Eg. MetroCool Services"
              className="block w-full rounded-2xl border border-slate-200 bg-[#f7f8fb] px-4 py-3 text-sm text-slate-900 placeholder:text-slate-400 focus:outline-none focus:ring-2 focus:ring-slate-900 focus:bg-white"
            />
          </div>

          {/* TIN number */}
          <div className="space-y-2">
            <label className="block text-xs font-semibold tracking-[0.16em] uppercase text-slate-500">
              TIN number
            </label>
            <input
              type="text"
              value={form.tin}
              onChange={handleChange("tin")}
              placeholder="1as"
              className="block w-full rounded-2xl border border-slate-200 bg-[#f7f8fb] px-4 py-3 text-sm text-slate-900 placeholder:text-slate-400 focus:outline-none focus:ring-2 focus:ring-slate-900 focus:bg-white"
            />
          </div>

          {/* Customer organization */}
          <div className="space-y-2">
            <label className="block text-xs font-semibold tracking-[0.16em] uppercase text-slate-500">
              Customer organization
            </label>
            <input
              type="text"
              value={form.org}
              onChange={handleChange("org")}
              placeholder="Business unit"
              className="block w-full rounded-2xl border border-slate-200 bg-[#f7f8fb] px-4 py-3 text-sm text-slate-900 placeholder:text-slate-400 focus:outline-none focus:ring-2 focus:ring-slate-900 focus:bg-white"
            />
          </div>

          {/* Customer location */}
          <div className="space-y-2 md:col-span-2">
            <label className="block text-xs font-semibold tracking-[0.16em] uppercase text-slate-500">
              Customer location
            </label>
            <input
              type="text"
              value={form.location}
              onChange={handleChange("location")}
              placeholder="Choose a location or type an address"
              className="block w-full rounded-2xl border border-slate-200 bg-[#f7f8fb] px-4 py-3 text-sm text-slate-900 placeholder:text-slate-400 focus:outline-none focus:ring-2 focus:ring-slate-900 focus:bg-white"
            />
          </div>
        </div>

        {/* Footer actions */}
        <div className="mt-6 flex justify-end">
          <button
            type="submit"
            disabled={saving}
            className="inline-flex items-center rounded-[999px] bg-[#1f285c] px-6 py-2.5 text-sm font-semibold text-white shadow-[0_18px_40px_rgba(15,23,42,0.35)] hover:bg-[#171e48] disabled:opacity-60 disabled:cursor-not-allowed"
          >
            {saving ? "Saving…" : "Save customer"}
          </button>
        </div>
      </form>
    </section>
  );
}

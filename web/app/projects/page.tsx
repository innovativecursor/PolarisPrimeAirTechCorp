/* eslint-disable @typescript-eslint/no-explicit-any */
"use client";

import { useEffect, useMemo, useState } from "react";
import AppShell from "../components/layout/AppShell";
import PolarisTable, {
  PolarisTableColumn,
} from "../components/table/PolarisTable";
import { FiEdit2, FiTrash2 } from "react-icons/fi";
import {
  fetchDataDelete,
  fetchDataGet,
  fetchDataPost,
  fetchWithError,
} from "../lib/fetchData";
import endpoints from "../lib/endpoints";
import { useAuth } from "../components/auth/AuthContext";
import { useToast } from "../hooks/useToast";
import { useConfirmToast } from "../hooks/useConfirmToast";

/* ------------------------------------------------------------------ */
/*  TYPES                                                              */
/* ------------------------------------------------------------------ */

export type ProjectRow = {
  id: string; // display id (e.g. Mongo _id or PRJ-1042)
  name: string;
  customer: string;
  status: string;
  region: string;
  _raw?: any;
};

type ProjectFormValues = {
  projectId: string;
  projectName: string;
  customerLocation: string; // we’ll send this as address_id
  customerOrganisation: string;
  customerId: string;
  deploymentNotes: string;
};

/* ------------------------------------------------------------------ */
/*  PAGE                                                               */
/* ------------------------------------------------------------------ */

export default function ProjectsPage() {
  const [mode, setMode] = useState<"list" | "create">("list");
  const [projects, setProjects] = useState<ProjectRow[]>([]);
  const [loading, setLoading] = useState<boolean>(false);
  const [saving, setSaving] = useState<boolean>(false);
  const [editing, setEditing] = useState<ProjectRow | null>(null);

  const { user } = useAuth();
  const toast = useToast();
  const confirmToast = useConfirmToast();
  const displayName = user?.name || user?.email || "Admin";
  // ----------------- LOAD LIST -----------------
  const loadProjects = async () => {
    try {
      setLoading(true);

      const response = await fetchDataGet<{ projects: any[] }>(
        endpoints.project.getAll
      );
      const apiData = response?.projects || [];

      const rows: ProjectRow[] = apiData.map((p: any) => ({
        id: p._id || p.projectId || p.id || "",
        name: p.project_name || p.projectName || p.name || "",
        customer:
          p.customer_organization ||
          p.customerOrganisation ||
          p.customerName ||
          p.customer ||
          "",
        status: p.status || p.projectStatus || "",
        region: p.region || p.projectRegion || "",
        _raw: p,
      }));

      setProjects(rows);
    } catch (e: any) {
      toast.error(e.message ?? "Failed to load projects");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    loadProjects();
  }, []);

  // ----------------- HANDLERS -----------------
  const handleCreateClick = () => {
    setEditing(null);
    setMode("create");
  };

  const handleEdit = (row: ProjectRow) => {
    setEditing(row);
    setMode("create");
  };

  const handleDelete = (row: ProjectRow) => {
    confirmToast.confirm({
      title: "Delete Project",
      message: `Are you sure you want to delete "${row.name}" (${row.id})? This action cannot be undone.`,
      confirmText: "Delete",
      cancelText: "Cancel",
      onConfirm: async () => {
        try {
          setSaving(true);
          await fetchDataDelete(
            endpoints.project.delete(row._raw?._id ?? row.id)
          );
          await loadProjects();
          toast.success("Project deleted successfully");
        } catch (e: any) {
          toast.error(e.message ?? "Failed to delete project");
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

  const handleSubmitForm = async (values: ProjectFormValues) => {
    try {
      setSaving(true);

      // 🔑 Match backend keys exactly
      const payload = {
        project_name: values.projectName,
        customer_id: values.customerId,
        address_id: values.customerLocation,
        customer_organization: values.customerOrganisation,
      };

      if (editing && editing._raw?._id) {
        // UPDATE (PUT)
        const updateUrl = endpoints.project.update(editing._raw._id);
        console.log("🔄 Updating project:", {
          id: editing._raw._id,
          url: updateUrl,
          payload,
        });
        await fetchWithError(updateUrl, {
          method: "PUT",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify(payload),
        });
        toast.success("Project updated successfully");
      } else {
        // CREATE (POST)
        console.log("➕ Creating project:", { payload });
        await fetchDataPost(endpoints.project.create, payload);
        toast.success("Project created successfully");
      }

      await loadProjects();
      setMode("list");
      setEditing(null);
    } catch (e: any) {
      console.error("❌ Failed to save project:", e);
      toast.error(e.message ?? "Failed to save project");
    } finally {
      setSaving(false);
    }
  };

  return (
    <AppShell>
      <div className="space-y-6">
        {/* Top header */}
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

        {mode === "list" ? (
          <ProjectsListCard
            loading={loading || saving}
            projects={projects}
            onCreate={handleCreateClick}
            onEdit={handleEdit}
            onDelete={handleDelete}
          />
        ) : (
          <CreateProjectCard
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
/*  PROJECTS TABLE CARD                                                */
/* ------------------------------------------------------------------ */

type ProjectsListProps = {
  projects: ProjectRow[];
  loading: boolean;
  onCreate: () => void;
  onEdit: (row: ProjectRow) => void;
  onDelete: (row: ProjectRow) => void;
};

function ProjectsListCard({
  projects,
  loading,
  onCreate,
  onEdit,
  onDelete,
}: ProjectsListProps) {
  const columns: PolarisTableColumn[] = useMemo(
    () => [
      { key: "id", header: "Project ID" },
      { key: "name", header: "Project name" },
      { key: "customer", header: "Customer" },
      { key: "status", header: "Status" },
      { key: "region", header: "Region" },
      { key: "actions", header: "Actions", align: "right" },
    ],
    []
  );

  const columnWidths = "1.2fr 2.4fr 2.2fr 1.6fr 1.1fr 1.2fr";

  return (
    <section className="w-full mx-auto rounded-[32px] bg-white border border-slate-100 shadow-[0_24px_60px_rgba(15,23,42,0.08)] px-8 py-8">
      {/* Card header */}
      <div className="flex items-start justify-between mb-6">
        <div>
          <p className="text-xs font-semibold tracking-[0.24em] uppercase text-slate-400 mb-2">
            Projects
          </p>
          <h2 className="text-lg md:text-xl font-semibold text-slate-900">
            Project Portfolio
          </h2>
        </div>

        <button
          type="button"
          onClick={onCreate}
          className="inline-flex items-center rounded-[999px] bg-[#1f285c] text-white px-6 py-2.5 text-xs md:text-sm font-semibold shadow-[0_18px_40px_rgba(15,23,42,0.35)] hover:bg-[#171e48]"
        >
          Create project
        </button>
      </div>

      <PolarisTable
        columns={columns}
        data={projects}
        columnWidths={columnWidths}
        getCell={(row, key) => {
          const p = row as ProjectRow;

          if (key === "id") {
            return (
              <span className="font-mono text-xs text-slate-700">{p.id}</span>
            );
          }
          if (key === "name") {
            return <span className="text-slate-900">{p.name}</span>;
          }
          if (key === "customer") {
            return <span className="text-slate-600">{p.customer}</span>;
          }
          if (key === "status") {
            return <span className="text-slate-800">{p.status}</span>;
          }
          if (key === "region") {
            return <span className="text-slate-600">{p.region}</span>;
          }

          return (
            <div className="flex justify-end gap-3">
              {/* Edit */}
              <button
                type="button"
                onClick={() => onEdit(p)}
                className="inline-flex items-center gap-1.5 rounded-full border border-slate-300 bg-[#eef1f8] px-3 py-1.5 text-xs text-slate-600 hover:bg-[#e4e8f3]"
              >
                <span className="inline-flex h-5 w-5 items-center justify-center rounded-full bg-white text-slate-500">
                  <FiEdit2 className="h-3.5 w-3.5" />
                </span>
              </button>

              {/* Delete */}
              <button
                type="button"
                onClick={() => onDelete(p)}
                className="inline-flex items-center gap-1.5 rounded-full border border-[#f9a8b8] bg-[#ffe6eb] px-3 py-1.5 text-xs text-[#e11d48] hover:bg-[#ffd7e0]"
              >
                <span className="inline-flex h-5 w-5 items-center justify-center rounded-full bg-[#ffeef2] text-[#e11d48]">
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
/*  CREATE / EDIT PROJECT CARD                                        */
/* ------------------------------------------------------------------ */

type CreateProjectCardProps = {
  initialValues?: ProjectRow;
  saving: boolean;
  onCancel: () => void;
  onSubmit: (values: ProjectFormValues) => Promise<void> | void;
};

function CreateProjectCard({
  initialValues,
  saving,
  onCancel,
  onSubmit,
}: CreateProjectCardProps) {
  const [form, setForm] = useState<ProjectFormValues>(() => ({
    projectId: initialValues?.id || "PRJ-7122",
    projectName: initialValues?.name || "",
    customerLocation: initialValues?._raw?.address_id || "",
    customerOrganisation: initialValues?._raw?.customer_organization || "",
    customerId: initialValues?._raw?.customer_id || "",
    deploymentNotes: "",
  }));

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
          className="text-xs font-medium text-slate-400 hover:text-slate-600"
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
              onChange={handleChange("customerLocation")}
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
              onChange={handleChange("customerOrganisation")}
              className="block w-full rounded-2xl border border-slate-200 bg-slate-50 px-4 py-2.5 text-sm text-slate-900 focus:outline-none focus:ring-2 focus:ring-slate-900 focus:bg-white"
              placeholder="Prime Air Tech"
            />
          </div>

          {/* Select customer -> customer_id */}
          <div className="space-y-1.5">
            <label className="block text-xs font-semibold text-slate-500 uppercase tracking-[0.16em]">
              Customer (id)
            </label>
            <div className="flex gap-2">
              <input
                type="text"
                value={form.customerId}
                onChange={handleChange("customerId")}
                className="block w-full rounded-2xl border border-slate-200 bg-slate-50 px-4 py-2.5 text-sm text-slate-900 placeholder:text-slate-400 focus:outline-none focus:ring-2 focus:ring-slate-900 focus:bg-white"
                placeholder="674000a2d842db9caa5e1678"
              />
              <button
                type="button"
                className="inline-flex h-10 w-10 items-center justify-center rounded-2xl border border-slate-200 bg-white text-slate-600 hover:bg-slate-50"
              >
                +
              </button>
            </div>
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
            className="inline-flex items-center rounded-xl bg-slate-900 text-white px-5 py-2.5 text-sm font-semibold shadow-[0_16px_35px_rgba(15,23,42,0.35)] hover:bg-slate-800 disabled:opacity-60 disabled:cursor-not-allowed"
          >
            {saving ? "Saving…" : isEdit ? "Save changes" : "Create project"}
          </button>
        </div>
      </form>
    </section>
  );
}

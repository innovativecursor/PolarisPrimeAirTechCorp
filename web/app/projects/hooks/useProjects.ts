"use client";

import { useEffect, useState } from "react";
import {
  fetchDataDelete,
  fetchDataGet,
  fetchDataPost,
  fetchWithError,
} from "@/app/lib/fetchData";
import endpoints from "@/app/lib/endpoints";
import { useToast } from "@/app/hooks/useToast";

export type ProjectRow = {
  id: string;
  projectid: string;
  name: string;
  customer: string;
  salesdrid: string;
  salesorderid: string;
  _raw?: any;
};

export type ProjectFormValues = {
  projectId: string;
  projectName: string;
  customerLocation: string;
  customerOrganisation: string;
  customerId: string;
  deploymentNotes: string;
};

export function useProjects() {
  const [mode, setMode] = useState<"list" | "create">("list");
  const [projects, setProjects] = useState<ProjectRow[]>([]);
  const [loading, setLoading] = useState(false);
  const [saving, setSaving] = useState(false);
  const [editing, setEditing] = useState<ProjectRow | null>(null);

  const toast = useToast();

  // ---------- LOAD ----------
  const loadProjects = async () => {
    try {
      setLoading(true);

      const res = await fetchDataGet<{ projects: any[] }>(
        endpoints.project.getAll
      );

      const list = res?.projects || [];

      const rows: ProjectRow[] = list.map((p: any) => ({
        id: p._id || p.id || "",
        projectid: p.project_id || "",
        name: p.project_name || "",
        customer: p.customer_organization || "",
        salesorderid: p.sales_order_id || "",
        salesdrid: p.sales_dr_id || "",
        _raw: p,
      }));

      setProjects(rows);
    } catch (e: any) {
      toast.error(e.message ?? "Failed to load projects");
    } finally {
      setLoading(false);
    }
  };

  // ---------- CREATE / UPDATE ----------
  const saveProject = async (values: ProjectFormValues) => {
    try {
      setSaving(true);

      const payload = {
        project_name: values.projectName,
        customer_id: values.customerId,
        customer_address: values.customerLocation,
        customer_organization: values.customerOrganisation,
        notes: values.deploymentNotes || "",
      };

      if (editing?._raw?.id || editing?._raw?._id) {
        const id = editing._raw.id || editing._raw._id;
        await fetchWithError(endpoints.project.update(id), {
          method: "PUT",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify(payload),
        });
        toast.success("Project updated");
      } else {
        await fetchDataPost(endpoints.project.create, payload);
        toast.success("Project created");
      }

      setMode("list");
      setEditing(null);
      await loadProjects();
    } catch (e: any) {
      toast.error(e.message ?? "Failed to save project");
    } finally {
      setSaving(false);
    }
  };

  // ---------- DELETE ----------
  const deleteProject = async (row: ProjectRow) => {
    try {
      setSaving(true);
      await fetchDataDelete(
        endpoints.project.delete(row._raw?.id || row._raw?._id || row.id)
      );
      toast.success("Project deleted");
      await loadProjects();
    } catch (e: any) {
      toast.error(e.message ?? "Failed to delete project");
    } finally {
      setSaving(false);
    }
  };

  useEffect(() => {
    loadProjects();
  }, []);

  return {
    // state
    mode,
    projects,
    loading,
    saving,
    editing,

    // setters
    setMode,
    setEditing,

    // actions
    saveProject,
    deleteProject,
  };
}

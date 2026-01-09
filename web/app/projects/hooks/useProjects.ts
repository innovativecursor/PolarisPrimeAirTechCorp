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
  organization: string;
  notes: string;
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
  const [refreshing, setRefreshing] = useState(false);
  const [page, setPage] = useState(1);
  const [total, setTotal] = useState(0);
  const limit = 10;

  const toast = useToast();

  // ---------- LOAD ----------

  const loadProjects = async (showSkeleton = true) => {
    try {
      if (showSkeleton) {
        setLoading(true);
      } else {
        setRefreshing(true);
      }

      const res = await fetchDataGet<{
        data: any[];
        page: number;
        limit: number;
        total: number;
      }>(endpoints.project.getAll(page));

      const list = res?.data || [];
      setTotal(res?.total || 0);

      const rows: ProjectRow[] = list.map((p: any) => {
        return {
          id: p.id || "",
          projectid: p.project_id || "",
          name: p.project_name || "",
          customer: p.customer?.name || "",
          organization: p.customer?.organization || "",
          notes: p.notes || "",
          _raw: {
            id: p.id || p._id,
            project_id: p.project_id,
            project_name: p.project_name,
            notes: p.notes || "",
            customer: {
              id: p.customer?.id || p.customer?._id || "",
              address: p.customer?.address || "",
              organization: p.customer?.organization || "",
            },
          },
        };
      });

      setProjects(rows);
    } catch (e: any) {
      toast.error(e.message ?? "Failed to load projects");
    } finally {
      setLoading(false);
      setRefreshing(false);
    }
  };

  // ---------- CREATE / UPDATE ----------
  const saveProject = async (values: ProjectFormValues) => {
    try {
      setSaving(true);

      const isEdit = Boolean(editing?._raw?.id || editing?._raw?._id);

      if (isEdit) {
        const payload = {
          project_name: values.projectName,
          customer_id: values.customerId,
          notes: values.deploymentNotes || "",
        };

        const id = editing!._raw.id || editing!._raw._id;

        await fetchWithError(endpoints.project.update(id), {
          method: "PUT",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify(payload),
        });

        toast.success("Project updated");
      } else {
        const payload = {
          project_name: values.projectName,
          customer_id: values.customerId,
          customer_organization: values.customerOrganisation,
          customer_address: values.customerLocation,
          notes: values.deploymentNotes || "",
        };

        await fetchDataPost(endpoints.project.create, payload);

        toast.success("Project created");
      }

      setMode("list");
      setEditing(null);
      await loadProjects(false);
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
      await loadProjects(false);
    } catch (e: any) {
      toast.error(e.message ?? "Failed to delete project");
    } finally {
      setSaving(false);
    }
  };

  return {
    mode,
    projects,
    loading,
    saving,
    editing,
    setMode,
    setEditing,
    saveProject,
    deleteProject,
    loadProjects,
    page,
    setPage,
    total,
    limit,
  };
}

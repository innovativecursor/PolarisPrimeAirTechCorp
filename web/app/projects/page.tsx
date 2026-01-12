"use client";
import { useProjects } from "./hooks/useProjects";
import { useCustomers } from "../customers/hooks/useCustomers";
import { useConfirmToast } from "../hooks/useConfirmToast";
import AppShell from "../components/layout/AppShell";
import ProjectsListCard from "./components/ProjectsListCard";
import CreateProjectCard from "./components/CreateProjectCard";
import { useEffect } from "react";
import { useAuth } from "../components/auth/AuthContext";

export default function ProjectsPage() {
  const projectsHook = useProjects();
  const customersHook = useCustomers();
  const confirmToast = useConfirmToast();
  const { user } = useAuth();
  const displayName = user?.name || user?.email || "Admin";
  const handleDelete = (row: any) => {
    confirmToast.confirm({
      title: "Delete Project",
      message: `Are you sure you want to delete "${row.name}"?`,
      confirmText: "Delete",
      cancelText: "Cancel",
      onConfirm: () => projectsHook.deleteProject(row),
    });
  };

  useEffect(() => {
    projectsHook.loadProjects(true);
  }, [projectsHook.page]);

  return (
    <AppShell>
      <div className="space-y-6">
        <header className="flex flex-col gap-3 md:flex-row md:items-center md:justify-between">
          <div>
            <p className="text-xs font-semibold tracking-[0.2em] uppercase text-slate-400">
              Supplier Purchase Orders
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

        {projectsHook.mode === "list" ? (
          <ProjectsListCard
            loading={projectsHook.loading}
            projects={projectsHook.projects}
            page={projectsHook.page}
            total={projectsHook.total}
            limit={projectsHook.limit}
            onNext={() => projectsHook.setPage(projectsHook.page + 1)}
            onPrev={() =>
              projectsHook.setPage(Math.max(1, projectsHook.page - 1))
            }
            onCreate={() => {
              projectsHook.setEditing(null);
              projectsHook.setMode("create");
            }}
            onEdit={(row) => {
              projectsHook.setEditing(row);
              projectsHook.setMode("create");
            }}
            onDelete={handleDelete}
          />
        ) : (
          <CreateProjectCard
            saving={projectsHook.saving}
            customers={customersHook.customers}
            initialValues={projectsHook.editing ?? undefined}
            onCancel={() => {
              projectsHook.setMode("list");
              projectsHook.setEditing(null);
            }}
            onSubmit={projectsHook.saveProject}
          />
        )}
      </div>
    </AppShell>
  );
}

"use client";
import { useProjects } from "./hooks/useProjects";
import { useCustomers } from "../customers/hooks/useCustomers";
import { useConfirmToast } from "../hooks/useConfirmToast";
import AppShell from "../components/layout/AppShell";
import ProjectsListCard from "./components/ProjectsListCard";
import CreateProjectCard from "./components/CreateProjectCard";

export default function ProjectsPage() {
  const projectsHook = useProjects();
  const customersHook = useCustomers();
  const confirmToast = useConfirmToast();

  const handleDelete = (row: any) => {
    confirmToast.confirm({
      title: "Delete Project",
      message: `Are you sure you want to delete "${row.name}"?`,
      confirmText: "Delete",
      cancelText: "Cancel",
      onConfirm: () => projectsHook.deleteProject(row),
    });
  };

  return (
    <AppShell>
      {projectsHook.mode === "list" ? (
        <ProjectsListCard
          loading={projectsHook.loading || projectsHook.saving}
          projects={projectsHook.projects}
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
    </AppShell>
  );
}

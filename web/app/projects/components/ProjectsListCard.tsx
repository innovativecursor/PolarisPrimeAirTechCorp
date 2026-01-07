import PolarisTable, {
  PolarisTableColumn,
} from "@/app/components/table/PolarisTable";
import { ProjectRow } from "../hooks/useProjects";
import { useMemo } from "react";
import { FiEdit2, FiTrash2 } from "react-icons/fi";

type ProjectsListProps = {
  projects: ProjectRow[];
  loading: boolean;
  page: number;
  total: number;
  limit: number;
  onNext: () => void;
  onPrev: () => void;
  onCreate: () => void;
  onEdit: (row: ProjectRow) => void;
  onDelete: (row: ProjectRow) => void;
};

export default function ProjectsListCard({
  projects,
  page,
  total,
  limit,
  onNext,
  onPrev,
  onCreate,
  onEdit,
  onDelete,
}: ProjectsListProps) {
  const columns: PolarisTableColumn[] = useMemo(
    () => [
      { key: "projectid", header: "Project ID" },
      { key: "name", header: "Project name" },
      { key: "customer", header: "Customer" },
      { key: "customerorganization", header: "Customer Organization" },
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
          className="inline-flex  cursor-pointer items-center rounded-[999px] bg-[#1f285c] text-white px-6 py-2.5 text-xs md:text-sm font-semibold shadow-[0_18px_40px_rgba(15,23,42,0.35)] hover:bg-[#171e48]"
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

          if (key === "projectid") {
            return (
              <span className="font-mono text-xs text-slate-700">
                {p.projectid}
              </span>
            );
          }
          if (key === "name") {
            return <span className="text-slate-900">{p.name}</span>;
          }
          if (key === "customer") {
            return <span className="text-slate-600">{p.customer}</span>;
          }
            if (key === "customerorganization") {
            return <span className="text-slate-600">{p.organization}</span>;
          }
      

          return (
            <div className="flex justify-end gap-3">
              {/* Edit */}
              <button
                type="button"
                onClick={() => onEdit(p)}
                className="inline-flex  cursor-pointer items-center gap-1.5 rounded-full border border-slate-300 bg-[#eef1f8] px-3 py-1.5 text-xs text-slate-600 hover:bg-[#e4e8f3]"
              >
                <span className="inline-flex h-5 w-5 items-center justify-center rounded-full text-slate-500">
                  <FiEdit2 className="h-3.5 w-3.5" />
                </span>
              </button>

              {/* Delete */}
              <button
                type="button"
                onClick={() => onDelete(p)}
                className="inline-flex  cursor-pointer items-center gap-1.5 rounded-full border border-[#f9a8b8] bg-[#ffe6eb] px-3 py-1.5 text-xs text-[#e11d48] hover:bg-[#ffd7e0]"
              >
                <span className="inline-flex h-5 w-5 items-center justify-center rounded-full text-[#e11d48]">
                  <FiTrash2 className="h-3.5 w-3.5" />
                </span>
              </button>
            </div>
          );
        }}
      />

      <div className="mt-6 flex items-center justify-between">
        <span className="text-xs text-slate-500">
          Page {page} of {Math.ceil(total / limit)}
        </span>

        <div className="flex gap-2">
          <button
            disabled={page === 1}
            onClick={onPrev}
            className="rounded-md border px-4 py-1.5 text-xs disabled:opacity-50"
          >
            Prev
          </button>

          <button
            disabled={page * limit >= total}
            onClick={onNext}
            className="rounded-md border px-4 py-1.5 text-xs disabled:opacity-50"
          >
            Next
          </button>
        </div>
      </div>
    </section>
  );
}

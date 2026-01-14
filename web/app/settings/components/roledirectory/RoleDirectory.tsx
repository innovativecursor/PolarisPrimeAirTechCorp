"use client";

import { useEffect, useState } from "react";
import { Modal, Input, message } from "antd";
import { Plus, Shield } from "lucide-react";
import { useSettings } from "../hooks/useSettings";

export default function RoleDirectory() {
  const { roles, fetchRoles, createRole, loading, error, menus, fetchMenus } =
    useSettings();

  const [open, setOpen] = useState(false);
  const [roleName, setRoleName] = useState("");

  useEffect(() => {
    void fetchRoles();
    void fetchMenus();
  }, [fetchRoles, menus]);

  if (error) {
    return (
      <div className="rounded-2xl border border-red-200 bg-red-50 px-5 py-4 text-sm text-red-600">
        {error}
      </div>
    );
  }

  console.log(menus, "llll");
  

  return (
    <div className="space-y-8">
      <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
        <div className="flex items-center md:items-start flex-col md:w-fit w-full">
          <h3 className="text-xl font-semibold text-slate-900">
            Roles & Access
          </h3>
          <p className="mt-1 text-sm text-slate-500">
            Manage system roles and permission levels
          </p>
        </div>

        <div className="flex items-center gap-3 md:w-fit w-full justify-center">
          <div className="rounded-xl border border-slate-200 bg-white px-4 py-2 text-sm">
            <span className="font-semibold text-slate-900">{roles.length}</span>{" "}
            roles
          </div>

          <button
            onClick={() => setOpen(true)}
            className="inline-flex cursor-pointer items-center gap-2 rounded-xl bg-slate-900 px-4 py-2 text-sm font-semibold text-white hover:bg-slate-800"
          >
            <Plus size={16} />
            Create role
          </button>
        </div>
      </div>

      <div className="overflow-hidden cursor-pointer rounded-2xl border border-slate-200 bg-white">
        {roles.map((role, index) => (
          <div
            key={role._id}
            className={`
        flex items-center justify-between md:px-6 px-4 py-4
        ${index !== 0 ? "border-t border-slate-200" : ""}
        hover:bg-slate-50 transition
      `}
          >
            <div className="flex items-center gap-4">
              <div className="flex md:h-10 md:w-10 h-8 w-8 items-center justify-center rounded-xl bg-slate-200 text-slate-800 text-sm font-semibold uppercase">
                {role.name.charAt(0)}
              </div>

              <div>
                <p className="md:text-sm text-xs font-semibold text-slate-900 capitalize">
                  {role.name}
                </p>
                <p className="md:text-xs text-[9px] text-slate-500">
                  System role used to control access permissions
                </p>
              </div>
            </div>

            <div className="flex items-center gap-4">
              <span className="rounded-full bg-green-100 px-3 py-1 text-xs font-medium text-green-700">
                Active
              </span>
            </div>
          </div>
        ))}

        {roles.length === 0 && (
          <div className="py-16 text-center text-sm text-slate-400">
            No roles created yet
          </div>
        )}
      </div>

      {/* Create Role Modal */}
      <Modal
        open={open}
        footer={null}
        centered
        onCancel={() => {
          setOpen(false);
          setRoleName("");
        }}
      >
        <div className="space-y-6">
          <div>
            <h3 className="text-lg font-semibold text-slate-900">
              Create role
            </h3>
            <p className="mt-1 text-sm text-slate-500">
              Add a new role to define access permissions
            </p>
          </div>

          <div className="space-y-2">
            <label className="text-sm font-medium text-slate-700">
              Role name
            </label>
            <Input
              size="large"
              placeholder="e.g. Warehouse Manager"
              value={roleName}
              onChange={(e) => setRoleName(e.target.value)}
            />
          </div>

          <div className="flex items-center justify-end gap-3 pt-2">
            <button
              onClick={() => {
                setOpen(false);
                setRoleName("");
              }}
              className="rounded-xl cursor-pointer border border-slate-200 px-4 py-2 text-sm font-medium text-slate-600 hover:bg-slate-100"
            >
              Cancel
            </button>

            <button
              onClick={async () => {
                if (!roleName.trim()) {
                  message.error("Role name is required");
                  return;
                }

                try {
                  await createRole(roleName.trim());
                  message.success("Role created successfully");
                  setOpen(false);
                  setRoleName("");
                } catch {}
              }}
              disabled={loading}
              className="rounded-xl cursor-pointer bg-slate-900 px-5 py-2 text-sm font-semibold text-white hover:bg-slate-800 disabled:opacity-60"
            >
              {loading ? "Creating..." : "Create role"}
            </button>
          </div>
        </div>
      </Modal>
    </div>
  );
}

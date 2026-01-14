"use client";

import { useEffect, useState } from "react";
import { Modal, Input, message } from "antd";
import { PencilLine, Plus } from "lucide-react";
import { useSettings } from "../hooks/useSettings";

export default function RoleDirectory() {
  const {
    roles,
    menus,
    selectedMenus,
    toggleMenu,

    editOpen,
    setEditOpen,
    setEditingRoleId,
    setSelectedMenus,

    fetchRoles,
    fetchMenus,
    fetchMenusByRole,
    createRole,
    updateRoleMenus,

    loading,
    error,
  } = useSettings();
  const [createOpen, setCreateOpen] = useState(false);
  const [roleName, setRoleName] = useState("");

  useEffect(() => {
    fetchRoles();
    fetchMenus();
  }, [fetchRoles, fetchMenus]);

  if (error) {
    return (
      <div className="rounded-xl border border-red-200 bg-red-50 px-4 py-3 text-sm text-red-600">
        {error}
      </div>
    );
  }

  return (
    <div className="space-y-8">
      {/* HEADER */}
      <div className="flex items-center justify-between">
        <div>
          <h3 className="text-xl font-semibold">Roles & Access</h3>
          <p className="text-sm text-slate-500">
            Manage system roles and permissions
          </p>
        </div>

        <div className="flex items-center gap-3">
          <div className="rounded-xl border border-slate-200 bg-white px-4 py-2 text-sm">
            <span className="font-semibold text-slate-900">{roles.length}</span>{" "}
            roles
          </div>

          <button
            onClick={() => setCreateOpen(true)}
            className="flex cursor-pointer items-center gap-2 rounded-xl bg-slate-900 px-4 py-2 text-sm font-semibold text-white hover:bg-slate-800"
          >
            <Plus size={16} />
            Create role
          </button>
        </div>
      </div>

      <div className="rounded-2xl border bg-white">
        {roles.map((role) => (
          <div
            key={role._id}
            className="flex items-center justify-between px-6 py-4 border-t first:border-none hover:bg-slate-50"
          >
            <div>
              <p className="font-semibold capitalize">{role.name}</p>
              <p className="text-xs text-slate-500">System role</p>
            </div>

            <PencilLine
              size={18}
              className="cursor-pointer text-slate-600 hover:text-slate-900"
              onClick={() => fetchMenusByRole(role._id)}
            />
          </div>
        ))}

        {roles.length === 0 && (
          <div className="py-12 text-center text-sm text-slate-400">
            No roles created yet
          </div>
        )}
      </div>

      {/* CREATE ROLE MODAL */}
      <Modal
        open={createOpen}
        footer={null}
        centered
        onCancel={() => {
          setCreateOpen(false);
          setRoleName("");
          setSelectedMenus([]);
        }}
      >
        <div className="space-y-6">
          <div>
            <h3 className="text-lg font-semibold">Create role</h3>
            <p className="text-sm text-slate-500">
              Add a new role and assign menu access
            </p>
          </div>

          <div className="space-y-2">
            <label className="text-sm font-medium">Role name</label>
            <Input
              placeholder="e.g. Warehouse Manager"
              value={roleName}
              onChange={(e) => setRoleName(e.target.value)}
            />
          </div>

          <div className="space-y-2">
            <p className="text-sm font-medium">Menu access</p>

            <div className="max-h-64 overflow-y-auto rounded-xl border p-3 space-y-2">
              {menus.map((menu) => (
                <label key={menu.id} className="flex gap-2 text-sm">
                  <input
                    type="checkbox"
                    checked={selectedMenus.includes(menu.id)}
                    onChange={() => toggleMenu(menu.id)}
                  />
                  {menu.label}
                </label>
              ))}
            </div>
          </div>

          <div className="flex justify-end gap-3 pt-2">
            <button
              onClick={() => {
                setCreateOpen(false);
                setRoleName("");
                setSelectedMenus([]);
              }}
              className="rounded-xl cursor-pointer border px-4 py-2 text-sm"
            >
              Cancel
            </button>

            <button
              disabled={loading}
              onClick={async () => {
                if (!roleName.trim()) {
                  message.error("Role name is required");
                  return;
                }
                if (selectedMenus.length === 0) {
                  message.error("Select at least one menu");
                  return;
                }

                try {
                  await createRole({
                    name: roleName.trim(),
                    menus: selectedMenus,
                  });

                  message.success("Role created successfully");
                  setCreateOpen(false);
                  setRoleName("");
                  setSelectedMenus([]);
                } catch {}
              }}
              className="rounded-xl cursor-pointer bg-slate-900 px-5 py-2 text-sm font-semibold text-white disabled:opacity-60"
            >
              {loading ? "Creating..." : "Create role"}
            </button>
          </div>
        </div>
      </Modal>

      {/* EDIT ROLE MODAL */}
      <Modal
        open={editOpen}
        footer={null}
        centered
        onCancel={() => {
          setEditOpen(false);
          setEditingRoleId(null);
          setSelectedMenus([]);
        }}
      >
        <div className="space-y-6">
          <div>
            <h3 className="text-lg font-semibold">Edit role menus</h3>
            <p className="text-sm text-slate-500">
              Update menu access for this role
            </p>
          </div>

          <div className="space-y-2">
            <p className="text-sm font-medium">Menu access</p>

            <div className="max-h-64 overflow-y-auto rounded-xl border p-3 space-y-2">
              {menus.map((menu) => (
                <label key={menu.id} className="flex gap-2 text-sm">
                  <input
                    type="checkbox"
                    checked={selectedMenus.includes(menu.id)}
                    onChange={() => toggleMenu(menu.id)}
                  />
                  {menu.label}
                </label>
              ))}
            </div>
          </div>

          <div className="flex justify-end gap-3 pt-2">
            <button
              onClick={() => {
                setEditOpen(false);
                setEditingRoleId(null);
                setSelectedMenus([]);
              }}
              className="rounded-xl cursor-pointer border px-4 py-2 text-sm"
            >
              Cancel
            </button>

            <button
              disabled={loading}
              onClick={async () => {
                try {
                  await updateRoleMenus();
                  message.success("Role updated successfully");
                  setEditOpen(false);
                  setEditingRoleId(null);
                  setSelectedMenus([]);
                } catch {}
              }}
              className="rounded-xl cursor-pointer bg-slate-900 px-5 py-2 text-sm font-semibold text-white disabled:opacity-60"
            >
              {loading ? "Saving..." : "Save changes"}
            </button>
          </div>
        </div>
      </Modal>
    </div>
  );
}

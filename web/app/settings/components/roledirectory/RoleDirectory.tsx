"use client";

import { useEffect } from "react";
import { Modal, message } from "antd";
import { PencilLine } from "lucide-react";
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
    updateRoleMenus,

    loading,
    error,
  } = useSettings();

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
    <div className="space-y-6">
      <h3 className="text-xl font-semibold">Roles & Access</h3>

      <div className="rounded-2xl border bg-white">
        {roles.map((role) => (
          <div
            key={role._id}
            className="flex items-center justify-between px-6 py-4 border-t first:border-none"
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
      </div>

      {/* EDIT MODAL */}
      <Modal
        open={editOpen}
        footer={null}
        onCancel={() => {
          setEditOpen(false);
          setEditingRoleId(null);
          setSelectedMenus([]);
        }}
      >
        <h3 className="text-lg font-semibold mb-4">Edit role menus</h3>

        <div className="space-y-2">
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
          className="mt-4 w-full rounded-xl bg-slate-900 py-2 text-white disabled:opacity-60"
        >
          {loading ? "Saving..." : "Save changes"}
        </button>
      </Modal>
    </div>
  );
}

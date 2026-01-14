import { useCallback, useState } from "react";
import {
  GetAllRolesResponse,
  GetAllUsersResponse,
  MenuItem,
  MenuRes,
  Role,
  User,
} from "../type";
import { fetchDataGet, fetchDataPost, fetchDataPut } from "@/app/lib/fetchData";
import endpoints from "@/app/lib/endpoints";

export function useSettings() {
  const [users, setUsers] = useState<User[]>([]);
  const [roles, setRoles] = useState<Role[]>([]);
  const [menus, setMenus] = useState<MenuItem[]>([]);
  const [selectedMenus, setSelectedMenus] = useState<string[]>([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  // edit state
  const [editOpen, setEditOpen] = useState(false);
  const [editingRoleId, setEditingRoleId] = useState<string | null>(null);

  const toggleMenu = (menuId: string) => {
    setSelectedMenus((prev) =>
      prev.includes(menuId)
        ? prev.filter((id) => id !== menuId)
        : [...prev, menuId]
    );
  };

  const fetchUsers = useCallback(async () => {
    try {
      setLoading(true);
      setError(null);
      const res = await fetchDataGet<GetAllUsersResponse>(
        endpoints.auth.getAllUsers
      );
      setUsers(res.users || []);
    } catch (err: any) {
      setError(err.message || "Failed to load users");
    } finally {
      setLoading(false);
    }
  }, []);

  const fetchMenus = useCallback(async () => {
    try {
      setLoading(true);
      setError(null);
      const res = await fetchDataGet<MenuRes>(endpoints.allmenus.getAll);
      setMenus(res.menus || []);
    } catch (err: any) {
      setError(err.message || "Failed to load menus");
    } finally {
      setLoading(false);
    }
  }, []);

  const fetchMenusByRole = useCallback(async (roleId: string) => {
    try {
      setLoading(true);
      setError(null);

      const res = await fetchDataPost<{
        role_id: string;
        name: string;
        menus: { id: string; label: string; href: string }[];
      }>(endpoints.allmenus.getById, {
        role_id: roleId,
      });

      // object → ids
      setSelectedMenus(res.menus.map((m) => m.id));
      setEditingRoleId(res.role_id);
      setEditOpen(true);
    } catch (err: any) {
      setError(err.message || "Failed to load role menus");
    } finally {
      setLoading(false);
    }
  }, []);

  const fetchRoles = useCallback(async () => {
    try {
      setLoading(true);
      setError(null);
      const res = await fetchDataGet<GetAllRolesResponse>(
        endpoints.auth.getAllRoles
      );
      setRoles(res.roles || []);
    } catch (err: any) {
      setError(err.message || "Failed to load roles");
    } finally {
      setLoading(false);
    }
  }, []);

  const createRole = useCallback(
    async (payload: { name: string; menus: string[] }) => {
      try {
        setLoading(true);
        setError(null);
        await fetchDataPost(endpoints.auth.createRole, payload);
        await fetchRoles();
      } catch (err: any) {
        setError(err.message || "Failed to create role");
        throw err;
      } finally {
        setLoading(false);
      }
    },
    [fetchRoles]
  );

  const updateRoleMenus = useCallback(async () => {
    if (!editingRoleId) return;

    try {
      setLoading(true);
      setError(null);

      await fetchDataPut(endpoints.allmenus.update, {
        role_id: editingRoleId,
        menus: selectedMenus,
      });

      await fetchRoles();
    } catch (err: any) {
      setError(err.message || "Failed to update role menus");
      throw err;
    } finally {
      setLoading(false);
    }
  }, [editingRoleId, selectedMenus, fetchRoles]);

  const updateUserRole = useCallback(
    async ({
      userId,
      roleId,
      action,
    }: {
      userId: string;
      roleId?: string;
      action: "approve" | "reject" | "deactivate";
    }) => {
      try {
        setLoading(true);
        setError(null);

        await fetchDataPost(endpoints.auth.updateUserRoles, {
          user_id: userId,
          role_id: roleId,
          action,
        });

        await fetchUsers();
      } catch (err: any) {
        setError(err.message || "Failed to update user");
        throw err;
      } finally {
        setLoading(false);
      }
    },
    [fetchUsers]
  );

  return {
    users,
    roles,
    menus,
    selectedMenus,
    setSelectedMenus,
    toggleMenu,
    updateUserRole,
    editOpen,
    setEditOpen,
    editingRoleId,
    setEditingRoleId,
    fetchMenusByRole,
    fetchUsers,
    fetchMenus,
    fetchRoles,
    createRole,
    updateRoleMenus,

    loading,
    error,
  };
}

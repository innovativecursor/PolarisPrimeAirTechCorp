import { useCallback, useState } from "react";
import { GetAllRolesResponse, GetAllUsersResponse, Role, User } from "../type";
import { fetchDataGet, fetchDataPost } from "@/app/lib/fetchData";
import endpoints from "@/app/lib/endpoints";

export function useSettings() {
  const [users, setUsers] = useState<User[]>([]);
  const [roles, setRoles] = useState<Role[]>([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

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
    async (name: string) => {
      try {
        setLoading(true);
        setError(null);

        await fetchDataPost(endpoints.auth.createRole, {
          name,
        });
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
    fetchUsers,
    fetchRoles,
    createRole,
    updateUserRole,
    loading,
    error,
  };
}

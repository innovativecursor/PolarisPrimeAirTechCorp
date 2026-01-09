import { useCallback, useState } from "react";
import { Supplier, SupplierForm, SupplierListResponse } from "../type";
import {
  fetchDataGet,
  fetchDataPost,
  fetchDataPut,
  fetchWithError,
} from "@/app/lib/fetchData";
import endpoints from "@/app/lib/endpoints";
import { toast } from "react-toastify";
import { validateSupplier } from "../validation";

export function useSupplier() {
  const [mode, setMode] = useState<"list" | "create">("list");
  const [editing, setEditing] = useState<string | null>(null);
  const [loading, setLoading] = useState(false);
  const [saving, setSaving] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [allSupplier, setAllSupplier] = useState<Supplier[]>([]);

  const GetSupplier = useCallback(async (showSkeleton = true) => {
    try {
      if (showSkeleton) {
        setLoading(true);
      }

      setError(null);

      const res = await fetchDataGet<SupplierListResponse>(
        endpoints.supplier.getAll
      );

      setAllSupplier(Array.isArray(res?.suppliers) ? res.suppliers : []);
    } catch (err: any) {
      setError(err.message || "Failed to fetch suppliers");
      setAllSupplier([]);
    } finally {
      setLoading(false);
    }
  }, []);

  const createSupplier = useCallback(
    async (form: SupplierForm) => {
      const errorMsg = validateSupplier(form);
      if (errorMsg) {
        toast.error(errorMsg);
        return;
      }

      try {
        setSaving(true);

        if (editing) {
          await fetchDataPut(endpoints.supplier.edit, {
            id: editing,
            ...form,
          });
          toast.success("Supplier updated successfully");
        } else {
          await fetchDataPost(endpoints.supplier.add, form);
          toast.success("Supplier added successfully");
        }

        setMode("list");
        setEditing(null);
        await GetSupplier(false);
      } catch (err) {
        const error = err as Error;
        toast.error(error.message || "Failed to save supplier");
      } finally {
        setSaving(false);
      }
    },
    [editing, GetSupplier]
  );

  const deleteSupplier = useCallback(
    async (id: string) => {
      try {
        setSaving(true);
        setError(null);

        await fetchWithError(endpoints.supplier.delete, {
          method: "DELETE",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify({
            id,
          }),
        });

        toast.success("Supplier deleted successfully");
        await GetSupplier(false);
      } catch (err) {
        const error = err as Error;
        toast.error(error.message || "Failed to delete supplier");
      } finally {
        setSaving(false);
      }
    },
    [GetSupplier]
  );

  return {
    mode,
    setMode,
    editing,
    setEditing,
    loading,
    setLoading,
    saving,
    setSaving,
    createSupplier,
    GetSupplier,
    allSupplier,
    deleteSupplier,
  };
}

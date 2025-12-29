import { useCallback, useState } from "react";
import { InventoryItem, InventoryListResponse } from "../type";
import { fetchDataGet } from "@/app/lib/fetchData";
import endpoints from "@/app/lib/endpoints";

export function useInventory() {
  const [mode, setMode] = useState<"list" | "create">("list");
  const [editing, setEditing] = useState<null | any>(null);
  const [loading, setLoading] = useState(false);
  const [saving, setSaving] = useState(false);
  const [allInventories, setAllInventories] = useState<InventoryItem[]>([]);
  const [error, setError] = useState<string | null>(null);

  const GetInventories = useCallback(async () => {
    try {
      setLoading(true);
      setError(null);

      const res = await fetchDataGet<InventoryListResponse>(
        endpoints.inventory.getAll
      );

      setAllInventories(res?.inventory);
    } catch (err: any) {
      setError(err.message || "Failed to fetch inventories");
      setAllInventories([]);
    } finally {
      setLoading(false);
    }
  }, []);

  return {
    mode,
    setMode,
    editing,
    setEditing,
    loading,
    setLoading,
    saving,
    setSaving,
    GetInventories,
    allInventories,
  };
}






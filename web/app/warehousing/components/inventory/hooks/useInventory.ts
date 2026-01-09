import { useCallback, useEffect, useState } from "react";
import { InventoryItem, InventoryListResponse } from "../type";
import {
  fetchDataDelete,
  fetchDataGet,
  fetchDataPost,
  fetchDataPut,
} from "@/app/lib/fetchData";
import endpoints from "@/app/lib/endpoints";
import { toast } from "react-toastify";
import { useConfirmToast } from "@/app/hooks/useConfirmToast";

export function useInventory() {
  const [mode, setMode] = useState<"list" | "create">("list");
  const [editing, setEditing] = useState<InventoryItem | null>(null);
  const [loading, setLoading] = useState(false);
  const [saving, setSaving] = useState(false);
  const [refreshing, setRefreshing] = useState(false);
  const [allInventories, setAllInventories] = useState<InventoryItem[]>([]);
  const [error, setError] = useState<string | null>(null);
  const confirmToast = useConfirmToast();
  const initialFormState = {
    sku: "",
    barcode: "",
    aircon_model_number: "",
    aircon_name: "",
    hp: "",
    type_of_aircon: "",
    indoor_outdoor_unit: "",
    quantity: 0,
    price: 0,
  };

  const [form, setForm] = useState(initialFormState);

  const updateForm = (key: string, value: any) => {
    setForm((p) => ({ ...p, [key]: value }));
  };
  const resetForm = () => {
    setForm(initialFormState);
  };

  const GetInventories = useCallback(async (showSkeleton = true) => {
    try {
      if (showSkeleton) {
        setLoading(true);
      } else {
        setRefreshing(true);
      }

      setError(null);

      const res = await fetchDataGet<InventoryListResponse>(
        endpoints.inventory.getAll
      );

      setAllInventories(Array.isArray(res?.inventory) ? res.inventory : []);
    } catch (err: any) {
      setError(err.message || "Failed to fetch inventories");
      setAllInventories([]);
    } finally {
      setLoading(false);
      setRefreshing(false);
    }
  }, []);

  const validateForm = () => {
    if (!form.barcode) return "Please scan the barcode";
    if (!form.sku.trim()) return "SKU is required";
    if (!form.aircon_model_number.trim()) return "Model number is required";
    if (!form.aircon_name.trim()) return "Aircon name is required";
    if (!form.hp.trim()) return "HP is required";
    if (!form.type_of_aircon) return "Type of aircon is required";
    if (!form.indoor_outdoor_unit) return "Indoor / Outdoor unit is required";
    if (form.quantity <= 0) return "Quantity must be greater than 0";
    if (form.price <= 0) return "Price must be greater than 0";
    return null;
  };

  const handleSubmit = useCallback(async () => {
    const error = validateForm();
    if (error) {
      toast.error(error);
      return false;
    }

    try {
      if (editing?.id) {
        await fetchDataPut(endpoints.inventory.update(editing.id), form);
        toast.success("Inventory updated successfully");
      } else {
        await fetchDataPost(endpoints.inventory.add, form);
        toast.success("Inventory added successfully");
        resetForm();
      }
      await GetInventories(false);
      return true;
    } catch (err: any) {
      toast.error(err.message || "Something went wrong");
      return false;
    }
  }, [form, editing, GetInventories]);

  useEffect(() => {
    if (!editing) return;

    setForm({
      sku: editing.sku,
      barcode: editing.barcode || "",
      aircon_model_number: editing.aircon_model_number,
      aircon_name: editing.aircon_name,
      hp: editing.hp,
      type_of_aircon: editing.type_of_aircon?.toLowerCase() || "",
      indoor_outdoor_unit: editing.indoor_outdoor_unit?.toLowerCase() || "",
      quantity: editing.quantity,
      price: editing.price,
    });
  }, [editing]);

  const handleDelete = useCallback(
    (item: InventoryItem) => {
      confirmToast.confirm({
        title: "Delete Inventory",
        message: `Are you sure you want to delete inventory "${item.sku}"?`,
        confirmText: "Delete",
        cancelText: "Cancel",
        onConfirm: async () => {
          try {
            setSaving(true);
            setError(null);

            await fetchDataDelete(endpoints.inventory.delete(item.id));

            toast.success("Inventory deleted successfully");
            await GetInventories(false);
          } catch (err: any) {
            const msg = err.message || "Failed to delete inventory";
            setError(msg);
            toast.error(msg);
          } finally {
            setSaving(false);
          }
        },
      });
    },
    [GetInventories, confirmToast]
  );

  return {
    mode,
    setMode,
    editing,
    setEditing,
    loading,
    setLoading,
    saving,
    error,
    setSaving,
    GetInventories,
    allInventories,
    form,
    setForm,
    updateForm,
    handleSubmit,
    handleDelete,
    resetForm,
  };
}

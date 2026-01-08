import { useState, useCallback } from "react";
import { fetchDataGet, fetchWithError } from "../../lib/fetchData";
import endpoints from "../../lib/endpoints";
import { useToast } from "../../hooks/useToast";
import { useConfirmToast } from "../../hooks/useConfirmToast";
import { SupplierPORow } from "../components/types";

export function useSupplierPO() {
  const [mode, setMode] = useState<"list" | "create">("list");
  const [supplierPO, setSupplierPO] = useState<SupplierPORow[]>([]);

  const [loading, setLoading] = useState(false);
  const [saving, setSaving] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [editing, setEditing] = useState<SupplierPORow | null>(null);
  const [page, setPage] = useState(1);
  const [limit] = useState(10);
  const [total, setTotal] = useState(0);

  const toast = useToast();
  const confirmToast = useConfirmToast();

  // Load supplier POs
  const loadSupplierPO = useCallback(
    async (pageNumber: number = 1) => {
      try {
        setLoading(true);
        setError(null);

        const res = await fetchDataGet<any>(
          endpoints.supplierPO.getAll(pageNumber)
        );

        const list = res?.data || [];

        setSupplierPO(
          list.map((po: any) => ({
            id: po.id || po._id || "",
            poId: po.po_id || "",
            soId: po.sales_order_id || "",
            projectName: po.project?.name || "",
            supplierName: po.supplier?.name || "",
            status: po.status || "draft",
            totalAmount: po.totalAmount || 0,
            _raw: po,
          }))
        );

        setPage(res.page || pageNumber);
        setTotal(res.total || 0);
      } catch (e: any) {
        const errorMsg =
          e?.message || "Failed to load supplier purchase orders";
        setError(errorMsg);
        toast.error(errorMsg);
      } finally {
        setLoading(false);
      }
    },
    [toast]
  );

  const totalPages = Math.ceil(total / limit);

  // Handle edit
  const handleEdit = useCallback((row: SupplierPORow) => {
    setEditing(row);
    setMode("create");
  }, []);

  const handleDelete = useCallback(
    async (row: SupplierPORow) => {
      if (!row._raw?.id && !row._raw?._id && !row.id) {
        toast.error("Invalid Supplier PO");
        return;
      }

      const poId = row._raw?.id || row._raw?._id || row.id;

      confirmToast.confirm({
        title: "Delete Supplier PO",
        message: `Delete sales order "${row.poId}"?`,
        confirmText: "Delete",
        cancelText: "Cancel",
        onConfirm: async () => {
          try {
            setLoading(true);

            await fetchWithError(endpoints.supplierPO.delete(poId), {
              method: "DELETE",
            });

            toast.success("Supplier PO deleted successfully");

            await loadSupplierPO(page);
          } catch (e: any) {
            toast.error(e?.message || "Failed to delete Supplier PO");
          } finally {
            setLoading(false);
          }
        },
      });
    },
    [confirmToast, toast, page, loadSupplierPO]
  );

  return {
    mode,
    setMode,
    supplierPO,
    page,
    totalPages,
    setPage,
    loading,
    saving,
    setSaving,
    error,
    setError,
    editing,
    setEditing,
    loadSupplierPO,
    handleEdit,
    handleDelete,
  };
}

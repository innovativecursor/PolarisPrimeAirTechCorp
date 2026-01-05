/* eslint-disable @typescript-eslint/no-explicit-any */
import { useState, useCallback } from "react";
import {
  fetchDataGet,
  fetchDataPost,
  fetchWithError,
} from "../../lib/fetchData";
import endpoints from "../../lib/endpoints";
import { useToast } from "../../hooks/useToast";
import { useConfirmToast } from "../../hooks/useConfirmToast";
import {
  SupplierPORow,
  ProjectOption,
  SupplierOption,
  SalesOrderOption,
} from "../components/types";

export function useSupplierPO() {
  const [mode, setMode] = useState<"list" | "create">("list");
  const [orders, setOrders] = useState<SupplierPORow[]>([]);
  const [projectsOptions, setProjectsOptions] = useState<ProjectOption[]>([]);
  const [suppliersOptions, setSuppliersOptions] = useState<SupplierOption[]>(
    []
  );
  const [salesOrdersOptions, setSalesOrdersOptions] = useState<
    SalesOrderOption[]
  >([]);
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

  const loadOrders = useCallback(
    async (pageNumber: number = 1) => {
      try {
        setLoading(true);
        setError(null);

        const res = await fetchDataGet<any>(
          endpoints.supplierPO.getAll(pageNumber)
        );

        const list = res?.data || [];

        setOrders(
          list.map((po: any) => ({
            id: po.id || po._id || "",
            poId: po.poId || "",
            projectName: "",
            supplierName: "",
            soId: po.soId || "",
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

  // Load projects, suppliers, and sales orders
  const loadOptions = useCallback(async () => {
    try {
      const [projectsRes, suppliersRes, salesOrdersRes] = await Promise.all([
        fetchDataGet<{ projects: any[] }>(endpoints.project.getAll),
        fetchDataGet<any>(endpoints.supplier.getAll),
        fetchDataGet<any>(endpoints.salesOrder.getAll),
      ]);

      const projectsData = projectsRes?.projects || [];
      const suppliersData = Array.isArray(suppliersRes)
        ? suppliersRes
        : suppliersRes?.data || suppliersRes?.suppliers || [];
      const salesOrdersData = Array.isArray(salesOrdersRes)
        ? salesOrdersRes
        : salesOrdersRes?.salesOrders || salesOrdersRes?.data || [];

      setProjectsOptions(
        projectsData.map((p: any) => ({
          id: p._id || p.id || "",
          name: p.project_name || p.projectName || p.name || "",
          customer_id: p.customer_id || p.customerid || "",
        }))
      );

      setSuppliersOptions(
        suppliersData.map((s: any) => ({
          id: s._id || s.id || "",
          name: s.supplier_name || s.supplierName || s.name || "",
        }))
      );

      setSalesOrdersOptions(
        salesOrdersData.map((so: any) => ({
          id: so._id || so.id || "",
          name: `SO-${so._id || so.id || ""}`,
        }))
      );
    } catch (e: any) {
      console.error("Failed to load options:", e);
    }
  }, []);

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
        message: "Are you sure you want to delete this Supplier PO?",
        confirmText: "Delete",
        cancelText: "Cancel",
        onConfirm: async () => {
          try {
            setLoading(true);

            await fetchWithError(endpoints.supplierPO.delete(poId), {
              method: "DELETE",
            });

            toast.success("Supplier PO deleted successfully");

            await loadOrders(page);
          } catch (e: any) {
            toast.error(e?.message || "Failed to delete Supplier PO");
          } finally {
            setLoading(false);
          }
        },
      });
    },
    [confirmToast, toast, page, loadOrders]
  );

  return {
    mode,
    setMode,
    orders,
    projectsOptions,
    suppliersOptions,
    salesOrdersOptions,
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
    loadOrders,
    loadOptions,
    handleEdit,
    handleDelete,
  };
}

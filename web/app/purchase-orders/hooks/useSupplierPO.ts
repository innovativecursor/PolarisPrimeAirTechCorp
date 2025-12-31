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

  const toast = useToast();
  const confirmToast = useConfirmToast();

  // Load supplier POs
  const loadOrders = useCallback(async () => {
    try {
      setLoading(true);
      setError(null);

      // Get all suppliers first
      const suppliersRes = await fetchDataGet<any>(endpoints.supplier.getAll);

      const suppliersList = Array.isArray(suppliersRes)
        ? suppliersRes
        : suppliersRes?.data || suppliersRes?.suppliers || [];

      if (suppliersList.length === 0) {
        setOrders([]);
        return;
      }

      // Fetch POs for all suppliers
      const poPromises = suppliersList.map((supplier: any) => {
        const supplierId = supplier._id || supplier.id;
        return fetchDataGet<any>(endpoints.supplierPO.bySupplier(supplierId))
          .then((res) => ({
            supplierName:
              supplier.supplier_name ||
              supplier.supplierName ||
              supplier.name ||
              "",
            pos: res?.supplierPOs || [],
          }))
          .catch(() => ({ supplierName: "", pos: [] }));
      });

      const results = await Promise.all(poPromises);

      // Flatten all POs from all suppliers
      const allPOs: any[] = [];
      results.forEach((result) => {
        if (result.pos && Array.isArray(result.pos)) {
          result.pos.forEach((po: any) => {
            allPOs.push({
              ...po,
              supplierName: result.supplierName,
            });
          });
        }
      });

      setOrders(
        allPOs.map((po: any) => {
          // Extract project name from projectDetails array
          const projectName =
            po.projectDetails && po.projectDetails.length > 0
              ? po.projectDetails[0].project_name ||
                po.projectDetails[0].projectName ||
                ""
              : po.projectName || po.project_name || "";

          // Extract supplier name from supplierDetails array or use the one we added
          const supplierName =
            po.supplierDetails && po.supplierDetails.length > 0
              ? po.supplierDetails[0].supplier_name ||
                po.supplierDetails[0].supplierName ||
                ""
              : po.supplierName || po.supplier_name || "";

          return {
            id: po._id || po.id || "",
            projectName,
            supplierName,
            status: po.status || "draft",
            totalAmount: po.totalAmount || po.total_amount || 0,
            _raw: po,
          };
        })
      );
    } catch (e: any) {
      const errorMsg = e.message ?? "Failed to load supplier purchase orders";
      setError(errorMsg);
      toast.error(errorMsg);
    } finally {
      setLoading(false);
    }
  }, [toast]);

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
  const handleEdit = useCallback(
    async (row: SupplierPORow) => {
      try {
        setLoading(true);
        setError(null);

        const poId = row._raw?.id || row._raw?._id || row.id;
        const response = await fetchDataGet<{ supplierPO: any }>(
          endpoints.supplierPO.getById(poId)
        );

        console.log("Supplier PO Data fetched:", response);

        const supplierPO = response?.supplierPO || response;
        const fullData = {
          ...row,
          _raw: supplierPO,
        };

        console.log("Full data for editing:", fullData);

        setEditing(fullData);
        setMode("create");
      } catch (e: any) {
        const errorMsg = e.message ?? "Failed to fetch supplier PO details";
        setError(errorMsg);
        toast.error(errorMsg);
      } finally {
        setLoading(false);
      }
    },
    [toast]
  );

  return {
    mode,
    setMode,
    orders,
    projectsOptions,
    suppliersOptions,
    salesOrdersOptions,
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
  };
}

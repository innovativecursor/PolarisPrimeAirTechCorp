"use client";

import { useEffect, useState } from "react";
import endpoints from "@/app/lib/endpoints";
import {
  fetchDataGet,
  fetchDataPost,
  fetchWithError,
} from "@/app/lib/fetchData";
import { useToast } from "@/app/hooks/useToast";

export type SalesOrderStatus = "Approved" | "Pending" | "Draft" | string;

export type SalesOrderRow = {
  id: string;
  projectName: string;
  customerName: string;
  status: SalesOrderStatus;
  _raw?: any;
};

export type LineItemForm = {
  id: string;
  airconId: string;
  quantity: string;
  uom: string;
  price: string;
};

export type SalesOrderFormValues = {
  projectId: string;
  customerId: string;
  projectName: string;
  customerName: string;
  status: "approved" | "notapproved";
  items: LineItemForm[];
};

export type ProjectOption = { id: string; name: string };
export type CustomerOption = { id: string; name: string };
export type AirconOption = {
  id: string;
  name: string;
  model?: string;
  brand?: string;
};

export function useSalesOrders() {
  const toast = useToast();

  const [mode, setMode] = useState<"list" | "create">("list");
  const [orders, setOrders] = useState<SalesOrderRow[]>([]);
  const [editing, setEditing] = useState<SalesOrderRow | null>(null);

  const [projects, setProjects] = useState<ProjectOption[]>([]);
  const [customers, setCustomers] = useState<CustomerOption[]>([]);
  const [aircons, setAircons] = useState<AirconOption[]>([]);

  const [loading, setLoading] = useState(false);
  const [saving, setSaving] = useState(false);
  const [error, setError] = useState<string | null>(null);

  /* ---------- LOAD LIST ---------- */
  const loadOrders = async () => {
    try {
      setLoading(true);
      setError(null);

      const res = await fetchDataGet<any>(endpoints.salesOrder.getAll);
      const list = Array.isArray(res)
        ? res
        : res?.data || res?.items || res?.salesOrders || [];

      setOrders(
        list.map((o: any) => ({
          id: o.id || o._id || "",
          projectName: o.project_name || o.projectName || "",
          customerName: o.customer_name || o.customerName || "",
          status: o.status || "Pending",
          _raw: o,
        }))
      );
    } catch (e: any) {
      setError(e.message ?? "Failed to load sales orders");
      toast.error(e.message ?? "Failed to load sales orders");
    } finally {
      setLoading(false);
    }
  };

  /* ---------- LOAD OPTIONS ---------- */
  // const loadOptions = async () => {
  //   try {
  //     const [pRes, cRes, aRes] = await Promise.all([
  //       fetchDataGet<any>(endpoints.project.getAll),
  //       fetchDataGet<any>(endpoints.customer.getAll),
  //       fetchDataGet<any>(endpoints.salesOrder.getAircon),
  //     ]);

  //     const pList = pRes?.projects || pRes?.data || [];
  //     const cList = cRes?.data || cRes?.customers || [];
  //     const aList = aRes?.data || aRes?.aircons || [];

  //     setProjects(
  //       pList.map((p: any) => ({
  //         id: p.id || p._id,
  //         name: p.project_name || p.name,
  //       }))
  //     );

  //     setCustomers(
  //       cList.map((c: any) => ({
  //         id: c.id || c._id,
  //         name: c.customername || c.name,
  //       }))
  //     );

  //     setAircons(
  //       aList.map((a: any) => ({
  //         id: a.id || a._id,
  //         name: a.name,
  //         model: a.model,
  //         brand: a.brand,
  //       }))
  //     );
  //   } catch (e) {
  //     console.error("Failed to load options", e);
  //   }
  // };

  const loadOptions = async () => {
    try {
      const res = await fetchDataGet<any>(endpoints.salesOrder.getAircon);

      const aList = res?.data || res?.aircons || [];

      setAircons(
        aList.map((a: any) => ({
          id: a.id || a._id,
          name: a.name,
          model: a.model,
          brand: a.brand,
        }))
      );
    } catch (e) {
      console.error("Failed to load aircon options", e);
    }
  };

  /* ---------- EDIT FETCH ---------- */
  const editOrder = async (row: SalesOrderRow) => {
    try {
      setLoading(true);
      const id = row._raw?.id || row._raw?._id || row.id;
      const res = await fetchDataGet<any>(endpoints.salesOrder.getById(id));

      setEditing({
        ...row,
        _raw: res.salesOrder || res,
      });
      setMode("create");
    } catch (e: any) {
      toast.error(e.message ?? "Failed to load sales order");
    } finally {
      setLoading(false);
    }
  };

  /* ---------- SAVE ---------- */
  const saveOrder = async (values: SalesOrderFormValues) => {
    try {
      setSaving(true);
      setError(null);

      const payload = {
        projectId: values.projectId,
        customerId: values.customerId,
        items: values.items.map((i) => ({
          airconId: i.airconId,
          qty: Number(i.quantity),
          uom: i.uom,
          price: Number(i.price),
        })),
      };

      if (editing?._raw?.id || editing?._raw?._id) {
        const id = editing._raw.id || editing._raw._id;
        await fetchWithError(endpoints.salesOrder.edit, {
          method: "PUT",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({
            id,
            ...payload,
            status: values.status,
          }),
        });
        toast.success("Sales order updated");
      } else {
        await fetchDataPost(endpoints.salesOrder.create, payload);
        toast.success("Sales order created");
      }

      setMode("list");
      setEditing(null);
      await loadOrders();
    } catch (e: any) {
      setError(e.message ?? "Failed to save sales order");
      toast.error(e.message ?? "Failed to save sales order");
    } finally {
      setSaving(false);
    }
  };

  /* ---------- DELETE ---------- */
  const deleteOrder = async (row: SalesOrderRow) => {
    try {
      setSaving(true);
      await fetchWithError(endpoints.salesOrder.delete, {
        method: "DELETE",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          id: row._raw?.id || row._raw?._id || row.id,
        }),
      });
      toast.success("Sales order deleted");
      await loadOrders();
    } catch (e: any) {
      toast.error(e.message ?? "Failed to delete sales order");
    } finally {
      setSaving(false);
    }
  };

  useEffect(() => {
    loadOrders();
    loadOptions();
  }, []);

  return {
    // state
    mode,
    orders,
    editing,
    projects,
    customers,
    aircons,
    loading,
    saving,
    error,

    // setters
    setMode,
    setEditing,

    // actions
    editOrder,
    saveOrder,
    deleteOrder,
  };
}

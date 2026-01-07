/* eslint-disable @typescript-eslint/no-explicit-any */
import { useEffect, useState } from "react";
import {
  fetchDataGet,
  fetchDataPost,
  fetchWithError,
} from "@/app/lib/fetchData";
import endpoints from "@/app/lib/endpoints";
import { useToast } from "@/app/hooks/useToast";

export type CustomerRow = {
  id: string;
  customerid: string;
  name: string;
  org: string;
  location: string;
  tin: string;
  _raw?: any;
};

export type CustomerFormValues = {
  id?: string;
  name: string;
  org: string;
  location: string;
  tin: string;
};

export function useCustomers() {
  const [mode, setMode] = useState<"list" | "create">("list");
  const [customers, setCustomers] = useState<CustomerRow[]>([]);
  const [loading, setLoading] = useState(false);
  const [saving, setSaving] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [editing, setEditing] = useState<CustomerRow | null>(null);

  const toast = useToast();

  // -------- LOAD --------
  const loadCustomers = async () => {
    try {
      setLoading(true);
      setError(null);

      const apiData = await fetchDataGet<any>(endpoints.customer.getAll);

      let list: any[] = [];
      if (Array.isArray(apiData?.data)) list = apiData.data;
      else if (Array.isArray(apiData)) list = apiData;
      else if (apiData && typeof apiData === "object") {
        const arr = Object.values(apiData).find(Array.isArray);
        if (arr) list = arr as any[];
      }

      const rows: CustomerRow[] = list.map((c: any) => ({
        id: c.id || c._id || "",
        customerid: c.customerid || "",
        name: c.customername || c.name || "",
        org: c.customerorg || "",
        location: c.address || "",
        tin: c.tinnumber || "",
        _raw: c,
      }));

      setCustomers(rows);
    } catch (e: any) {
      setError(e.message ?? "Failed to load customers");
      toast.error(e.message ?? "Failed to load customers");
    } finally {
      setLoading(false);
    }
  };

  // -------- CREATE / UPDATE --------
  const saveCustomer = async (values: CustomerFormValues) => {
    try {
      setSaving(true);
      setError(null);

      const payload = {
        id: values.id ?? "",
        customername: values.name,
        customerorg: values.org,
        address: values.location,
        tinnumber: values.tin,
      };

      await fetchDataPost(endpoints.customer.addOrUpdate, payload);

      toast.success(values.id ? "Customer updated" : "Customer created");
      setMode("list");
      setEditing(null);
      await loadCustomers();
    } catch (e: any) {
      setError(e.message ?? "Failed to save customer");
      toast.error(e.message ?? "Failed to save customer");
    } finally {
      setSaving(false);
    }
  };

  // -------- DELETE --------
  const deleteCustomer = async (id: string) => {
    try {
      setSaving(true);
      await fetchWithError(endpoints.customer.delete, {
        method: "DELETE",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ id }),
      });
      toast.success("Customer deleted");
      await loadCustomers();
    } catch (e: any) {
      toast.error(e.message ?? "Failed to delete customer");
    } finally {
      setSaving(false);
    }
  };

  useEffect(() => {
    void loadCustomers();
  }, []);

  return {
    // state
    mode,
    customers,
    loading,
    saving,
    error,
    editing,

    // setters
    setMode,
    setEditing,

    // actions
    saveCustomer,
    deleteCustomer,
  };
}

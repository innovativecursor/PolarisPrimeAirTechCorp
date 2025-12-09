/* eslint-disable @typescript-eslint/no-explicit-any */
"use client";

import { useEffect, useMemo, useState } from "react";
import AppShell from "../components/layout/AppShell";
import PolarisTable, {
  PolarisTableColumn,
} from "../components/table/PolarisTable";
import { FiEdit2, FiTrash2, FiPlus } from "react-icons/fi";
import endpoints from "../lib/endpoints";
import { fetchDataGet, fetchDataPost, fetchWithError } from "../lib/fetchData";
import { useAuth } from "../components/auth/AuthContext";
import { useToast } from "../hooks/useToast";
import { useConfirmToast } from "../hooks/useConfirmToast";

// shadcn UI select for aircon dropdown
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";

/* ------------------------------------------------------------------ */
/*  TYPES                                                              */
/* ------------------------------------------------------------------ */

type SalesOrderStatus = "Approved" | "Pending" | "Draft" | string;

export type SalesOrderRow = {
  id: string;
  projectName: string;
  customerName: string;
  status: SalesOrderStatus;
  _raw?: any;
};

type LineItemForm = {
  id: string; // local key for React list
  airconId: string;
  quantity: string;
  uom: string;
  price: string;
};

type SalesOrderFormValues = {
  projectId: string;
  customerId: string;
  projectName: string;
  customerName: string;
  items: LineItemForm[];
};

type ProjectOption = { id: string; name: string };
type CustomerOption = { id: string; name: string };
type AirconOption = {
  id: string;
  name: string;
  model?: string;
  brand?: string;
};

/* ------------------------------------------------------------------ */
/*  PAGE                                                               */
/* ------------------------------------------------------------------ */

export default function SalesOrdersPage() {
  const [mode, setMode] = useState<"list" | "create">("list");
  const [orders, setOrders] = useState<SalesOrderRow[]>([]);
  const [loading, setLoading] = useState(false);
  const [saving, setSaving] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [editing, setEditing] = useState<SalesOrderRow | null>(null);

  const [projectsOptions, setProjectsOptions] = useState<ProjectOption[]>([]);
  const [customersOptions, setCustomersOptions] = useState<CustomerOption[]>(
    []
  );
  const [airconOptions, setAirconOptions] = useState<AirconOption[]>([]);

  const { user } = useAuth();
  const toast = useToast();
  const confirmToast = useConfirmToast();
  const displayName = user?.name || user?.email || "Admin";

  /* -------------------- LOAD SALES ORDERS -------------------- */

  const loadOrders = async () => {
    try {
      setLoading(true);
      setError(null);

      const apiData = await fetchDataGet<any>(endpoints.salesOrder.getAll);

      const list: any[] = Array.isArray(apiData)
        ? apiData
        : apiData?.data ||
          apiData?.items ||
          apiData?.salesOrders ||
          apiData?.orders ||
          [];

      const rows: SalesOrderRow[] = list.map((o: any) => ({
        id: o.id || o._id || o.sales_order_id || "",
        projectName:
          o.project_name || o.projectName || o.project?.project_name || "",
        customerName:
          o.customer_name || o.customerName || o.customer?.customername || "",
        status: o.status || "Pending",
        _raw: o,
      }));

      setOrders(rows);
    } catch (e: any) {
      const errorMsg = e.message ?? "Failed to load sales orders";
      setError(errorMsg);
      toast.error(errorMsg);
    } finally {
      setLoading(false);
    }
  };

  /* --------- LOAD PROJECTS + CUSTOMERS FOR SELECTS --------- */

  const loadProjectsAndCustomers = async () => {
    try {
      const [projectsRes, customersRes] = await Promise.all([
        fetchDataGet<any>(endpoints.project.getAll),
        fetchDataGet<any>(endpoints.customer.getAll),
      ]);

      const projList: any[] = Array.isArray(projectsRes)
        ? projectsRes
        : projectsRes?.projects ||
          projectsRes?.data ||
          projectsRes?.items ||
          [];

      const custList: any[] = Array.isArray(customersRes)
        ? customersRes
        : customersRes?.customers ||
          customersRes?.data ||
          customersRes?.items ||
          [];

      setProjectsOptions(
        projList.map((p: any) => ({
          id: p.id || p._id || p.projectId || "",
          name: p.project_name || p.projectName || p.name || "",
        }))
      );

      setCustomersOptions(
        custList.map((c: any) => ({
          id: c.id || c._id || "",
          name: c.customername || c.customer_name || c.name || "",
        }))
      );
    } catch (e) {
      console.error("Failed to load projects/customers", e);
    }
  };

  /* ------------------------ LOAD AIRCONS ------------------------ */

  const loadAircons = async () => {
    try {
      const res = await fetchDataGet<any>(endpoints.salesOrder.getAircon);

      const list: any[] = Array.isArray(res)
        ? res
        : res?.aircons || res?.items || res?.data || [];

      setAirconOptions(
        list.map((a: any) => ({
          id: a.id || a._id || "",
          name: a.name || "",
          model: a.model,
          brand: a.brand,
        }))
      );
    } catch (e) {
      console.error("Failed to load aircons", e);
    }
  };

  useEffect(() => {
    void loadOrders();
    void loadProjectsAndCustomers();
    void loadAircons();
  }, []);

  /* ----------------------- HANDLERS ----------------------- */

  const handleCreateClick = () => {
    setEditing(null);
    setMode("create");
  };

  const handleEdit = async (row: SalesOrderRow) => {
    try {
      setLoading(true);
      // Fetch full sales order details including line items
      const salesOrderId = row._raw?.id ?? row._raw?._id ?? row.id;
      const response: any = await fetchDataGet(
        endpoints.salesOrder.getById(salesOrderId)
      );

      // Extract salesOrder from response (API returns { salesOrder: {...} })
      const salesOrderData = response.salesOrder || response;

      console.log("Sales Order Data fetched:", salesOrderData);

      // Merge the fetched data with the row data
      const fullData = {
        ...row,
        _raw: salesOrderData,
      };

      console.log("Full data for editing:", fullData);

      setEditing(fullData);
      setMode("create");
    } catch (e: any) {
      const errorMsg = e.message ?? "Failed to fetch sales order details";
      setError(errorMsg);
      toast.error(errorMsg);
    } finally {
      setLoading(false);
    }
  };

  const handleDelete = (row: SalesOrderRow) => {
    confirmToast.confirm({
      title: "Delete Sales Order",
      message: `Are you sure you want to delete sales order "${row.id}" for ${row.projectName}? This action cannot be undone.`,
      confirmText: "Delete",
      cancelText: "Cancel",
      onConfirm: async () => {
        try {
          setSaving(true);

          await fetchWithError(endpoints.salesOrder.delete, {
            method: "DELETE",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify({
              id: row._raw?.id ?? row._raw?._id ?? row.id,
            }),
          });

          await loadOrders();
          toast.success("Sales order deleted successfully");
        } catch (e: any) {
          toast.error(e.message ?? "Failed to delete sales order");
        } finally {
          setSaving(false);
        }
      },
    });
  };

  const handleCancelForm = () => {
    setMode("list");
    setEditing(null);
  };

  const handleSubmitForm = async (values: SalesOrderFormValues) => {
    try {
      setSaving(true);
      setError(null);

      // 🔑 Exactly what your backend expects
      const payload = {
        projectId: values.projectId,
        customerId: values.customerId,
        items: values.items.map((i) => ({
          airconId: i.airconId,
          qty: Number(i.quantity || 0),
          uom: i.uom,
          price: Number(i.price || 0),
        })),
      };

      const isEdit = editing && (editing._raw?.id || editing._raw?._id);

      if (editing && editing._raw?.id) {
        // Update existing
        await fetchWithError(endpoints.salesOrder.edit, {
          method: "PUT",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({
            id: editing._raw.id,
            ...payload,
          }),
        });
      } else if (editing && editing._raw?._id) {
        await fetchWithError(endpoints.salesOrder.edit, {
          method: "PUT",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({
            id: editing._raw._id,
            ...payload,
          }),
        });
      } else {
        // Create new
        await fetchDataPost(endpoints.salesOrder.create, payload);
      }

      await loadOrders();
      setMode("list");
      setEditing(null);
      toast.success(
        isEdit
          ? "Sales order updated successfully"
          : "Sales order created successfully"
      );
    } catch (e: any) {
      const errorMsg = e.message ?? "Failed to save sales order";
      setError(errorMsg);
      toast.error(errorMsg);
    } finally {
      setSaving(false);
    }
  };

  /* ----------------------- RENDER ----------------------- */

  return (
    <AppShell>
      <div className="space-y-6">
        {/* Top header */}
        <header className="flex flex-col gap-3 md:flex-row md:items-center md:justify-between">
          <div>
            <p className="text-xs font-semibold tracking-[0.2em] uppercase text-slate-400">
              Sales orders
            </p>
            <h1 className="mt-1 text-2xl md:text-3xl font-semibold text-slate-900">
              Polaris Prime Air Tech Corp
            </h1>
          </div>
          <div className="text-xs text-slate-500 text-right">
            <p className="uppercase tracking-[0.16em] text-slate-400 mb-1">
              Welcome back
            </p>
            <p className="font-medium text-slate-700">{displayName}</p>
          </div>
        </header>

        {error && (
          <p className="text-xs font-medium text-rose-500 bg-rose-50 border border-rose-100 rounded-xl px-3 py-2 inline-flex">
            {error}
          </p>
        )}

        {mode === "list" ? (
          <SalesOrdersListCard
            loading={loading || saving}
            orders={orders}
            onCreate={handleCreateClick}
            onEdit={handleEdit}
            onDelete={handleDelete}
          />
        ) : (
          <CreateSalesOrderCard
            key={editing?._raw?.id || editing?._raw?._id || "new"}
            saving={saving}
            initialValues={editing ?? undefined}
            projects={projectsOptions}
            customers={customersOptions}
            aircons={airconOptions}
            onCancel={handleCancelForm}
            onSubmit={handleSubmitForm}
          />
        )}
      </div>
    </AppShell>
  );
}

/* ------------------------------------------------------------------ */
/*  SALES ORDER REGISTRY CARD                                         */
/* ------------------------------------------------------------------ */

type SalesOrdersListProps = {
  orders: SalesOrderRow[];
  loading: boolean;
  onCreate: () => void;
  onEdit: (row: SalesOrderRow) => void;
  onDelete: (row: SalesOrderRow) => void;
};

function SalesOrdersListCard({
  orders,
  loading,
  onCreate,
  onEdit,
  onDelete,
}: SalesOrdersListProps) {
  const columns: PolarisTableColumn[] = useMemo(
    () => [
      { key: "id", header: "Sales order ID" },
      { key: "projectName", header: "Project name" },
      { key: "customerName", header: "Customer name" },
      { key: "status", header: "Status" },
      { key: "actions", header: "Actions", align: "right" },
    ],
    []
  );

  const columnWidths = "1.2fr 2.4fr 2.4fr 1.4fr 1.2fr";

  return (
    <section className="w-full mx-auto rounded-[32px] bg-white border border-slate-100 shadow-[0_24px_60px_rgba(15,23,42,0.08)] px-8 py-8">
      {/* Card header */}
      <div className="flex items-start justify-between mb-6">
        <div>
          <p className="text-xs font-semibold tracking-[0.24em] uppercase text-slate-400 mb-2">
            Sales orders
          </p>
          <h2 className="text-lg md:text-xl font-semibold text-slate-900">
            Sales Order Registry
          </h2>
        </div>

        <button
          type="button"
          onClick={onCreate}
          disabled={loading}
          className="inline-flex items-center rounded-[999px] bg-[#1f285c] text-white px-6 py-2.5 text-xs md:text-sm font-semibold shadow-[0_18px_40px_rgba(15,23,42,0.35)] hover:bg-[#171e48] disabled:opacity-60"
        >
          Create sales order
        </button>
      </div>

      <PolarisTable
        columns={columns}
        data={orders}
        columnWidths={columnWidths}
        getCell={(row, key) => {
          const o = row as SalesOrderRow;

          if (key === "id") {
            return (
              <span className="font-mono text-xs text-slate-700">{o.id}</span>
            );
          }
          if (key === "projectName") {
            return <span className="text-slate-900">{o.projectName}</span>;
          }
          if (key === "customerName") {
            return <span className="text-slate-700">{o.customerName}</span>;
          }
          if (key === "status") {
            const isApproved =
              o.status.toLowerCase() === "approved" ||
              o.status.toLowerCase() === "complete";
            return (
              <span
                className={`inline-flex items-center rounded-full px-3 py-1 text-xs font-medium ${
                  isApproved
                    ? "bg-emerald-50 text-emerald-600"
                    : "bg-amber-50 text-amber-600"
                }`}
              >
                {o.status || "Pending"}
              </span>
            );
          }

          return (
            <div className="flex justify-end gap-3">
              <button
                type="button"
                onClick={() => onEdit(o)}
                className="inline-flex h-9 w-9 items-center justify-center rounded-full border border-slate-200 bg-white text-slate-500 hover:bg-slate-100"
              >
                <FiEdit2 className="h-3.5 w-3.5" />
              </button>

              <button
                type="button"
                onClick={() => onDelete(o)}
                className="inline-flex h-9 w-9 items-center justify-center rounded-full bg-rose-50 text-rose-500 hover:bg-rose-100"
              >
                <FiTrash2 className="h-3.5 w-3.5" />
              </button>
            </div>
          );
        }}
      />
    </section>
  );
}

/* ------------------------------------------------------------------ */
/*  CREATE / EDIT SALES ORDER CARD                                    */
/* ------------------------------------------------------------------ */

type CreateSalesOrderCardProps = {
  initialValues?: SalesOrderRow;
  projects: ProjectOption[];
  customers: CustomerOption[];
  aircons: AirconOption[];
  saving: boolean;
  onCancel: () => void;
  onSubmit: (values: SalesOrderFormValues) => Promise<void> | void;
};

function CreateSalesOrderCard({
  initialValues,
  projects,
  customers,
  aircons,
  saving,
  onCancel,
  onSubmit,
}: CreateSalesOrderCardProps) {
  const [form, setForm] = useState<SalesOrderFormValues>(() => {
    console.log("Initializing form with initialValues:", initialValues);
    console.log("Available aircons:", aircons);
    console.log("Available projects:", projects);
    console.log("Available customers:", customers);

    // Extract line items from initialValues if editing
    let items: LineItemForm[] = [
      {
        id: crypto.randomUUID(),
        airconId: "",
        quantity: "0",
        uom: "unit",
        price: "0",
      },
    ];

    if (initialValues?._raw?.items && Array.isArray(initialValues._raw.items)) {
      items = initialValues._raw.items.map((item: any) => {
        // Try to find airconId by matching airconName with aircons list
        let airconId = item.airconId || item.aircon_id || "";

        if (!airconId && item.airconName && aircons.length > 0) {
          const matchedAircon = aircons.find((a) => a.name === item.airconName);
          airconId = matchedAircon?.id || "";
        }

        return {
          id: crypto.randomUUID(), // Generate new local ID for React
          airconId,
          quantity: String(item.qty || item.quantity || 0),
          uom: item.uom || "unit",
          price: String(item.price || 0),
        };
      });
    }

    // Try to get projectId and customerId from _raw, or match by name
    let projectId =
      initialValues?._raw?.projectId || initialValues?._raw?.project_id || "";
    let customerId =
      initialValues?._raw?.customerId || initialValues?._raw?.customer_id || "";

    // If IDs not found, try to match by name
    if (!projectId && initialValues?.projectName && projects.length > 0) {
      const matchedProject = projects.find(
        (p) => p.name === initialValues.projectName
      );
      projectId = matchedProject?.id || "";
    }

    if (!customerId && initialValues?.customerName && customers.length > 0) {
      const matchedCustomer = customers.find(
        (c) => c.name === initialValues.customerName
      );
      customerId = matchedCustomer?.id || "";
    }

    return {
      projectId,
      customerId,
      projectName:
        initialValues?.projectName || initialValues?._raw?.projectName || "",
      customerName:
        initialValues?.customerName || initialValues?._raw?.customerName || "",
      items,
    };
  });

  const isEdit = Boolean(initialValues);

  const updateItem = (id: string, patch: Partial<LineItemForm>) => {
    setForm((prev) => ({
      ...prev,
      items: prev.items.map((item) =>
        item.id === id ? { ...item, ...patch } : item
      ),
    }));
  };

  const addItem = () => {
    setForm((prev) => ({
      ...prev,
      items: [
        ...prev.items,
        {
          id: crypto.randomUUID(),
          airconId: "",
          quantity: "0",
          uom: "unit",
          price: "0",
        },
      ],
    }));
  };

  const removeItem = (id: string) => {
    setForm((prev) => ({
      ...prev,
      items: prev.items.filter((i) => i.id !== id),
    }));
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    await onSubmit(form);
  };

  return (
    <section className="rounded-[32px] bg-white border border-slate-100 shadow-[0_24px_60px_rgba(15,23,42,0.08)] px-8 py-8">
      {/* Header */}
      <div className="flex items-start justify-between mb-8">
        <div>
          <p className="text-xs font-semibold tracking-[0.24em] uppercase text-slate-400 mb-2">
            Sales orders
          </p>
          <h2 className="text-lg md:text-xl font-semibold text-slate-900">
            {isEdit ? "Edit Sales Order" : "Create Sales Order"}
          </h2>
        </div>

        <button
          type="button"
          onClick={onCancel}
          className="text-xs font-medium text-slate-400 hover:text-slate-600"
        >
          Cancel
        </button>
      </div>

      <form onSubmit={handleSubmit} className="space-y-8">
        {/* Project + customer */}
        <div className="grid gap-4 md:grid-cols-2">
          {/* Project */}
          <div className="space-y-1.5">
            <label className="block text-sm font-medium text-slate-600">
              Project name
            </label>
            <Select
              value={form.projectId}
              onValueChange={(val) => {
                const proj = projects.find((p) => p.id === val);
                setForm((prev) => ({
                  ...prev,
                  projectId: val,
                  projectName: proj?.name || "",
                }));
              }}
            >
              <SelectTrigger className="w-full rounded-2xl border border-slate-200 bg-slate-50 px-4 py-2.5 text-sm text-slate-900 focus:outline-none focus:ring-2 focus:ring-slate-900 focus:bg-white">
                <SelectValue placeholder="Choose project" />
              </SelectTrigger>
              <SelectContent>
                {projects.map((p) => (
                  <SelectItem key={p.id} value={p.id}>
                    {p.name}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>

          {/* Customer */}
          <div className="space-y-1.5">
            <label className="block text-sm font-medium text-slate-600">
              Customer name
            </label>
            <Select
              value={form.customerId}
              onValueChange={(val) => {
                const cust = customers.find((c) => c.id === val);
                setForm((prev) => ({
                  ...prev,
                  customerId: val,
                  customerName: cust?.name || "",
                }));
              }}
            >
              <SelectTrigger className="w-full rounded-2xl border border-slate-200 bg-slate-50 px-4 py-2.5 text-sm text-slate-900 focus:outline-none focus:ring-2 focus:ring-slate-900 focus:bg-white">
                <SelectValue placeholder="Choose customer" />
              </SelectTrigger>
              <SelectContent>
                {customers.map((c) => (
                  <SelectItem key={c.id} value={c.id}>
                    {c.name}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>
        </div>

        {/* Line items */}
        <div className="space-y-6">
          {form.items.map((item) => (
            <div
              key={item.id}
              className="grid gap-4 md:grid-cols-[2fr,1fr,1.4fr,1fr,auto]"
            >
              {/* Aircon (shadcn select) */}
              <div className="space-y-1.5">
                <label className="block text-sm font-medium text-slate-600">
                  Select aircon
                </label>

                <Select
                  value={item.airconId}
                  onValueChange={(val) =>
                    updateItem(item.id, { airconId: val })
                  }
                >
                  <SelectTrigger className="w-full rounded-2xl border border-slate-200 bg-slate-50 px-4 py-2.5 text-sm text-slate-900 focus:outline-none focus:ring-2 focus:ring-slate-900 focus:bg-white">
                    <SelectValue placeholder="Choose a unit" />
                  </SelectTrigger>
                  <SelectContent>
                    {aircons.map((a) => (
                      <SelectItem key={a.id} value={a.id}>
                        {a.name}
                        {a.model ? ` • ${a.model}` : ""}
                        {a.brand ? ` • ${a.brand}` : ""}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>

              {/* Quantity */}
              <div className="space-y-1.5">
                <label className="block text-sm font-medium text-slate-600">
                  Quantity
                </label>
                <input
                  type="number"
                  min={0}
                  value={item.quantity}
                  onChange={(e) =>
                    updateItem(item.id, { quantity: e.target.value })
                  }
                  className="block w-full rounded-2xl border border-slate-200 bg-slate-50 px-4 py-2.5 text-sm text-slate-900 focus:outline-none focus:ring-2 focus:ring-slate-900 focus:bg-white"
                />
              </div>

              {/* UOM */}
              <div className="space-y-1.5">
                <label className="block text-sm font-medium text-slate-600">
                  Unit of measurement
                </label>
                <Select
                  value={item.uom}
                  onValueChange={(val) => updateItem(item.id, { uom: val })}
                >
                  <SelectTrigger className="w-full rounded-2xl border border-slate-200 bg-slate-50 px-4 py-2.5 text-sm text-slate-900 focus:outline-none focus:ring-2 focus:ring-slate-900 focus:bg-white">
                    <SelectValue placeholder="Select UOM" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="unit">unit</SelectItem>
                    <SelectItem value="pcs">pcs</SelectItem>
                    <SelectItem value="set">set</SelectItem>
                  </SelectContent>
                </Select>
              </div>

              {/* Price */}
              <div className="space-y-1.5">
                <label className="block text-sm font-medium text-slate-600">
                  Price
                </label>
                <input
                  type="number"
                  min={0}
                  step="0.01"
                  value={item.price}
                  onChange={(e) =>
                    updateItem(item.id, { price: e.target.value })
                  }
                  className="block w-full rounded-2xl border border-slate-200 bg-slate-50 px-4 py-2.5 text-sm text-slate-900 focus:outline-none focus:ring-2 focus:ring-slate-900 focus:bg-white"
                />
              </div>

              {/* Remove line */}
              <div className="flex items-end">
                {form.items.length > 1 && (
                  <button
                    type="button"
                    onClick={() => removeItem(item.id)}
                    className="inline-flex h-10 w-10 items-center justify-center rounded-2xl bg-rose-50 text-rose-500 hover:bg-rose-100"
                  >
                    <FiTrash2 className="h-4 w-4" />
                  </button>
                )}
              </div>
            </div>
          ))}
        </div>

        {/* Add + Save */}
        <div className="mt-6 flex items-center justify-between">
          <button
            type="button"
            onClick={addItem}
            className="inline-flex items-center gap-2 rounded-2xl border border-slate-200 bg-white px-4 py-2 text-xs font-medium text-slate-600 hover:bg-slate-50"
          >
            <FiPlus className="h-4 w-4" />
            Add line
          </button>

          <button
            type="submit"
            disabled={saving}
            className="inline-flex items-center rounded-[999px] bg-[#1f285c] text-white px-6 py-2.5 text-sm font-semibold shadow-[0_18px_40px_rgba(15,23,42,0.35)] hover:bg-[#171e48] disabled:opacity-60"
          >
            {saving ? "Saving…" : "Save sales order"}
          </button>
        </div>
      </form>
    </section>
  );
}

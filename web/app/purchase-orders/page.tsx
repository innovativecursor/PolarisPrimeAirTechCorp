/* eslint-disable @typescript-eslint/no-explicit-any */
"use client";

import { useEffect } from "react";
import AppShell from "../components/layout/AppShell";
import { useAuth } from "../components/auth/AuthContext";
import { useToast } from "../hooks/useToast";
import { fetchDataPost, fetchWithError } from "../lib/fetchData";
import endpoints from "../lib/endpoints";
import SupplierPOListCard from "./components/SupplierPOListCard";
import CreateSupplierPOCard from "./components/CreateSupplierPOCard";
import { useSupplierPO } from "./hooks/useSupplierPO";
import { SupplierPOFormValues } from "./components/types";

export default function SupplierPOPage() {
  const { user } = useAuth();
  const toast = useToast();
  const displayName = user?.name || user?.email || "Admin";

  const {
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
    page,
    totalPages,
    setPage,
    handleDelete,
  } = useSupplierPO();

  // Load data on mount
  useEffect(() => {
    void loadOrders(page);
  }, [page]);

  useEffect(() => {
    void loadOptions();
  }, []);

  // Handlers
  const handleCreateClick = () => {
    setEditing(null);
    setMode("create");
  };

  const handleCancelForm = () => {
    setMode("list");
    setEditing(null);
  };

  const handleSubmitForm = async (values: SupplierPOFormValues) => {
    try {
      setSaving(true);
      setError(null);

      const isEdit = Boolean(editing?._raw?.id || editing?._raw?._id);

      // items ko backend format me convert
      const items = values.items.map((i) => ({
        description: i.description,
        quantity: Number(i.quantity || 0),
        uom: i.uom,
      }));

      if (isEdit) {
        if (!editing || !editing._raw) {
          throw new Error("Editing data missing");
        }

        await fetchWithError(endpoints.supplierPO.update, {
          method: "PUT",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({
            supplierPOId: editing._raw.id || editing._raw._id,
            status: values.status,
            items,
          }),
        });

        toast.success("Supplier PO updated successfully");
      } else {
        const payload: any = {
          projectId: values.projectId,
          supplierId: values.supplierId,
          items,
        };

        if (values.soId) {
          payload.soId = values.soId;
        }

        if (values.customerPoIds?.length) {
          payload.customerPoIds = values.customerPoIds;
        }

        await fetchDataPost(endpoints.supplierPO.add, payload);

        toast.success("Supplier PO created successfully");
      }

      await loadOrders(page);

      setMode("list");
      setEditing(null);
    } catch (e: any) {
      const errorMsg = e?.message || "Failed to save supplier PO";
      setError(errorMsg);
      toast.error(errorMsg);
    } finally {
      setSaving(false);
    }
  };

  return (
    <AppShell>
      <div className="space-y-6">
        {/* Top header */}
        <header className="flex flex-col gap-3 md:flex-row md:items-center md:justify-between">
          <div>
            <p className="text-xs font-semibold tracking-[0.2em] uppercase text-slate-400">
              Supplier Purchase Orders
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
          <SupplierPOListCard
            loading={loading || saving}
            orders={orders}
            onCreate={handleCreateClick}
            onEdit={handleEdit}
            page={page}
            totalPages={totalPages}
            setPage={setPage}
            onDelete={handleDelete}
          />
        ) : (
          <CreateSupplierPOCard
            key={editing?._raw?.id || editing?._raw?._id || "new"}
            saving={saving}
            initialValues={editing ?? undefined}
            projects={projectsOptions}
            suppliers={suppliersOptions}
            salesOrders={salesOrdersOptions}
            onCancel={handleCancelForm}
            onSubmit={handleSubmitForm}
          />
        )}
      </div>
    </AppShell>
  );
}

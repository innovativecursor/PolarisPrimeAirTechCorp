import { useCallback, useEffect } from "react";
import CreateSupplier from "./CreateSupplier";
import { useSupplier } from "./hooks/useSupplier";
import SupplierList from "./SupplierList";
import { useConfirmToast } from "@/app/hooks/useConfirmToast";
import { Supplier } from "./type";

export default function AddSupplier() {
  const {
    mode,
    setMode,
    editing,
    setEditing,
    loading,
    saving,
    createSupplier,
    GetSupplier,
    allSupplier,
    deleteSupplier,
  } = useSupplier();
  const confirmToast = useConfirmToast();
  const handleCancelForm = () => {
    setMode("list");
    setEditing(null);
  };

  const handleCreateClick = () => {
    setEditing(null);
    setMode("create");
  };

  const handleEditClick = (id: string) => {
    setEditing(id);
    setMode("create");
  };

  const handleDelete = useCallback(
    (supplier: Supplier) => {
      confirmToast.confirm({
        title: "Delete Supplier",
        message: `Are you sure you want to delete supplier "${supplier.supplier_name}"?`,
        confirmText: "Delete",
        cancelText: "Cancel",
        onConfirm: async () => {
          await deleteSupplier(supplier.id);
        },
      });
    },
    [deleteSupplier, confirmToast]
  );

  useEffect(() => {
    void GetSupplier(true);
  }, []);

  return (
    <div className="space-y-6">
      {mode === "list" ? (
        <SupplierList
          onCreate={handleCreateClick}
          loading={loading}
          allSupplier={allSupplier}
          onEdit={handleEditClick}
          onDelete={handleDelete}
        />
      ) : (
        <CreateSupplier
          onCancel={handleCancelForm}
          onSubmit={createSupplier}
          saving={saving}
          initialData={
            editing ? allSupplier?.find((s) => s?.id === editing) || null : null
          }
        />
      )}
    </div>
  );
}

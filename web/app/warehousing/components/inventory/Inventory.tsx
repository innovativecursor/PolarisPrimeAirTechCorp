import { useEffect } from "react";
import CraeteInventory from "./CreateInventory";
import { useInventory } from "./hooks/useInventory";
import InventoryList from "./InventoryLIst";
import { InventoryItem } from "./type";

export default function Inventory() {
  const {
    mode,
    setMode,
    setEditing,
    loading,
    saving,
    editing,
    GetInventories,
    allInventories,
    error,
    form,
    setForm,
    updateForm,
    handleSubmit,
    handleDelete,
    resetForm,
  } = useInventory();

  const handleCancelForm = () => {
    setMode("list");
    setEditing(null);
  };

  const handleCreateClick = () => {
    resetForm();
    setEditing(null);
    setMode("create");
  };

  const handleEdit = (item: InventoryItem) => {
    setEditing(item);
    setMode("create");
  };

  useEffect(() => {
    void GetInventories(true);
  }, []);

  return (
    <div className="space-y-6">
      {error && (
        <p className="text-xs font-medium text-rose-500 bg-rose-50 border border-rose-100 rounded-xl px-3 py-2 inline-flex">
          {error}
        </p>
      )}
      {mode === "list" ? (
        <InventoryList
          onCreate={handleCreateClick}
          loading={loading}
          allInventories={allInventories}
          onEdit={handleEdit}
          onDelete={handleDelete}
        />
      ) : (
        <CraeteInventory
          onCancel={handleCancelForm}
          editing={editing}
          form={form}
          setForm={setForm}
          updateForm={updateForm}
          handleSubmit={handleSubmit}
        />
      )}
    </div>
  );
}

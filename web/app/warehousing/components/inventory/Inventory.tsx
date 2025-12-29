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
  } = useInventory();

  const handleCancelForm = () => {
    setMode("list");
    setEditing(null);
  };

  const handleCreateClick = () => {
    setEditing(null);
    setMode("create");
  };

  const handleEdit = (item: InventoryItem) => {
    setEditing(item);
    setMode("create");
  };

  useEffect(() => {
    void GetInventories();
  }, []);

  return (
    <div className="space-y-6">
      {mode === "list" ? (
        <InventoryList
          onCreate={handleCreateClick}
          loading={loading || saving}
          allInventories={allInventories}
          onEdit={handleEdit}
        />
      ) : (
        <CraeteInventory onCancel={handleCancelForm} editing={editing} />
      )}
    </div>
  );
}




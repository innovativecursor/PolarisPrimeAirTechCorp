import CreateSupplier from "./CreateSupplier";
import { useSupplier } from "./hooks/useSupplier";
import SupplierList from "./SupplierList";

export default function AddSupplier() {
  const {
    mode,
    setMode,
    editing,
    setEditing,
    loading,
    setLoading,
    saving,
    setSaving,
  } = useSupplier();

  const handleCancelForm = () => {
    setMode("list");
    setEditing(null);
  };

  const handleCreateClick = () => {
    setEditing(null);
    setMode("create");
  };

  return (
    <div className="space-y-6">
      {mode === "list" ? (
        <SupplierList onCreate={handleCreateClick}  loading={loading || saving} />
      ) : (
        <CreateSupplier onCancel={handleCancelForm} />
      )}
    </div>
  );
}

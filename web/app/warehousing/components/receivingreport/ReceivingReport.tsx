import ReceivingListCard from "./ReceivingListCard";
import CreateReceivingCard from "./CreateReceivingCard";
import useReceivingReport from "./hooks/useReceivingReport";

export default function ReceivingReport() {
  const { mode, setMode, setEditing, loading, saving } = useReceivingReport();

  const handleCreateClick = () => {
    setEditing(null);
    setMode("create");
  };

  const handleCancelForm = () => {
    setMode("list");
    setEditing(null);
  };

  return (
    <div className="space-y-6">
      {mode === "list" ? (
        <ReceivingListCard
          loading={loading || saving}
          onCreate={handleCreateClick}
        />
      ) : (
        <CreateReceivingCard onCancel={handleCancelForm} />
      )}
    </div>
  );
}

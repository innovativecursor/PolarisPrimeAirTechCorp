import CreateDeliveryReceipt from "./CreateDeliveryReceipt";
import DeliveryReceiptList from "./DeliveryReceiptList";
import { useDeliveryReceipt } from "./hooks/useDeliveryREceipt";

export default function DeliveryReceipt() {
  const { mode, setMode, setEditing, loading, saving } = useDeliveryReceipt();

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
        <DeliveryReceiptList
          onCreate={handleCreateClick}
          loading={loading || saving}
        />
      ) : (
        <CreateDeliveryReceipt onCancel={handleCancelForm} />
      )}
    </div>
  );
}

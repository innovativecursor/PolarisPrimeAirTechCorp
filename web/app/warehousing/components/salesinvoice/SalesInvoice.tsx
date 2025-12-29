import CreateSalesInvioce from "./CreateSalesInvoice";
import { useSalesInvoice } from "./hooks/useSalesInvoice";

import SalesInvioceList from "./SalesInvoiceList";

export default function SalesInvioce() {
  const {
    mode,
    setMode,
    editing,
    setEditing,
    loading,
    setLoading,
    saving,
    setSaving,
  } = useSalesInvoice();

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
        <SalesInvioceList
          onCreate={handleCreateClick}
          loading={loading || saving}
        />
      ) : (
        <CreateSalesInvioce onCancel={handleCancelForm} />
      )}
    </div>
  );
}

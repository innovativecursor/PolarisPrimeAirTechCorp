import { useCallback, useEffect } from "react";

import AccountSalesList from "./AccountSalesLIst";
import CreateAccountSales from "./CreateAccountSales";
import { useAccountSales } from "./hooks/useAccountSales";

export default function AccountSales() {
  const { mode, setMode, editing, setEditing, loading, saving } =
    useAccountSales();

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
        <AccountSalesList
          loading={loading || saving}
          onCreate={handleCreateClick}
        />
      ) : (
        <CreateAccountSales saving={saving} onCancel={handleCancelForm} />
      )}
    </div>
  );
}

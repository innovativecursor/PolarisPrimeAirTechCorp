import { useCallback, useEffect } from "react";

import { useAccountDr } from "./hooks/useAccountDr";
import CreateAccountDr from "./CreateAccountDr";

import AccountList from "./AccountList";

export default function AccountDr() {
  const { mode, setMode, editing, setEditing, loading, saving } =
    useAccountDr();

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
        <AccountList
          loading={loading || saving}
          onCreate={handleCreateClick}
        />
      ) : (
        <CreateAccountDr saving={saving} onCancel={handleCancelForm} />
      )}
    </div>
  );
}

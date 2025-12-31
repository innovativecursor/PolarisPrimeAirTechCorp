import { useState } from "react";

export function useAccountSales() {
  const [mode, setMode] = useState<"list" | "create">("list");
  const [editing, setEditing] = useState<string | null>(null);
  const [loading, setLoading] = useState(false);
  const [saving, setSaving] = useState(false);
  const [error, setError] = useState<string | null>(null);

  return {
    mode,
    setMode,
    editing,
    setEditing,
    loading,
    setLoading,
    saving,
    setSaving,
  };
}

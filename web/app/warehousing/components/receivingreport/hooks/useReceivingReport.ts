import { useState } from "react";
import { ReceivingReportRow } from "../type";

export default function useReceivingReport() {
  const [mode, setMode] = useState<string>("list");
  const [editing, setEditing] = useState<ReceivingReportRow | null>(null);
  const [loading, setLoading] = useState(false);
  const [saving, setSaving] = useState(false);

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

"use client";

import endpoints from "@/app/lib/endpoints";
import { fetchDataPost } from "@/app/lib/fetchData";
import { useState } from "react";

export type ReportForm = {
  reportType: string;
  startDate: string;
  endDate: string;
  exportType: "pdf" | "excel" | "csv";
};

export default function useGenerateReport() {
  const [form, setForm] = useState<ReportForm>({
    reportType: "",
    startDate: "",
    endDate: "",
    exportType: "pdf",
  });

  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const setField = <K extends keyof ReportForm>(
    key: K,
    value: ReportForm[K]
  ) => {
    setForm((prev) => ({
      ...prev,
      [key]: value,
    }));
  };

  const submitReport = async () => {
    try {
      setLoading(true);
      setError(null);

      if (!form.reportType) throw new Error("Please select report type");
      if (!form.startDate || !form.endDate)
        throw new Error("Please select date range");
      if (form.startDate > form.endDate)
        throw new Error("Start date cannot be after end date");

      const res = await fetchDataPost(endpoints.GenerateReport.create, form, {
        responseType: "blob",
      });

      const contentType =
        res.headers["content-type"] || "application/octet-stream";

      const blob = new Blob([res.data], { type: contentType });
      const url = window.URL.createObjectURL(blob);

      const a = document.createElement("a");

      const disposition = res.headers["content-disposition"];
      let fileName = `report.${form.exportType}`;

      if (disposition) {
        const match = disposition.match(/filename="?(.+)"?/);
        if (match?.[1]) fileName = match[1];
      }

      a.href = url;
      a.download = fileName;
      document.body.appendChild(a);
      a.click();
      a.remove();

      window.URL.revokeObjectURL(url);
    } catch (e: any) {
      setError(e.message || "Failed to generate report");
    } finally {
      setLoading(false);
    }
  };

  return {
    form,
    loading,
    error,
    setField,
    submitReport,
  };
}

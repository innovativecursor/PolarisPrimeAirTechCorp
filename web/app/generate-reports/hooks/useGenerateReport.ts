// /* eslint-disable @typescript-eslint/no-explicit-any */

// import endpoints from "@/app/lib/endpoints";
// import { fetchDataPost } from "@/app/lib/fetchData";
// import { useState } from "react";
// // import { fetchDataPost } from "@/lib/fetchData";
// // import endpoints from "@/lib/endpoints";

// type ReportForm = {
//   reportType: string;
//   startDate: string;
//   endDate: string;
//   exportType: "pdf" | "excel" | "csv";
// };

// export function useGenerateReport() {
//   const [form, setForm] = useState<ReportForm>({
//     reportType: "",
//     startDate: "",
//     endDate: "",
//     exportType: "pdf",
//   });

//   const [loading, setLoading] = useState(false);
//   const [error, setError] = useState<string | null>(null);

//   // single field updater (same pattern as Supplier PO)
//   const setField = (key: keyof ReportForm, value: string) => {
//     setForm((prev) => ({
//       ...prev,
//       [key]: value,
//     }));
//   };

//   const submitReport = async () => {
//     try {
//       setLoading(true);
//       setError(null);

//       // ---- validation ----
//       if (!form.reportType) {
//         throw new Error("Please select report type");
//       }

//       if (!form.startDate || !form.endDate) {
//         throw new Error("Please select date range");
//       }

//       if (form.startDate > form.endDate) {
//         throw new Error("Start date cannot be after end date");
//       }

//       // ---- API PAYLOAD (exact match) ----
//       const payload = {
//         reportType: form.reportType.toLowerCase(),
//         startDate: form.startDate,
//         endDate: form.endDate,
//         exportType: form.exportType,
//       };

//       await fetchDataPost(
//         endpoints.GenerateReport.create,
//         payload
//       );

//     } catch (e: any) {
//       setError(e.message || "Failed to generate report");
//     } finally {
//       setLoading(false);
//     }
//   };

//   return {
//     form,
//     loading,
//     error,
//     setField,
//     submitReport,
//   };
// }







"use client";

import endpoints from "@/app/lib/endpoints";
import { fetchDataPost } from "@/app/lib/fetchData";
import { useState } from "react";
// import { fetchDataPost } from "@/lib/fetchData";
// import endpoints from "@/lib/endpoints";

export type ReportForm = {
  reportType: string;
  startDate: string;
  endDate: string;
  exportType: "pdf" | "excel" | "csv";
};

export function useGenerateReport() {
  const [form, setForm] = useState<ReportForm>({
    reportType: "",
    startDate: "",
    endDate: "",
    exportType: "pdf",
  });

  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  // ✅ GENERIC FIELD UPDATER (important fix)
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

      // validation
      if (!form.reportType) {
        throw new Error("Please select report type");
      }
      if (!form.startDate || !form.endDate) {
        throw new Error("Please select date range");
      }
      if (form.startDate > form.endDate) {
        throw new Error("Start date cannot be after end date");
      }

      // exact API body
      await fetchDataPost(
        endpoints.GenerateReport.create,
        {
          reportType: form.reportType,
          startDate: form.startDate,
          endDate: form.endDate,
          exportType: form.exportType,
        }
      );
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

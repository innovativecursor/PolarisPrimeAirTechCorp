import { useCallback, useState } from "react";
import { fetchDataGet } from "@/app/lib/fetchData";
import endpoints from "@/app/lib/endpoints";
import { DashboardResponse } from "../type";


export function useDashboard() {
  const [dashboard, setDashboard] = useState<DashboardResponse | null>(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const getDashboard = useCallback(async () => {
    try {
      setLoading(true);

      setError(null);

      const res = await fetchDataGet<DashboardResponse>(
        endpoints.dashboard.getAll,
      );

      setDashboard(res);
    } catch (err: any) {
      setError(err.message || "Failed to fetch dashboard data");
      setDashboard(null);
    } finally {
      setLoading(false);
    }
  }, []);

  return {
    dashboard,
    loading,
    error,
    getDashboard,
  };
}

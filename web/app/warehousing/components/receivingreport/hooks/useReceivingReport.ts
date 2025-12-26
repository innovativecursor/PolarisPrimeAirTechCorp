import { useCallback, useState } from "react";
import {
  CreateRRPayload,
  CreateRRRes,
  DeliveryReceiptRow,
  GetReceivingReportRes,
  ReceivingReportItem,
  RRInvoicesResponse,
  RRInvoicesRow,
  SalesOrderResponse,
  SalesOrderRow,
  SupplierDRResponse,
} from "../type";
import { fetchDataGet, fetchDataPost } from "@/app/lib/fetchData";
import endpoints from "@/app/lib/endpoints";

export default function useReceivingReport() {
  const [mode, setMode] = useState<string>("list");
  const [editing, setEditing] = useState<ReceivingReportItem | null>(null);
  const [loading, setLoading] = useState(false);
  const [saving, setSaving] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [deliveryReceipts, setDeliveryReceipts] = useState<
    DeliveryReceiptRow[]
  >([]);
  const [invoices, setInvoices] = useState<RRInvoicesRow[]>([]);
  const [salesOrder, setSalesOrder] = useState<SalesOrderRow[]>([]);
  const [createResponse, setCreateResponse] = useState<CreateRRRes | null>(
    null
  );

  const [receivingReports, setReceivingReports] = useState<
    ReceivingReportItem[]
  >([]);

  const loadDeliveryReceipts = useCallback(async () => {
    try {
      setLoading(true);
      setError(null);
      const res = await fetchDataGet<SupplierDRResponse>(
        endpoints.supplierDR.getAll
      );

      setDeliveryReceipts(res?.data || res?.supplierDR || []);
    } finally {
      setLoading(false);
    }
  }, []);

  const loadSalesOrders = useCallback(async () => {
    try {
      setLoading(true);
      setError(null);
      const res = await fetchDataGet<SalesOrderResponse>(
        endpoints.salesOrder.getAll
      );
      setSalesOrder(res?.salesOrders || []);
    } finally {
      setLoading(false);
    }
  }, []);

  const loadInvoices = useCallback(async () => {
    try {
      setLoading(true);
      setError(null);

      const res = await fetchDataGet<RRInvoicesResponse>(
        endpoints.supplierInvoice.getAll
      );
      setInvoices(res?.invoices || []);
    } finally {
      setLoading(false);
    }
  }, []);

  const createReceivingReport = useCallback(
    async (payload: CreateRRPayload): Promise<CreateRRRes> => {
      setSaving(true);
      setError(null);

      try {
        const res = await fetchDataPost<CreateRRRes>(
          endpoints.receivingReport.create,
          payload
        );
        setCreateResponse(res);
        return res;
      } finally {
        setSaving(false);
      }
    },
    []
  );

  const loadReceivingReports = useCallback(async () => {
    try {
      setLoading(true);
      setError(null);
      const res = await fetchDataGet<GetReceivingReportRes>(
        endpoints.receivingReport.getAll
      );
      setReceivingReports(res?.data || []);
    } finally {
      setLoading(false);
    }
  }, []);

  return {
    mode,
    setMode,
    editing,
    setEditing,
    loading,
    saving,
    setSaving,
    error,
    deliveryReceipts,
    loadDeliveryReceipts,
    loadSalesOrders,
    salesOrder,
    loadInvoices,
    invoices,
    createReceivingReport,
    receivingReports,
    loadReceivingReports,
  };
}

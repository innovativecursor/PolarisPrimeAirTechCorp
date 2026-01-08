import { useCallback, useState } from "react";
import {
  CreateRRPayload,
  CreateRRRes,
  ReceivingReportItem,
  supplierdeliveryR,
  supplierInvoice,
  supplierpo,
} from "../type";
import { fetchDataGet, fetchDataPost } from "@/app/lib/fetchData";
import endpoints from "@/app/lib/endpoints";

export default function useReceivingReport() {
  const [mode, setMode] = useState<string>("list");
  const [editing, setEditing] = useState<ReceivingReportItem | null>(null);
  const [loading, setLoading] = useState(false);
  const [saving, setSaving] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const [createResponse, setCreateResponse] = useState<CreateRRRes | null>(
    null
  );
  const [page, setPage] = useState(1);
  const [totalPages, setTotalPages] = useState(1);

  const [supplierInvoice, setSupplierInvoice] = useState<supplierInvoice[]>([]);
  const [supplierPo, setSupplierPo] = useState<supplierpo[]>([]);
  const [supplierDeliveryR, setSupplierDeliveryR] = useState<
    supplierdeliveryR[]
  >([]);

  const [receivingReports, setReceivingReports] = useState<
    ReceivingReportItem[]
  >([]);

  const loadSupplierInvoice = async () => {
    const res = await fetchDataGet<any>(endpoints.supplierinvoice.getAll);
    const list = res?.data || res || [];
    setSupplierInvoice(
      list.map((p: any) => ({
        id: p._id || p.id,
        name: p.invoice_no || p.name,
      }))
    );
  };

  const loadSupplierPO = async () => {
    const res = await fetchDataGet<any>(endpoints.supplierpo.getAll);
    const list = res?.data || res || [];
    setSupplierPo(
      list.map((p: any) => ({
        id: p.id || p._id,
        name: p.po_id || p.name,
      }))
    );
  };

  const loadSupplierDeliveryR = async () => {
    const res = await fetchDataGet<any>(endpoints.supplierdeliveryR.getAll);
    const list = res?.data || res || [];
    setSupplierDeliveryR(
      list.map((p: any) => ({
        id: p._id || p.id,
        name: p.supplier_dr_no || p.name,
      }))
    );
  };

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

  const loadReceivingReports = useCallback(
    async (pageNo = page) => {
      try {
        setLoading(true);
        setError(null);

        const res = await fetchDataGet<any>(
          endpoints.receivingReport.getAll(pageNo)
        );

        setReceivingReports(res?.data || []);

        const total = res?.total || 0;
        const limit = res?.limit || 10;

        setTotalPages(Math.ceil(total / limit));
        setPage(pageNo);
      } finally {
        setLoading(false);
      }
    },
    [page]
  );

  return {
    mode,
    setMode,
    editing,
    setEditing,
    loading,
    saving,
    setSaving,
    error,

    createReceivingReport,
    receivingReports,
    loadSupplierInvoice,
    loadSupplierDeliveryR,
    supplierInvoice,
    supplierDeliveryR,
    page,
    totalPages,
    loadReceivingReports,
    loadSupplierPO,
    supplierPo,
  };
}

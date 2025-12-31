import { useCallback, useEffect, useState } from "react";
import {
  DeliveryReceiptForm,
  DeliveryReceiptItem,
  SupplierDeliveryReceipt,
  SupplierDRListRes,
} from "../type";
import { toast } from "react-toastify";
import {
  fetchDataGet,
  fetchDataPost,
  fetchDataPut,
  fetchWithError,
} from "@/app/lib/fetchData";
import endpoints from "@/app/lib/endpoints";

export function useDeliveryReceipt() {
  const [mode, setMode] = useState<"list" | "create">("list");
  const [editing, setEditing] = useState<string | null>(null);
  const [loading, setLoading] = useState(false);
  const [saving, setSaving] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [allDrReceipts, setAllDrReceipts] = useState<SupplierDeliveryReceipt[]>(
    []
  );

  const [form, setForm] = useState<DeliveryReceiptForm>({
    supplier_id: "",
    project_id: "",
    supplier_dr_no: "",
    your_po_no: "",
    dispatch_date: "",
    ship_to: "",
    reference: "",
    date: "",
  });

  const [items, setItems] = useState<DeliveryReceiptItem[]>([]);
  const updateForm = (key: keyof DeliveryReceiptForm, value: any) => {
    setForm((p) => ({ ...p, [key]: value }));
  };

  const addItem = () => {
    setItems((p) => [
      ...p,
      {
        line_no: p.length + 1,
        model: "",
        description: "",
        plant: "",
        stor_loc: "",
        unit: "unit",
        ship_qty: 1,
        total_cbm: 0,
        total_kgs: 0,
        serial_nos: [],
      },
    ]);
  };

  const updateItem = (
    index: number,
    key: keyof DeliveryReceiptItem,
    value: any
  ) => {
    setItems((p) =>
      p.map((it, i) => (i === index ? { ...it, [key]: value } : it))
    );
  };

  const removeItem = (index: number) => {
    setItems((p) => p.filter((_, i) => i !== index));
  };

  const GetDrReceipts = useCallback(async () => {
    try {
      setLoading(true);
      setError(null);
      const res = await fetchDataGet<SupplierDRListRes>(
        endpoints.supplierDR.getAll
      );
      setAllDrReceipts(Array.isArray(res?.supplierDR) ? res?.supplierDR : []);
    } catch (err: any) {
      setError(err.message || "Failed to fetch inventories");
      setAllDrReceipts([]);
    } finally {
      setLoading(false);
    }
  }, []);

  const loadDrForEdit = useCallback(async (id: string) => {
    const res = await fetchDataGet<{ supplierDR: any }>(
      endpoints.supplierDR.getById(id)
    );

    const dr = res.supplierDR;

    setForm({
      supplier_id: dr.supplier_id,
      project_id: dr.project_id,
      supplier_dr_no: dr.supplier_dr_no,
      your_po_no: dr.your_po_no,
      dispatch_date: dr.dispatch_date?.startsWith("0001")
        ? ""
        : dr.dispatch_date?.split("T")[0],
      ship_to: dr.ship_to || "",
      reference: dr.reference || "",
      date: dr.date.split("T")[0],
    });

    setItems(
      Array.isArray(dr.items)
        ? dr.items.map((it: any) => ({
            line_no: it.line_no ?? 0,
            model: it.model ?? "",
            description: it.description ?? "",
            plant: it.plant ?? "",
            stor_loc: it.stor_loc ?? "",
            unit: it.unit ?? "PCS",
            ship_qty: it.ship_qty ?? 0,
            total_cbm: it.total_cbm ?? 0,
            total_kgs: it.total_kgs ?? 0,
            serial_nos: Array.isArray(it.serial_nos) ? it.serial_nos : [],
          }))
        : []
    );
  }, []);

  const mappedItems = items.map((it, index) => ({
    line_no: index + 1,
    model: it.model,
    description: it.description,
    plant: it.plant,
    stor_loc: it.stor_loc,
    unit: it.unit,
    ship_qty: it.ship_qty,
    total_cbm: it.total_cbm,
    total_kgs: it.total_kgs,
    serial_nos: it.serial_nos,
  }));

  const createDeliveryReceipt = useCallback(async () => {
    if (
      !form.supplier_id ||
      !form.project_id ||
      !form.supplier_dr_no ||
      !form.date
    ) {
      toast.error("Please fill required fields");
      return;
    }

    if (items.length === 0) {
      toast.error("Please add at least one item");
      return;
    }

    const payload = {
      id: editing || undefined,
      supplier_id: form.supplier_id,
      project_id: form.project_id,
      supplier_dr_no: form.supplier_dr_no,
      your_po_no: form.your_po_no,
      dispatch_date: form.dispatch_date,
      ship_to: form.ship_to,
      reference: form.reference,
      date: form.date,
      items: mappedItems,
    };

    if (editing) {
      await fetchDataPut(endpoints.supplierDR.edit, payload);
      toast.success("Supplier Delivery Receipt updated");
    } else {
      await fetchDataPost(endpoints.supplierDR.create, payload);
      toast.success("Supplier Delivery Receipt created");
    }

    setForm({
      supplier_id: "",
      project_id: "",
      supplier_dr_no: "",
      your_po_no: "",
      dispatch_date: "",
      ship_to: "",
      reference: "",
      date: "",
    });

    setItems([]);
    setEditing(null);
    setMode("list");
    GetDrReceipts();
  }, [editing, form, items]);

  const deleteDr = useCallback(
    async (id: string) => {
      try {
        setSaving(true);
        setError(null);

        await fetchWithError(endpoints.supplierDR.delete, {
          method: "DELETE",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify({
            id,
          }),
        });

        toast.success("Dr deleted successfully");
        await GetDrReceipts();
      } catch (err) {
        const error = err as Error;
        toast.error(error.message || "Failed to delete supplier");
      } finally {
        setSaving(false);
      }
    },
    [GetDrReceipts]
  );

  useEffect(() => {
    if (editing) {
      loadDrForEdit(editing);
    }
  }, [editing, loadDrForEdit]);

  return {
    mode,
    setMode,
    editing,
    setEditing,
    loading,
    setLoading,
    saving,
    setSaving,
    form,
    updateForm,
    items,
    addItem,
    updateItem,
    removeItem,
    createDeliveryReceipt,
    GetDrReceipts,
    allDrReceipts,
    deleteDr,
  };
}

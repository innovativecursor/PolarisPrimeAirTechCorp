import { useEffect, useState } from "react";

import {
  CreateRRPayload,
  CreateRRRes,
  ReceivingReportItem,
  supplierdeliveryR,
  supplierInvoice,
  supplierpo,
} from "./type";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { toast } from "react-toastify";
import { generateSku } from "@/app/utils/skuGenerator";
import {
  ProjectOption,
  SalesOrderRow,
} from "@/app/sales-orders/hooks/useSalesOrders";
import Required from "@/components/ui/Required";
import { Html5QrcodeScanner } from "html5-qrcode";

type CreateReceivingCardProps = {
  onCancel: () => void;
  supplierPo: supplierpo[];
  supplierDeliveryR: supplierdeliveryR[];
  supplierInvoice: supplierInvoice[];
  salesOrder: SalesOrderRow[];
  createReceivingReport: (payload: CreateRRPayload) => Promise<CreateRRRes>;
  saving: boolean;
  loadReceivingReports: (
    pageNo?: number,
    showSkeleton?: boolean
  ) => Promise<void>;
  page: number;
  editing?: ReceivingReportItem | null;
};

export default function CreateReceivingCard({
  onCancel,
  salesOrder,
  createReceivingReport,
  saving,
  loadReceivingReports,
  editing,
  supplierDeliveryR,
  supplierInvoice,
  supplierPo,
  page,
}: CreateReceivingCardProps) {
  const [openScanner, setOpenScanner] = useState(false);
  const [form, setForm] = useState<CreateRRPayload>({
    supplier_dr_id: "",
    supplier_invoice_id: "",
    purchase_order_id: "",
    sales_order_id: "",
    sku: "",
    barcode: "",
    aircon_model_number: "",
    aircon_name: "",
    type_of_aircon: "",
    hp: "",
    indoor_outdoor_unit: "",
    quantity: 0,
    price: 0,
  });

  const updateForm = (key: string, value: string) => {
    setForm((prev) => ({ ...prev, [key]: value }));
  };

  useEffect(() => {
    if (!editing) {
      const sku = generateSku("RR");
      setForm((p) => ({ ...p, sku }));
    }
  }, [editing]);

  useEffect(() => {
    if (!openScanner) return;

    let scanner: any;

    scanner = new Html5QrcodeScanner(
      "rr-barcode-reader",
      {
        fps: 8,
        qrbox: { width: 360, height: 220 },
        aspectRatio: 1,
        disableFlip: true,
      },
      false
    );

    scanner.render(
      (decodedText: string) => {
        setForm((p) => ({ ...p, barcode: decodedText }));
        toast.success("Barcode scanned");
        setOpenScanner(false);
        scanner.clear();
      },
      () => {}
    );

    return () => {
      scanner?.clear().catch(() => {});
    };
  }, [openScanner]);

  useEffect(() => {
    if (!editing) return;

    setForm({
      supplier_dr_id: editing.dr_object_id ?? "",
      supplier_invoice_id: editing.invoice_object_id ?? "",
      purchase_order_id: editing.po_object_id ?? "",
      sales_order_id: editing.sales_order_object_id ?? "",

      sku: editing.sku,
      barcode: editing.barcode ?? "",
      aircon_model_number: editing.aircon_model_number ?? "",
      aircon_name: editing.aircon_name ?? "",
      type_of_aircon: editing.type_of_aircon ?? "",
      hp: editing.hp ?? "",
      indoor_outdoor_unit: editing.indoor_outdoor_unit ?? "",
      quantity: editing.quantity ?? 0,
      price: editing.price ?? 0,
    });
  }, [editing]);

  const handleSave = async () => {
    if (
      !form.supplier_dr_id ||
      !form.purchase_order_id ||
      !form.sales_order_id ||
      !form.supplier_invoice_id
    ) {
      toast.error("Please select DR, PO, SO and Invoice");
      return;
    }
    if (!form.barcode) {
      toast.error("Please scan the barcode");
      return;
    }

    if (!form.price || Number(form.price) <= 0) {
      toast.error("Please enter a valid price");
      return;
    }

    const res = await createReceivingReport({
      ...(editing?.id && { id: editing.id }),
      ...form,
      quantity: Number(form.quantity),
      price: Number(form.price),
    });
    await loadReceivingReports(page, false);

    toast.success(res.message);
    onCancel();
  };

  const isEdit = Boolean(editing);

  return (
    <div className="space-y-8">
      {/*  HEADER */}
      <div className="flex items-start justify-between">
        <div>
          <p className="text-xs font-semibold tracking-[0.24em] uppercase text-slate-400 mb-2">
            Warehousing
          </p>
          <h2 className="text-lg md:text-xl font-semibold text-slate-900">
            {isEdit ? "Edit receiving report" : "Create receiving report"}
          </h2>
        </div>

        <button
          type="button"
          onClick={onCancel}
          className="text-xs  cursor-pointer font-medium text-slate-400 hover:text-slate-600"
        >
          Cancel
        </button>
      </div>

      <section className=" bg-white border border-slate-200  md:rounded-[32px] rounded-md md:px-8 px-4 py-8">
        <div className="grid gap-6 lg:grid-cols-3">
          <div className="space-y-2">
            <label className="text-sm font-medium text-slate-600">
              Supplier delivery receipt <Required />
            </label>

            <Select
              value={form.supplier_dr_id}
              onValueChange={(val) =>
                setForm((p) => ({ ...p, supplier_dr_id: val }))
              }
            >
              <SelectTrigger className="w-full rounded-2xl border border-slate-200 bg-slate-50 px-4 py-2.5 text-sm text-slate-900 focus:outline-none focus:ring-2 focus:ring-slate-900 focus:bg-white">
                <SelectValue placeholder="Choose a delivery receipt" />
              </SelectTrigger>
              <SelectContent>
                {supplierDeliveryR.map((sdr) => (
                  <SelectItem key={sdr?.id} value={sdr?.id}>
                    {sdr?.name}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>

          <div className="space-y-2">
            <label className="text-sm font-medium text-slate-600">
              Supplier purchase order <Required />
            </label>

            <Select
              value={form.purchase_order_id}
              onValueChange={(val) =>
                setForm((p) => ({ ...p, purchase_order_id: val }))
              }
            >
              <SelectTrigger className="w-full rounded-2xl border border-slate-200 bg-slate-50 px-4 py-2.5 text-sm text-slate-900 focus:outline-none focus:ring-2 focus:ring-slate-900 focus:bg-white">
                <SelectValue placeholder="Choose a purchase order" />
              </SelectTrigger>
              <SelectContent>
                {supplierPo.map((po) => (
                  <SelectItem key={po?.id} value={po?.id}>
                    {po?.name}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>

          <div className="space-y-2">
            <label className="text-sm font-medium text-slate-600">
              Select sales order <Required />
            </label>

            <Select
              value={form.sales_order_id}
              onValueChange={(val) =>
                setForm((p) => ({ ...p, sales_order_id: val }))
              }
            >
              <SelectTrigger className="w-full rounded-2xl border border-slate-200 bg-slate-50 px-4 py-2.5 text-sm text-slate-900 focus:outline-none focus:ring-2 focus:ring-slate-900 focus:bg-white">
                <SelectValue placeholder="Choose a sales order" />
              </SelectTrigger>
              <SelectContent>
                {salesOrder.map((so) => (
                  <SelectItem key={so?.id} value={so?.id}>
                    {so?.salesOrderId}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>

          <div className="space-y-2 md:col-span-1">
            <label className="text-sm font-medium text-slate-600">
              Supplier invoice number <Required />
            </label>

            <Select
              value={form.supplier_invoice_id}
              onValueChange={(val) =>
                setForm((p) => ({ ...p, supplier_invoice_id: val }))
              }
            >
              <SelectTrigger className="w-full rounded-2xl border border-slate-200 bg-slate-50 px-4 py-2.5 text-sm text-slate-900 focus:outline-none focus:ring-2 focus:ring-slate-900 focus:bg-white">
                <SelectValue placeholder="Choose supplier invoice" />
              </SelectTrigger>
              <SelectContent>
                {supplierInvoice.map((si) => (
                  <SelectItem key={si?.id} value={si?.id}>
                    {si?.name}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>
        </div>
      </section>

      <section className=" bg-white border border-slate-300  md:rounded-[32px] rounded-md md:px-8 px-4 py-8 space-y-6">
        <div>
          <h3 className="text-lg font-semibold text-slate-900 mb-1">
            Add item
          </h3>
          <p className="text-sm text-slate-500">
            Use camera or scanner to capture SKU barcode.
          </p>

          {/* GENERATED BARCODE */}
        </div>

        <div className="space-y-3">
          <label className="text-sm font-medium text-slate-600">
            Barcode number <Required />
          </label>
          <input
            value={form.barcode}
            // onChange={(e) => updateForm("barcode", e.target.value)}
            readOnly
            placeholder="Scan barcode"
            className="w-full rounded-2xl border bg-slate-100 px-4 py-3 text-sm"
          />
          <p className="text-xs text-slate-500 ">
            Tip: Reduce phone brightness to ~50%, don’t zoom, tilt phone
            slightly
          </p>

          <button
            type="button"
            onClick={() => setOpenScanner(true)}
            className="text-sm text-blue-600 underline mt-2"
          >
            Scan using laptop camera
          </button>

          {openScanner && (
            <div className="mt-4 border rounded-xl p-4">
              <div id="rr-barcode-reader" />
            </div>
          )}
        </div>

        <div className="grid gap-6 lg:grid-cols-3 mt-10">
          <div className="space-y-2">
            <label className="text-sm font-medium text-slate-600">SKU</label>
            <input
              value={form.sku}
              readOnly
              placeholder="Eg. SKU-001-AC"
              className="w-full rounded-2xl border border-slate-300 bg-slate-100 px-4 py-3 text-sm"
            />
          </div>

          <div className="space-y-2">
            <label className="text-sm font-medium text-slate-600">
              Aircon model number
            </label>
            <input
              value={form.aircon_model_number}
              onChange={(e) =>
                updateForm("aircon_model_number", e.target.value)
              }
              placeholder="Eg. MX-1200"
              className="w-full rounded-2xl border border-slate-300 bg-slate-100 px-4 py-3 text-sm"
            />
          </div>

          <div className="space-y-2">
            <label className="text-sm font-medium text-slate-600">
              Aircon name
            </label>
            <input
              value={form.aircon_name}
              onChange={(e) => updateForm("aircon_name", e.target.value)}
              placeholder="Eg. 1.5HP Window aircon"
              className="w-full rounded-2xl border border-slate-300 bg-slate-100 px-4 py-3 text-sm"
            />
          </div>

          <div className="space-y-2">
            <label className="text-sm font-medium text-slate-600">
              HP (Horsepower)
            </label>
            <input
              value={form.hp}
              onChange={(e) => updateForm("hp", e.target.value)}
              placeholder="1.5"
              className="w-full rounded-2xl border border-slate-300 bg-slate-100 px-4 py-3 text-sm"
            />
          </div>

          <div className="space-y-2">
            <label className="text-sm font-medium text-slate-600">
              Price <Required />
            </label>
            <input
              type="number"
              min="1"
              value={form.price}
              onChange={(e) => updateForm("price", e.target.value)}
              placeholder="Price"
              className="w-full rounded-2xl border border-slate-300 bg-slate-100 px-4 py-3 text-sm"
            />
          </div>

          <div className="space-y-2">
            <label className="text-sm font-medium text-slate-600">
              quantity <Required />
            </label>
            <input
              type="number"
              value={form.quantity}
              required
              onChange={(e) => updateForm("quantity", e.target.value)}
              placeholder="quantity"
              className="w-full rounded-2xl border border-slate-300 bg-slate-100 px-4 py-3 text-sm"
            />
          </div>
          <div className="space-y-2">
            <label className="text-sm font-medium text-slate-600">
              Type of aircon
            </label>
            <select
              value={form.type_of_aircon}
              onChange={(e) => updateForm("type_of_aircon", e.target.value)}
              className="w-full rounded-2xl border border-slate-300 bg-slate-100 px-4 py-3 text-sm"
            >
              <option value="" hidden>
                Select type
              </option>
              <option>Window</option>
              <option>Split</option>
              <option>Cassette</option>
              <option>VRF</option>
            </select>
          </div>

          <div className="space-y-2">
            <label className="text-sm font-medium text-slate-600">
              Indoor / outdoor unit
            </label>
            <select
              value={form.indoor_outdoor_unit}
              onChange={(e) =>
                updateForm("indoor_outdoor_unit", e.target.value)
              }
              className="w-full rounded-2xl border border-slate-300 bg-slate-100 px-4 py-3 text-sm"
            >
              <option hidden value="">
                Select unit type
              </option>
              <option>Indoor</option>
              <option>Outdoor</option>
            </select>
          </div>
        </div>
      </section>

      <div className="flex items-center justify-end gap-4 pt-4">
        <button
          type="button"
          onClick={onCancel}
          className="rounded-full  cursor-pointer px-6 py-2.5 text-sm font-medium text-slate-500 hover:text-slate-700"
        >
          Cancel
        </button>

        <button
          type="button"
          disabled={saving}
          onClick={handleSave}
          className={`rounded-full  cursor-pointer px-6 py-2.5 text-sm font-semibold text-white shadow 
    ${
      saving
        ? "bg-slate-400 cursor-not-allowed"
        : "bg-[#1f285c] hover:bg-[#171e48]"
    }`}
        >
          {saving ? "Saving..." : "Save receiving report"}
        </button>
      </div>
    </div>
  );
}

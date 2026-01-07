import { useEffect, useRef, useState } from "react";
import JsBarcode from "jsbarcode";
import { SupplierPORow } from "@/app/purchase-orders/components/types";
import {
  CreateRRPayload,
  CreateRRRes,
  DeliveryReceiptRow,
  ReceivingReportItem,
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
import { ProjectOption, SalesOrderRow } from "@/app/sales-orders/hooks/useSalesOrders";

type CreateReceivingCardProps = {
  onCancel: () => void;
  deliveryReceipts: DeliveryReceiptRow[];
  projectsName: ProjectOption[];
  salesOrder: SalesOrderRow[];
  invoices: { id: string; invoice_no: string }[];
  createReceivingReport: (payload: CreateRRPayload) => Promise<CreateRRRes>;
  saving: boolean;
  loadReceivingReports: () => Promise<void>;
  editing?: ReceivingReportItem | null;
};

export default function CreateReceivingCard({
  onCancel,
  deliveryReceipts,
  projectsName,
  salesOrder,
  invoices,
  createReceivingReport,
  saving,
  loadReceivingReports,
  editing,
}: CreateReceivingCardProps) {
  const [openScanner, setOpenScanner] = useState(false);
  const [generatedBarcode, setGeneratedBarcode] = useState("");
  const barcodeRef = useRef<SVGSVGElement | null>(null);
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
    if (editing) return;

    const code = "RR-" + Math.floor(100000 + Math.random() * 900000);
    setGeneratedBarcode(code);

    setForm((p) => ({ ...p, barcode: "" }));
  }, [editing]);

  useEffect(() => {
    if (!barcodeRef.current || !generatedBarcode) return;

    JsBarcode(barcodeRef.current, generatedBarcode, {
      format: "CODE128",
      width: 2,
      height: 60,
      displayValue: false,
    });
  }, [generatedBarcode]);

  useEffect(() => {
    if (!openScanner) return;

    let scanner: any;

    (async () => {
      const { Html5QrcodeScanner } = await import("html5-qrcode");

      scanner = new Html5QrcodeScanner(
        "rr-barcode-reader",
        {
          fps: 10,
          qrbox: 250,
        },
        false
      );

      scanner.render(
        (decodedText: string) => {
          const scanned = decodedText.trim().toUpperCase();
          const generated = generatedBarcode.trim().toUpperCase();

          if (scanned !== generated) {
            toast.error("Scanned barcode does not match generated barcode");
            return;
          }

          setForm((p) => ({ ...p, barcode: decodedText }));
          toast.success("Barcode verified successfully");

          setOpenScanner(false);
          scanner.clear();
        },
        () => {}
      );
    })();

    return () => {
      if (scanner) {
        scanner.clear().catch(() => {});
      }
    };
  }, [openScanner, generatedBarcode]);

  useEffect(() => {
    if (!editing) return;

    setForm({
      supplier_dr_id: editing.supplier_dr_id,
      supplier_invoice_id: editing.supplier_invoice_id,
      purchase_order_id: editing.purchase_order_id,
      sales_order_id: editing.sales_order_id,
      sku: editing.sku,
      barcode: editing.barcode ?? "",
      aircon_model_number: editing.aircon_model_number,
      aircon_name: editing.aircon_name,
      type_of_aircon: editing.type_of_aircon,
      hp: editing.hp,
      indoor_outdoor_unit: editing.indoor_outdoor_unit,
      quantity: editing.quantity,
      price: editing.price,
    });

    setGeneratedBarcode(editing.barcode ?? "");
  }, [editing]);

  const validateReceivingBarcode = () => {
    if (!form.barcode) {
      toast.error("Please scan the barcode");
      return false;
    }

    const scanned = form.barcode.trim().toUpperCase();
    const generated = generatedBarcode.trim().toUpperCase();

    if (scanned !== generated) {
      toast.error("Scanned barcode does not match generated barcode");
      return false;
    }

    return true;
  };

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
    if (!validateReceivingBarcode()) return;
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
    await loadReceivingReports();
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

      <section className="rounded-[24px] bg-white border border-slate-200 px-8 py-8">
        <div className="grid gap-6 lg:grid-cols-3">
          <div className="space-y-2">
            <label className="text-sm font-medium text-slate-600">
              Supplier delivery receipt
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
                {deliveryReceipts.map((dr) => (
                  <SelectItem key={dr?.id} value={dr?.id}>
                    {dr?.supplier_dr_no}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>

          <div className="space-y-2">
            <label className="text-sm font-medium text-slate-600">
              Supplier purchase order
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
                {projectsName.map((po) => (
                  <SelectItem key={po?.id} value={po?.id}>
                    {po?.name}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>

          <div className="space-y-2">
            <label className="text-sm font-medium text-slate-600">
              Select sales order
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
              Supplier invoice number
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
                {invoices.map((inv) => (
                  <SelectItem key={inv?.id} value={inv?.id}>
                    {inv?.invoice_no}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>
        </div>
      </section>

      <section className="rounded-[24px] bg-white border border-slate-300 px-8 py-8 space-y-6">
        <div>
          <h3 className="text-lg font-semibold text-slate-900 mb-1">
            Add item
          </h3>
          <p className="text-sm text-slate-500">
            Use camera or scanner to capture SKU barcode.
          </p>

          {/* GENERATED BARCODE */}

          <div className="mt-6 inline-flex rounded-2xl border border-slate-300 bg-white p-6">
            <svg ref={barcodeRef} />
          </div>
        </div>

        <div className="space-y-3">
          <label className="text-sm font-medium text-slate-600">
            Barcode number
          </label>
          <input
            value={form.barcode}
            onChange={(e) => updateForm("barcode", e.target.value)}
            placeholder="Scan barcode"
            className="w-full rounded-2xl border bg-slate-100 px-4 py-3 text-sm"
          />

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
            <label className="text-sm font-medium text-slate-600">Price</label>
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
              quantity
            </label>
            <input
              value={form.quantity}
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

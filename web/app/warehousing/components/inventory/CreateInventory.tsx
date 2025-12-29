import endpoints from "@/app/lib/endpoints";
import { fetchDataPost, fetchDataPut } from "@/app/lib/fetchData";

import JsBarcode from "jsbarcode";
import { useEffect, useRef, useState } from "react";
import { toast } from "react-toastify";
import { InventoryItem } from "./type";

type CraeteInventoryProps = {
  onCancel: () => void;
  editing?: InventoryItem | null;
};

export default function CraeteInventory({
  onCancel,
  editing,
}: CraeteInventoryProps) {
  const [openScanner, setOpenScanner] = useState(false);
  const usedSkusRef = useRef<Set<string>>(new Set());
  const [generatedBarcode, setGeneratedBarcode] = useState("");
  const barcodeRef = useRef<SVGSVGElement | null>(null);
  const [form, setForm] = useState({
    sku: "",
    barcode: "",
    aircon_model_number: "",
    aircon_name: "",
    hp: "",
    type_of_aircon: "",
    indoor_outdoor_unit: "",
    quantity: 0,
    price: 0,
  });

  const generateUniqueSku = () => {
    let sku = "";

    do {
      sku = Math.floor(1000 + Math.random() * 9000).toString();
    } while (usedSkusRef.current.has(sku));

    usedSkusRef.current.add(sku);
    return sku;
  };

  const updateForm = (key: string, value: any) => {
    setForm((p) => ({ ...p, [key]: value }));
  };

  useEffect(() => {
    if (editing?.barcode) {
      setGeneratedBarcode(editing.barcode);
    } else {
      const code = "AC-" + Math.floor(100000 + Math.random() * 900000);
      setGeneratedBarcode(code);
    }
  }, [editing]);

  /* ---------- Draw barcode ---------- */
  useEffect(() => {
    if (!barcodeRef.current || !generatedBarcode) return;

    JsBarcode(barcodeRef.current, generatedBarcode, {
      format: "CODE128",
      width: 2,
      height: 60,
      displayValue: false,
    });
  }, [generatedBarcode]);

  /* ---------- Laptop camera scanner ---------- */
  useEffect(() => {
    if (!openScanner) return;

    let scanner: any;

    (async () => {
      const { Html5QrcodeScanner } = await import("html5-qrcode");

      scanner = new Html5QrcodeScanner(
        "barcode-reader",
        { fps: 10, qrbox: 250 },
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
      if (scanner) scanner.clear().catch(() => {});
    };
  }, [openScanner]);
  useEffect(() => {
    if (!editing) {
      const newSku = generateUniqueSku();
      setForm((p) => ({ ...p, sku: newSku }));
    }
  }, [editing]);

  useEffect(() => {
    if (!editing) return;

    setForm({
      sku: editing.sku,
      barcode: editing.barcode || "",
      aircon_model_number: editing.aircon_model_number,
      aircon_name: editing.aircon_name,
      hp: editing.hp,
      type_of_aircon: editing.type_of_aircon?.toLowerCase() || "",
      indoor_outdoor_unit: editing.indoor_outdoor_unit?.toLowerCase() || "",
      quantity: editing.quantity,
      price: editing.price,
    });
  }, [editing]);

  const validateForm = () => {
    const scanned = form.barcode.trim().toUpperCase();
    const generated = generatedBarcode.trim().toUpperCase();
    if (!scanned) return "Please scan the barcode";
    if (!editing && scanned !== generated) {
      return "Scanned barcode does not match generated barcode";
    }
    if (!form.sku.trim()) return "SKU is required";
    if (!form.aircon_model_number.trim()) return "Model number is required";
    if (!form.aircon_name.trim()) return "Aircon name is required";
    if (!form.hp.trim()) return "HP is required";
    if (!form.type_of_aircon) return "Type of aircon is required";
    if (!form.indoor_outdoor_unit) return "Indoor / Outdoor unit is required";

    if (form.quantity <= 0) return "Quantity must be greater than 0";

    if (form.price <= 0) return "Price must be greater than 0";

    return null;
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    const error = validateForm();
    if (error) {
      toast.error(error);
      return;
    }

    try {
      if (editing?.id) {
        await fetchDataPut(endpoints.inventory.update(editing.id), form);
        toast.success("Inventory updated successfully");
      } else {
        await fetchDataPost(endpoints.inventory.add, form);
        toast.success("Inventory added successfully");
      }

      onCancel();
    } catch (err: any) {
      toast.error(err.message || "Something went wrong");
    }
  };

  return (
    <>
      <div className="flex items-start justify-between mb-8">
        <div>
          <p className="text-xs font-semibold tracking-[0.24em] uppercase text-slate-400 mb-2">
            Warehousing
          </p>
          <h2 className="text-lg md:text-xl font-semibold text-slate-900">
            {editing ? "Edit inventory" : "Add inventory"}
          </h2>
        </div>

        <button
          type="button"
          onClick={onCancel}
          className="text-xs font-medium text-slate-400 hover:text-slate-600"
        >
          Cancel
        </button>
      </div>

      <form className="space-y-8" onSubmit={handleSubmit}>
        <div className="space-y-8">
          {/* GENERATED BARCODE */}
          <div>
            <h3 className="font-semibold mb-2">Scan barcode</h3>

            <div className="inline-flex rounded-xl border p-4 bg-white">
              <svg ref={barcodeRef} />
            </div>
          </div>

          <div>
            <label className="text-sm font-medium">Barcode number</label>

            <input
              value={form.barcode}
              onChange={(e) => updateForm("barcode", e.target.value)}
              placeholder="Scan or type barcode"
              className="w-full mt-1 rounded-xl border px-4 py-3 bg-slate-100"
            />

            <button
              type="button"
              onClick={() => setOpenScanner(true)}
              className="text-sm text-blue-600 underline mt-2"
            >
              Scan using laptop camera
            </button>
          </div>

          {/* CAMERA VIEW */}
          {openScanner && (
            <div className="border rounded-xl p-4">
              <div id="barcode-reader" />
            </div>
          )}
        </div>

        <div className="grid gap-6 lg:grid-cols-3">
          <div className="space-y-1.5">
            <label className="block text-sm font-medium text-slate-600">
              SKU
            </label>
            <input
              value={form.sku}
              onChange={(e) => updateForm("sku", e.target.value)}
              readOnly
              type="text"
              className="block w-full rounded-2xl border border-slate-200 bg-slate-50 px-4 py-2.5 text-sm text-slate-900 focus:outline-none focus:ring-2 focus:ring-slate-900 focus:bg-white"
              placeholder="Sku"
            />
          </div>
          <div className="space-y-1.5">
            <label className="block text-sm font-medium text-slate-600">
              Aircon model number
            </label>
            <input
              value={form.aircon_model_number}
              onChange={(e) =>
                updateForm("aircon_model_number", e.target.value)
              }
              type="text"
              className="block w-full rounded-2xl border border-slate-200 bg-slate-50 px-4 py-2.5 text-sm text-slate-900 focus:outline-none focus:ring-2 focus:ring-slate-900 focus:bg-white"
              placeholder="Eg. MX-1200"
            />
          </div>
          <div className="space-y-1.5">
            <label className="block text-sm font-medium text-slate-600">
              Aircon name
            </label>
            <input
              value={form.aircon_name}
              onChange={(e) => updateForm("aircon_name", e.target.value)}
              type="text"
              className="block w-full rounded-2xl border border-slate-200 bg-slate-50 px-4 py-2.5 text-sm text-slate-900 focus:outline-none focus:ring-2 focus:ring-slate-900 focus:bg-white"
              placeholder="Eg. 1.5HP Window aircon"
            />
          </div>
          <div className="space-y-1.5">
            <label className="block text-sm font-medium text-slate-600">
              HP (Horsepower)
            </label>
            <input
              value={form.hp}
              onChange={(e) => updateForm("hp", e.target.value)}
              type="text"
              className="block w-full rounded-2xl border border-slate-200 bg-slate-50 px-4 py-2.5 text-sm text-slate-900 focus:outline-none focus:ring-2 focus:ring-slate-900 focus:bg-white"
              placeholder="1.5"
            />
          </div>

          <div className="space-y-1.5">
            <label className="block text-sm font-medium text-slate-600">
              quantity
            </label>
            <input
              type="number"
              min={1}
              value={form.quantity}
              onChange={(e) => updateForm("quantity", Number(e.target.value))}
              className="block w-full rounded-2xl border border-slate-200 bg-slate-50 px-4 py-2.5 text-sm text-slate-900 focus:outline-none focus:ring-2 focus:ring-slate-900 focus:bg-white"
              placeholder="    quantity"
            />
          </div>

          <div className="space-y-1.5">
            <label className="block text-sm font-medium text-slate-600">
              Price
            </label>
            <input
              type="number"
              min={1}
              value={form.price}
              onChange={(e) => updateForm("price", Number(e.target.value))}
              className="block w-full rounded-2xl border border-slate-200 bg-slate-50 px-4 py-2.5 text-sm text-slate-900 focus:outline-none focus:ring-2 focus:ring-slate-900 focus:bg-white"
              placeholder="Price"
            />
          </div>

          <div className="space-y-1.5">
            <label className="block text-sm font-medium text-slate-600">
              Type of aircon
            </label>

            <select
              value={form.type_of_aircon}
              onChange={(e) => updateForm("type_of_aircon", e.target.value)}
              className="w-full rounded-2xl border border-slate-300 bg-slate-100 px-4 py-3 text-sm"
            >
              <option value="" hidden>
                Select unit type
              </option>
              <option value="window">Window</option>
              <option value="split">Split</option>
              <option value="ducted">Ducted</option>
              <option value="vrf">VRF</option>
            </select>
          </div>

          <div className="space-y-1.5">
            <label className="block text-sm font-medium text-slate-600">
              Indoor / outdoor unit
            </label>

            <select
              value={form.indoor_outdoor_unit}
              onChange={(e) =>
                updateForm("indoor_outdoor_unit", e.target.value)
              }
              className="w-full rounded-2xl border border-slate-300 bg-slate-100 px-4 py-3 text-sm"
            >
              <option value="" hidden>
                Select unit type
              </option>
              <option value="indoor">Indoor unit</option>
              <option value="outdoor">Outdoor unit</option>
            </select>
          </div>
        </div>
        <div className="flex justify-end ">
          <button
            type="submit"
            className="inline-flex items-center rounded-[999px] bg-[#1f285c] text-white px-6 py-2.5 text-sm font-semibold shadow-[0_18px_40px_rgba(15,23,42,0.35)] hover:bg-[#171e48] disabled:opacity-60"
          >
            save Inventory
          </button>
        </div>
      </form>
    </>
  );
}

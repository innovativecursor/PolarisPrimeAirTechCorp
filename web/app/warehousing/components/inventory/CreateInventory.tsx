import { useEffect, useState } from "react";
import { toast } from "react-toastify";
import { InventoryForm, InventoryItem } from "./type";
import { generateSku } from "@/app/utils/skuGenerator";
import Required from "@/components/ui/Required";
import { Html5QrcodeScanner } from "html5-qrcode";

type CraeteInventoryProps = {
  onCancel: () => void;
  editing: InventoryItem | null;
  form: InventoryForm;
  setForm: React.Dispatch<React.SetStateAction<InventoryForm>>;
  updateForm: (key: keyof InventoryForm, value: any) => void;
  handleSubmit: () => Promise<boolean>;
};

export default function CraeteInventory({
  onCancel,
  editing,
  form,
  setForm,
  updateForm,
  handleSubmit,
}: CraeteInventoryProps) {
  const [openScanner, setOpenScanner] = useState(false);

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
    if (!editing) {
      const sku = generateSku("INV");
      setForm((p) => ({ ...p, sku }));
    }
  }, [editing]);
  const validateBarcode = () => {
    if (!form.barcode) {
      toast.error("Please scan the barcode");
      return false;
    }
    return true;
  };

  const handleFormSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!validateBarcode()) return;
    const success = await handleSubmit();
    if (success) {
      onCancel();
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
          className="text-xs  cursor-pointer font-medium text-slate-400 hover:text-slate-600"
        >
          Cancel
        </button>
      </div>

      <form className="space-y-8" onSubmit={handleFormSubmit}>
        <div className="space-y-8">
          {/* GENERATED BARCODE */}

          <div>
            <label className="text-sm font-medium">
              Barcode number <Required />
            </label>

            <input
              value={form.barcode}
              // onChange={(e) => updateForm("barcode", e.target.value)}
              readOnly
              placeholder="Scan or type barcode"
              className="w-full mt-1 rounded-xl border px-4 py-3 bg-slate-100"
            />

            <p className="text-xs text-slate-500 mb-2">
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
          </div>

          {openScanner && (
            <div className="border rounded-xl p-4">
              <div id="rr-barcode-reader" />
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
              Aircon model number <Required />
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
              Aircon name <Required />
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
              HP (Horsepower) <Required />
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
              quantity <Required />
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
              Price <Required />
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
              Type of aircon <Required />
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
              Indoor / outdoor unit <Required />
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
            className="inline-flex  cursor-pointer items-center rounded-[999px] bg-[#1f285c] text-white px-6 py-2.5 text-sm font-semibold shadow-[0_18px_40px_rgba(15,23,42,0.35)] hover:bg-[#171e48] disabled:opacity-60"
          >
            save Inventory
          </button>
        </div>
      </form>
    </>
  );
}

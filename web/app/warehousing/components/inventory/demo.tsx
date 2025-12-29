

"use client";

import endpoints from "@/app/lib/endpoints";
import { fetchDataPost, fetchDataPut } from "@/app/lib/fetchData";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
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

  const updateForm = (key: string, value: any) => {
    setForm((p) => ({ ...p, [key]: value }));
  };

  /* ---------- Generate barcode ---------- */
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
          // ✅ AUTO FILL HERE
          setForm((p) => ({ ...p, barcode: decodedText }));
          toast.success("Barcode scanned");
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

  /* ---------- Edit mode prefill ---------- */
  useEffect(() => {
    if (!editing) return;

    setForm({
      sku: editing.sku,
      barcode: editing.barcode || "",
      aircon_model_number: editing.aircon_model_number,
      aircon_name: editing.aircon_name,
      hp: editing.hp,
      type_of_aircon: editing.type_of_aircon,
      indoor_outdoor_unit: editing.indoor_outdoor_unit,
      quantity: editing.quantity,
      price: editing.price,
    });
  }, [editing]);

  /* ---------- Submit ---------- */
  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    if (!form.barcode) {
      toast.error("Please scan barcode");
      return;
    }

    try {
      if (editing?.id) {
        await fetchDataPut(endpoints.inventory.update(editing.id), form);
        toast.success("Inventory updated");
      } else {
        await fetchDataPost(endpoints.inventory.add, form);
        toast.success("Inventory added");
      }
      onCancel();
    } catch (err: any) {
      toast.error(err.message || "Failed");
    }
  };

  return (
    <form className="space-y-6" onSubmit={handleSubmit}>
      {/* BARCODE SECTION */}
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
          readOnly
          placeholder="Scan barcode"
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

      {/* SAVE */}
      <button
        type="submit"
        className="rounded-full bg-[#1f285c] text-white px-6 py-2.5 text-sm font-semibold"
      >
        Save Inventory
      </button>
    </form>
  );
}



const validateForm = () => {
  const scanned = form.barcode.trim().toUpperCase();
  const generated = generatedBarcode.trim().toUpperCase();

  // 1️⃣ Barcode mandatory
  if (!scanned) return "Please scan the barcode";

  // 2️⃣ Barcode must match generated
  if (!editing && scanned !== generated) {
    return "Scanned barcode does not match generated barcode";
  }

  // 3️⃣ Other required fields
  if (!form.sku.trim()) return "SKU is required";
  if (!form.aircon_model_number.trim()) return "Model number is required";
  if (!form.aircon_name.trim()) return "Aircon name is required";
  if (!form.hp.trim()) return "HP is required";
  if (!form.type_of_aircon) return "Type of aircon is required";
  if (!form.indoor_outdoor_unit)
    return "Indoor / Outdoor unit is required";

  if (form.quantity <= 0)
    return "Quantity must be greater than 0";

  if (form.price <= 0)
    return "Price must be greater than 0";

  return null; // ✅ all good
};

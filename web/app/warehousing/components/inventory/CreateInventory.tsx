// import endpoints from "@/app/lib/endpoints";
// import {
//   fetchDataPatch,
//   fetchDataPost,
//   fetchDataPut,
// } from "@/app/lib/fetchData";
// import {
//   Select,
//   SelectContent,
//   SelectItem,
//   SelectTrigger,
//   SelectValue,
// } from "@/components/ui/select";
// import JsBarcode from "jsbarcode";
// import { useEffect, useRef, useState } from "react";
// import { toast } from "react-toastify";
// import { InventoryItem } from "./type";

// type CraeteInventoryProps = {
//   onCancel: () => void;
//   editing?: InventoryItem | null;
// };

// export default function CraeteInventory({
//   onCancel,
//   editing,
// }: CraeteInventoryProps) {
//   const [generatedBarcode, setGeneratedBarcode] = useState("");
//   const barcodeRef = useRef<SVGSVGElement | null>(null);
//   const [form, setForm] = useState({
//     sku: "",
//     barcode: "",
//     aircon_model_number: "",
//     aircon_name: "",
//     hp: "",
//     type_of_aircon: "",
//     indoor_outdoor_unit: "",
//     quantity: 0,
//     price: 0,
//   });

//   const updateForm = (key: string, value: any) => {
//     setForm((p) => ({ ...p, [key]: value }));
//   };

//   useEffect(() => {
//     if (!barcodeRef.current || !generatedBarcode) return;

//     JsBarcode(barcodeRef.current, generatedBarcode, {
//       format: "CODE128",
//       width: 2,
//       height: 60,
//       displayValue: false,
//     });
//   }, [generatedBarcode]);

//   useEffect(() => {
//     const code = "AC-" + Math.floor(100000 + Math.random() * 900000);
//     setGeneratedBarcode(code);
//   }, []);

//   useEffect(() => {
//     if (!editing) return;

//     setForm({
//       sku: editing.sku,
//       barcode: editing.barcode || "",
//       aircon_model_number: editing.aircon_model_number,
//       aircon_name: editing.aircon_name,
//       hp: editing.hp,
//       type_of_aircon: editing.type_of_aircon,
//       indoor_outdoor_unit: editing.indoor_outdoor_unit,
//       quantity: editing.quantity,
//       price: editing.price,
//     });

//     setGeneratedBarcode(editing.barcode || "");
//   }, [editing]);

//   const validateForm = () => {
//     if (!editing) {
//       const scanned = form.barcode.trim().toUpperCase();
//       const generated = generatedBarcode.trim().toUpperCase();

//       if (scanned !== generated) {
//         return "Invalid barcode. Please scan the generated barcode";
//       }
//     }

//     if (!form.sku.trim()) return "SKU is required";
//     if (!form.barcode.trim()) return "Barcode is required";
//     if (!form.aircon_model_number.trim()) return "Model number required";
//     if (!form.aircon_name.trim()) return "Aircon name required";
//     if (!form.hp.trim()) return "HP required";
//     if (!form.type_of_aircon) return "Type required";
//     if (!form.indoor_outdoor_unit) return "Unit required";
//     if (form.quantity <= 0) return "Quantity must be > 0";
//     if (form.price <= 0) return "Price must be > 0";

//     return null;
//   };

//   const handleSubmit = async (e: React.FormEvent) => {
//     e.preventDefault();

//     const error = validateForm();
//     if (error) {
//       toast.error(error);
//       return;
//     }

//     const payload = {
//       sku: form.sku,
//       barcode: form.barcode,
//       aircon_model_number: form.aircon_model_number,
//       aircon_name: form.aircon_name,
//       hp: form.hp,
//       type_of_aircon: form.type_of_aircon,
//       indoor_outdoor_unit: form.indoor_outdoor_unit,
//       quantity: Number(form.quantity),
//       price: Number(form.price),
//     };

//     try {
//       if (editing?.id) {
//         await fetchDataPut(endpoints.inventory.update(editing.id), payload);
//         toast.success("Inventory updated successfully");
//       } else {
//         await fetchDataPost(endpoints.inventory.add, payload);
//         toast.success("Inventory added successfully");
//       }
//       onCancel();
//     } catch (err: any) {
//       toast.error(err.message || "Failed to save inventory");
//     }
//   };

//   return (
//     <>
//       <div className="flex items-start justify-between mb-8">
//         <div>
//           <p className="text-xs font-semibold tracking-[0.24em] uppercase text-slate-400 mb-2">
//             Warehousing
//           </p>
//           <h2 className="text-lg md:text-xl font-semibold text-slate-900">
//             Add inventory
//           </h2>
//         </div>

//         <button
//           type="button"
//           onClick={onCancel}
//           className="text-xs font-medium text-slate-400 hover:text-slate-600"
//         >
//           Cancel
//         </button>
//       </div>

//       <form className="space-y-8" onSubmit={handleSubmit}>
//         <div>
//           <h3 className="text-lg font-semibold text-slate-900 mb-1">
//             Scan barcode
//           </h3>
//           <p className="text-sm text-slate-500">
//             Use camera or scanner to capture SKU barcode.
//           </p>

//           {/* GENERATED BARCODE */}

//           <div className="mt-6 inline-flex rounded-2xl border border-slate-300 bg-white p-6">
//             <svg ref={barcodeRef} />
//           </div>
//         </div>

//         <div className="space-y-2">
//           <label className="text-sm font-medium text-slate-600">
//             Barcode number
//           </label>
//           {/* <input
//             value={form.barcode}
//             onChange={(e) => updateForm("barcode", e.target.value)}
//             placeholder="Scan barcode"
//             // autoFocus={!editing}
//             className="w-full rounded-2xl border border-slate-300 bg-slate-100 px-4 py-3 text-sm"
//           /> */}
//           <input
//             value={form.barcode}
//             disabled={!!editing}
//             onChange={(e) => updateForm("barcode", e.target.value)}
//             onKeyDown={(e) => {
//               if (e.key === "Enter") {
//                 e.preventDefault();

//                 const scanned = form.barcode.trim().toUpperCase();
//                 const generated = generatedBarcode.trim().toUpperCase();

//                 if (scanned !== generated) {
//                   toast.error(
//                     "Scanned barcode does not match generated barcode"
//                   );
//                   return;
//                 }

//                 toast.success("Barcode scanned successfully");
//               }
//             }}
//             placeholder="Scan barcode"
//             autoFocus={!editing}
//             className="w-full rounded-2xl border border-slate-300 bg-slate-100 px-4 py-3 text-sm"
//           />
//         </div>

//         <div className="grid gap-6 lg:grid-cols-3">
//           <div className="space-y-1.5">
//             <label className="block text-sm font-medium text-slate-600">
//               SKU
//             </label>
//             <input
//               value={form.sku}
//               onChange={(e) => updateForm("sku", e.target.value)}
//               type="text"
//               className="block w-full rounded-2xl border border-slate-200 bg-slate-50 px-4 py-2.5 text-sm text-slate-900 focus:outline-none focus:ring-2 focus:ring-slate-900 focus:bg-white"
//               placeholder="Sku"
//             />
//           </div>
//           <div className="space-y-1.5">
//             <label className="block text-sm font-medium text-slate-600">
//               Aircon model number
//             </label>
//             <input
//               value={form.aircon_model_number}
//               onChange={(e) =>
//                 updateForm("aircon_model_number", e.target.value)
//               }
//               type="text"
//               className="block w-full rounded-2xl border border-slate-200 bg-slate-50 px-4 py-2.5 text-sm text-slate-900 focus:outline-none focus:ring-2 focus:ring-slate-900 focus:bg-white"
//               placeholder="Eg. MX-1200"
//             />
//           </div>
//           <div className="space-y-1.5">
//             <label className="block text-sm font-medium text-slate-600">
//               Aircon name
//             </label>
//             <input
//               value={form.aircon_name}
//               onChange={(e) => updateForm("aircon_name", e.target.value)}
//               type="text"
//               className="block w-full rounded-2xl border border-slate-200 bg-slate-50 px-4 py-2.5 text-sm text-slate-900 focus:outline-none focus:ring-2 focus:ring-slate-900 focus:bg-white"
//               placeholder="Eg. 1.5HP Window aircon"
//             />
//           </div>
//           <div className="space-y-1.5">
//             <label className="block text-sm font-medium text-slate-600">
//               HP (Horsepower)
//             </label>
//             <input
//               value={form.hp}
//               onChange={(e) => updateForm("hp", e.target.value)}
//               type="text"
//               className="block w-full rounded-2xl border border-slate-200 bg-slate-50 px-4 py-2.5 text-sm text-slate-900 focus:outline-none focus:ring-2 focus:ring-slate-900 focus:bg-white"
//               placeholder="1.5"
//             />
//           </div>

//           <div className="space-y-1.5">
//             <label className="block text-sm font-medium text-slate-600">
//               quantity
//             </label>
//             <input
//               type="number"
//               min={1}
//               value={form.quantity}
//               onChange={(e) => updateForm("quantity", Number(e.target.value))}
//               className="block w-full rounded-2xl border border-slate-200 bg-slate-50 px-4 py-2.5 text-sm text-slate-900 focus:outline-none focus:ring-2 focus:ring-slate-900 focus:bg-white"
//               placeholder="    quantity"
//             />
//           </div>

//           <div className="space-y-1.5">
//             <label className="block text-sm font-medium text-slate-600">
//               Price
//             </label>
//             <input
//               type="number"
//               min={1}
//               value={form.price}
//               onChange={(e) => updateForm("price", Number(e.target.value))}
//               className="block w-full rounded-2xl border border-slate-200 bg-slate-50 px-4 py-2.5 text-sm text-slate-900 focus:outline-none focus:ring-2 focus:ring-slate-900 focus:bg-white"
//               placeholder="Price"
//             />
//           </div>

//           <div className="space-y-1.5">
//             <label className="block text-sm font-medium text-slate-600">
//               Type of aircon
//             </label>

//             <Select
//               value={form.type_of_aircon}
//               onValueChange={(val) => updateForm("type_of_aircon", val)}
//             >
//               <SelectTrigger className="w-full rounded-2xl border border-slate-200 bg-slate-50 px-4 py-2.5 text-sm text-slate-900 focus:outline-none focus:ring-2 focus:ring-slate-900 focus:bg-white">
//                 <SelectValue placeholder="Select type" />
//               </SelectTrigger>

//               <SelectContent>
//                 <SelectItem value="Window">Window</SelectItem>
//                 <SelectItem value="Split">Split</SelectItem>
//                 <SelectItem value="Cassette">Cassette</SelectItem>
//                 <SelectItem value="VRF">VRF</SelectItem>
//               </SelectContent>
//             </Select>
//           </div>

//           <div className="space-y-1.5">
//             <label className="block text-sm font-medium text-slate-600">
//               Indoor / outdoor unit
//             </label>

//             <Select
//               value={form.indoor_outdoor_unit}
//               onValueChange={(val) => updateForm("indoor_outdoor_unit", val)}
//             >
//               <SelectTrigger className="w-full rounded-2xl border border-slate-200 bg-slate-50 px-4 py-2.5 text-sm text-slate-900 focus:outline-none focus:ring-2 focus:ring-slate-900 focus:bg-white">
//                 <SelectValue placeholder="Select unit type" />
//               </SelectTrigger>

//               <SelectContent>
//                 <SelectItem value="Window">Indoor unit</SelectItem>
//                 <SelectItem value="Split">Outdoor unit</SelectItem>
//               </SelectContent>
//             </Select>
//           </div>
//         </div>
//         <div className="flex justify-end ">
//           <button
//             type="submit"
//             className="inline-flex items-center rounded-[999px] bg-[#1f285c] text-white px-6 py-2.5 text-sm font-semibold shadow-[0_18px_40px_rgba(15,23,42,0.35)] hover:bg-[#171e48] disabled:opacity-60"
//           >
//             save Inventory
//           </button>
//         </div>
//       </form>
//     </>
//   );
// }

// import { Html5QrcodeScanner } from "html5-qrcode";

// import endpoints from "@/app/lib/endpoints";
// import {
//   fetchDataPatch,
//   fetchDataPost,
//   fetchDataPut,
// } from "@/app/lib/fetchData";
// import {
//   Select,
//   SelectContent,
//   SelectItem,
//   SelectTrigger,
//   SelectValue,
// } from "@/components/ui/select";
// import JsBarcode from "jsbarcode";
// import { useEffect, useRef, useState } from "react";
// import { toast } from "react-toastify";
// import { InventoryItem } from "./type";

// type CraeteInventoryProps = {
//   onCancel: () => void;
//   editing?: InventoryItem | null;
// };

// export default function CraeteInventory({
//   onCancel,
//   editing,
// }: CraeteInventoryProps) {
//   const [openScanner, setOpenScanner] = useState(false);

//   const [generatedBarcode, setGeneratedBarcode] = useState("");
//   const barcodeRef = useRef<SVGSVGElement | null>(null);
//   const [form, setForm] = useState({
//     sku: "",
//     barcode: "",
//     aircon_model_number: "",
//     aircon_name: "",
//     hp: "",
//     type_of_aircon: "",
//     indoor_outdoor_unit: "",
//     quantity: 0,
//     price: 0,
//   });

//   const updateForm = (key: string, value: any) => {
//     setForm((p) => ({ ...p, [key]: value }));
//   };

//   useEffect(() => {
//     if (!barcodeRef.current || !generatedBarcode) return;

//     JsBarcode(barcodeRef.current, generatedBarcode, {
//       format: "CODE128",
//       width: 2,
//       height: 60,
//       displayValue: false,
//     });
//   }, [generatedBarcode]);

//   useEffect(() => {
//     const code = "AC-" + Math.floor(100000 + Math.random() * 900000);
//     setGeneratedBarcode(code);
//   }, []);

//   useEffect(() => {
//     if (!openScanner) return;

//     const scanner = new Html5QrcodeScanner(
//       "barcode-reader",
//       {
//         fps: 10,
//         qrbox: { width: 250, height: 150 },
//       },
//       false
//     );

//     scanner.render(
//       (decodedText) => {
//         // ✅ YAHI PE AUTO FILL HOGA
//         updateForm("barcode", decodedText);

//         toast.success("Barcode scanned");
//         setOpenScanner(false);
//         scanner.clear();
//       },
//       () => {}
//     );

//     return () => {
//       scanner.clear().catch(() => {});
//     };
//   }, [openScanner]);

//   useEffect(() => {
//     if (!editing) return;

//     setForm({
//       sku: editing.sku,
//       barcode: editing.barcode || "",
//       aircon_model_number: editing.aircon_model_number,
//       aircon_name: editing.aircon_name,
//       hp: editing.hp,
//       type_of_aircon: editing.type_of_aircon,
//       indoor_outdoor_unit: editing.indoor_outdoor_unit,
//       quantity: editing.quantity,
//       price: editing.price,
//     });

//     setGeneratedBarcode(editing.barcode || "");
//   }, [editing]);

//   const validateForm = () => {
//     if (!editing) {
//       const scanned = form.barcode.trim().toUpperCase();
//       const generated = generatedBarcode.trim().toUpperCase();

//       if (scanned !== generated) {
//         return "Invalid barcode. Please scan the generated barcode";
//       }
//     }

//     if (!form.sku.trim()) return "SKU is required";
//     if (!form.barcode.trim()) return "Barcode is required";
//     if (!form.aircon_model_number.trim()) return "Model number required";
//     if (!form.aircon_name.trim()) return "Aircon name required";
//     if (!form.hp.trim()) return "HP required";
//     if (!form.type_of_aircon) return "Type required";
//     if (!form.indoor_outdoor_unit) return "Unit required";
//     if (form.quantity <= 0) return "Quantity must be > 0";
//     if (form.price <= 0) return "Price must be > 0";

//     return null;
//   };

//   const handleSubmit = async (e: React.FormEvent) => {
//     e.preventDefault();

//     const error = validateForm();
//     if (error) {
//       toast.error(error);
//       return;
//     }

//     const payload = {
//       sku: form.sku,
//       barcode: form.barcode,
//       aircon_model_number: form.aircon_model_number,
//       aircon_name: form.aircon_name,
//       hp: form.hp,
//       type_of_aircon: form.type_of_aircon,
//       indoor_outdoor_unit: form.indoor_outdoor_unit,
//       quantity: Number(form.quantity),
//       price: Number(form.price),
//     };

//     try {
//       if (editing?.id) {
//         await fetchDataPut(endpoints.inventory.update(editing.id), payload);
//         toast.success("Inventory updated successfully");
//       } else {
//         await fetchDataPost(endpoints.inventory.add, payload);
//         toast.success("Inventory added successfully");
//       }
//       onCancel();
//     } catch (err: any) {
//       toast.error(err.message || "Failed to save inventory");
//     }
//   };

//   return (
//     <>
//       <div className="flex items-start justify-between mb-8">
//         <div>
//           <p className="text-xs font-semibold tracking-[0.24em] uppercase text-slate-400 mb-2">
//             Warehousing
//           </p>
//           <h2 className="text-lg md:text-xl font-semibold text-slate-900">
//             Add inventory
//           </h2>
//         </div>

//         <button
//           type="button"
//           onClick={onCancel}
//           className="text-xs font-medium text-slate-400 hover:text-slate-600"
//         >
//           Cancel
//         </button>
//       </div>

//       <form className="space-y-8" onSubmit={handleSubmit}>
//         <div>
//           <h3 className="text-lg font-semibold text-slate-900 mb-1">
//             Scan barcode
//           </h3>
//           <p className="text-sm text-slate-500">
//             Use camera or scanner to capture SKU barcode.
//           </p>

//           {/* GENERATED BARCODE */}

//           <div className="mt-6 inline-flex rounded-2xl border border-slate-300 bg-white p-6">
//             <svg ref={barcodeRef} />
//           </div>
//         </div>

//         <div className="space-y-2">
//           <label className="text-sm font-medium text-slate-600">
//             Barcode number
//           </label>
//           <input
//             value={form.barcode}
//             onChange={(e) => updateForm("barcode", e.target.value)}
//             placeholder="Scan barcode"
//             // autoFocus={!editing}
//             className="w-full rounded-2xl border border-slate-300 bg-slate-100 px-4 py-3 text-sm"
//           />
//           <button
//             type="button"
//             onClick={() => setOpenScanner(true)}
//             className="text-sm text-blue-600 underline mt-1"
//           >
//             Scan using laptop camera
//           </button>
//         </div>

//         <div className="grid gap-6 lg:grid-cols-3">
//           <div className="space-y-1.5">
//             <label className="block text-sm font-medium text-slate-600">
//               SKU
//             </label>
//             <input
//               value={form.sku}
//               onChange={(e) => updateForm("sku", e.target.value)}
//               type="text"
//               className="block w-full rounded-2xl border border-slate-200 bg-slate-50 px-4 py-2.5 text-sm text-slate-900 focus:outline-none focus:ring-2 focus:ring-slate-900 focus:bg-white"
//               placeholder="Sku"
//             />
//           </div>
//           <div className="space-y-1.5">
//             <label className="block text-sm font-medium text-slate-600">
//               Aircon model number
//             </label>
//             <input
//               value={form.aircon_model_number}
//               onChange={(e) =>
//                 updateForm("aircon_model_number", e.target.value)
//               }
//               type="text"
//               className="block w-full rounded-2xl border border-slate-200 bg-slate-50 px-4 py-2.5 text-sm text-slate-900 focus:outline-none focus:ring-2 focus:ring-slate-900 focus:bg-white"
//               placeholder="Eg. MX-1200"
//             />
//           </div>
//           <div className="space-y-1.5">
//             <label className="block text-sm font-medium text-slate-600">
//               Aircon name
//             </label>
//             <input
//               value={form.aircon_name}
//               onChange={(e) => updateForm("aircon_name", e.target.value)}
//               type="text"
//               className="block w-full rounded-2xl border border-slate-200 bg-slate-50 px-4 py-2.5 text-sm text-slate-900 focus:outline-none focus:ring-2 focus:ring-slate-900 focus:bg-white"
//               placeholder="Eg. 1.5HP Window aircon"
//             />
//           </div>
//           <div className="space-y-1.5">
//             <label className="block text-sm font-medium text-slate-600">
//               HP (Horsepower)
//             </label>
//             <input
//               value={form.hp}
//               onChange={(e) => updateForm("hp", e.target.value)}
//               type="text"
//               className="block w-full rounded-2xl border border-slate-200 bg-slate-50 px-4 py-2.5 text-sm text-slate-900 focus:outline-none focus:ring-2 focus:ring-slate-900 focus:bg-white"
//               placeholder="1.5"
//             />
//           </div>

//           <div className="space-y-1.5">
//             <label className="block text-sm font-medium text-slate-600">
//               quantity
//             </label>
//             <input
//               type="number"
//               min={1}
//               value={form.quantity}
//               onChange={(e) => updateForm("quantity", Number(e.target.value))}
//               className="block w-full rounded-2xl border border-slate-200 bg-slate-50 px-4 py-2.5 text-sm text-slate-900 focus:outline-none focus:ring-2 focus:ring-slate-900 focus:bg-white"
//               placeholder="    quantity"
//             />
//           </div>

//           <div className="space-y-1.5">
//             <label className="block text-sm font-medium text-slate-600">
//               Price
//             </label>
//             <input
//               type="number"
//               min={1}
//               value={form.price}
//               onChange={(e) => updateForm("price", Number(e.target.value))}
//               className="block w-full rounded-2xl border border-slate-200 bg-slate-50 px-4 py-2.5 text-sm text-slate-900 focus:outline-none focus:ring-2 focus:ring-slate-900 focus:bg-white"
//               placeholder="Price"
//             />
//           </div>

//           <div className="space-y-1.5">
//             <label className="block text-sm font-medium text-slate-600">
//               Type of aircon
//             </label>

//             <Select
//               value={form.type_of_aircon}
//               onValueChange={(val) => updateForm("type_of_aircon", val)}
//             >
//               <SelectTrigger className="w-full rounded-2xl border border-slate-200 bg-slate-50 px-4 py-2.5 text-sm text-slate-900 focus:outline-none focus:ring-2 focus:ring-slate-900 focus:bg-white">
//                 <SelectValue placeholder="Select type" />
//               </SelectTrigger>

//               <SelectContent>
//                 <SelectItem value="Window">Window</SelectItem>
//                 <SelectItem value="Split">Split</SelectItem>
//                 <SelectItem value="Cassette">Cassette</SelectItem>
//                 <SelectItem value="VRF">VRF</SelectItem>
//               </SelectContent>
//             </Select>
//           </div>

//           <div className="space-y-1.5">
//             <label className="block text-sm font-medium text-slate-600">
//               Indoor / outdoor unit
//             </label>

//             <Select
//               value={form.indoor_outdoor_unit}
//               onValueChange={(val) => updateForm("indoor_outdoor_unit", val)}
//             >
//               <SelectTrigger className="w-full rounded-2xl border border-slate-200 bg-slate-50 px-4 py-2.5 text-sm text-slate-900 focus:outline-none focus:ring-2 focus:ring-slate-900 focus:bg-white">
//                 <SelectValue placeholder="Select unit type" />
//               </SelectTrigger>

//               <SelectContent>
//                 <SelectItem value="Window">Indoor unit</SelectItem>
//                 <SelectItem value="Split">Outdoor unit</SelectItem>
//               </SelectContent>
//             </Select>
//           </div>
//         </div>
//         <div className="flex justify-end ">
//           <button
//             type="submit"
//             className="inline-flex items-center rounded-[999px] bg-[#1f285c] text-white px-6 py-2.5 text-sm font-semibold shadow-[0_18px_40px_rgba(15,23,42,0.35)] hover:bg-[#171e48] disabled:opacity-60"
//           >
//             save Inventory
//           </button>
//         </div>
//         {openScanner && (
//           <div className="mt-6 rounded-xl border p-4">
//             <div id="barcode-reader" />
//           </div>
//         )}
//       </form>
//     </>
//   );
// }








































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

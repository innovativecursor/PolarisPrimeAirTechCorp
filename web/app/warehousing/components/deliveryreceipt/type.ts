export type DeliveryReceiptItem = {
  line_no: number;
  model: string;
  description: string;
  plant: string;
  stor_loc: string;
  unit: string;
  ship_qty: number;
  total_cbm: number;
  total_kgs: number;
  serial_nos: string[];
};

export type DeliveryReceiptForm = {
  supplier_id: string;
  project_id: string;
  supplier_dr_no: string;
  your_po_no: string;
  dispatch_date: string;
  ship_to: string;
  reference: string;
  date: string;
};

export type SupplierDRItem = {
  line_no: number;
  model: string;
  description: string;
  plant: string;
  stor_loc: string;
  unit: string;
  ship_qty: number;
  total_cbm: number;
  total_kgs: number;
  serial_nos: string[] | null;
};

export type SupplierDeliveryReceipt = {
  id: string;
  supplier_id: string;
  project_id: string;
  supplier_dr_no: string;
  your_po_no: string;
  dispatch_date: string;
  project_name: string;
  ship_to: string;
  reference: string;
  date: string;
  items: SupplierDRItem[];
  received_by: string;
  created_at: string;
};

export type SupplierDRListRes = {
  supplierDR: SupplierDeliveryReceipt[];
};

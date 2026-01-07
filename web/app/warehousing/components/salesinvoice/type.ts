export type InvoiceItem = {
  description: string;
  qty: number;
  unit: "unit" | "pcs" | "set";
  unit_price: number;
  amount: number;
};

export type SalesInvoiceForm = {
  supplier_id: string;
  project_id: string;
  invoice_number: string;
  invoice_date: string;
  delivery_number: string;
  po_number: string;
  due_date: string;
  delivery_address: string;
  vat_type: string;
  total_sales: number;
  grand_total: number;
};

export type SupplierInvoice = {
  _id: string;
  supplier_id: string;
  project_id: string;
  project_name: string;
  invoice_no: string;
  invoice_date: string;
  delivery_no: string;
  purchase_order_no: string;
  due_date: string;
  delivery_address: string;

  items: InvoiceItem[] | null;

  total_sales: number;
  vat: number;
  grand_total: number;

  created_at: string;
  created_by: string;
};

export type SupplierInvoiceListResponse = {
  invoices: SupplierInvoice[];
};

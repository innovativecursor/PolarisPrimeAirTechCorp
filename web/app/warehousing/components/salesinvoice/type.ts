export type InvoiceItem = {
  description: string;
  qty: number;
  unit: string;
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
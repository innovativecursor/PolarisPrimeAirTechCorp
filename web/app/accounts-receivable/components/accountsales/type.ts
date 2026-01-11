export type InvoiceItem = {
  sku: string;
  quantity: number;
};

export type AccountSalesForm = {
  project_id: string;
  customer_id: string;
  customer_name: string;
  sales_order_id: string;
};

export type SalesInvoiceItem = {
  sku: string;
  quantity: number;
  unit_price: number;
  amount: number;
};
export type SalesInvoice = {
  id: string;
  invoice_id: string;

  project?: {
    id: string;
    name: string;
  };

  customer?: {
    id: string;
    name: string;
  };

  project_id: string;
  customer_id: string;
  customer_name?: string;

  sales_order_id: string;
  items: SalesInvoiceItem[];
  total_amount: number;
};

export type SalesInvoiceListRes = {
  data: SalesInvoice[];
};

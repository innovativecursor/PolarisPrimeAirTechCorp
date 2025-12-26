export type ReceivingReportRow = {
  id: string;
  deliveryreceipt: string;
  purchaseorder: string;
  salesorder: string;
  supplierinvoice: string;
  status: string;
  _raw?: any;
};

export type DeliveryReceiptRow = {
  id: string;
  supplier_dr_no: string;
};

export type SupplierDRResponse = {
  data?: DeliveryReceiptRow[];
  supplierDR?: DeliveryReceiptRow[];
};

export type SalesOrderRow = {
  id: string;
};

export type SalesOrderResponse = {
  salesOrders?: SalesOrderRow[];
};

export type RRInvoicesRow = {
  id: string;
  invoice_no: string;
};

export type RRInvoicesResponse = {
  invoices?: RRInvoicesRow[];
};

export type CreateRRPayload = {
  supplier_dr_id: string;
  supplier_invoice_id: string;
  purchase_order_id: string;
  sales_order_id: string;
  sku: string;
  barcode: string;
  aircon_model_number: string;
  aircon_name: string;
  type_of_aircon: string;
  hp: string;
  indoor_outdoor_unit: string;
  quantity: number;
  price: number;
};

export type ReceivingReportData = {
  id: string;
  sku: string;
  barcode: string;
  aircon_model_number: string;
  aircon_name: string;
  price: number;
  hp: string;
  type_of_aircon: string;
  indoor_outdoor_unit: string;
  quantity: number;
  supplier_dr_id: string;
  supplier_invoice_id: string;
  purchase_order_id: string;
  sales_order_id: string;
  created_by: string;
  created_at: string;
  updated_at: string;
};

export type CreateRRRes = {
  data: ReceivingReportData;
  message: string;
};

export type ReceivingReportItem = {
  id: string;
  sku: string;
  barcode?: string;
  aircon_model_number: string;
  aircon_name: string;
  price: number;
  hp: string;
  type_of_aircon: string;
  indoor_outdoor_unit: "Indoor" | "Outdoor";
  quantity: number;
  supplier_dr_id: string;
  supplier_invoice_id: string;
  purchase_order_id: string;
  sales_order_id: string;
  created_by: string;
  created_at: string;
  updated_at: string;
};

export type GetReceivingReportRes = {
  data: ReceivingReportItem[];
  message: string;
};

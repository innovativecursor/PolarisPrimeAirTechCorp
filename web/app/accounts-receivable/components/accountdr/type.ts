
export type DrForm = {
  project_id: string;
  customer_id: string;
  sales_order_id: string;
  sales_invoice_id: string;
};

export type DeliveryReceiptItem = {
  sku: string;
  quantity: number;
};

export type DeliveryReceipt = {
  id: string;
  dr_number: string;

  project_id: string;
  customer_id: string;
  sales_order_id: string;
  sales_invoice_id: string;

  customer_name: string;
  customer_org: string;
  customer_tin: string;
  customer_location: string;

  items: DeliveryReceiptItem[];

  status: "Issued" | "Ready" | string;

  created_at: string;
  updated_at: string;
};

export type DeliveryReceiptListRes = {
  data: DeliveryReceipt[];
};


// export type DeliveryReceiptStatus = "Ready" | "Issued" | "Delivered";

// export type DR = {
//   id: string;
//   dr_number: string;
//   project_id: string;
//   customer_id: string;
//   sales_order_id: string;
//   sales_invoice_id: string;
//   customer_name: string;
//   status: DeliveryReceiptStatus;
// };

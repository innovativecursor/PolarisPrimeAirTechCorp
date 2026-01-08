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

  project: {
    id: string;
    name: string;
  };

  customer: {
    id: string;
    name: string;
    org: string;
    tin: string;
    location: string;
  };

  sales_order: {
    id: string;
    name: string;
  };

  sales_invoice: {
    id: string;
    name: string;
  };

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

/* eslint-disable @typescript-eslint/no-explicit-any */

export type SupplierPORow = {
  id: string;
  poId: string;
  soId: string;
  projectName: string;
  supplierName: string;
  status: string;
  totalAmount: number;
  _raw?: any;
};

export type ProjectOption = {
  id: string;
  name: string;
  customer_id: string;
};

export type SupplierOption = {
  id: string;
  name: string;
};

export type SalesOrderOption = {
  id: string;
  name: string;
};

export type SupplierPOFormValues = {
  projectId: string;
  supplierId: string;
  soId?: string;
  customerPoIds?: string[];
  status: "draft" | "approved";
  items: {
    id: string;
    description: string;
    quantity: string;
    uom: string;
  }[];
};

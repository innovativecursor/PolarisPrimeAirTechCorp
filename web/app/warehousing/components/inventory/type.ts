export type InventoryItem = {
  id: string;
  sku: string;
  barcode?: string;
  aircon_model_number: string;
  aircon_name: string;
  price: number;
  hp: string;
  type_of_aircon: string;
  indoor_outdoor_unit: string;
  quantity: number;

  supplier_dr_id?: string;
  supplier_invoice_id?: string;
  purchase_order_id?: string;
  sales_order_id?: string;

  created_by?: string;
  created_at: string;
  updated_at: string;
};

export type InventoryListResponse = {
  inventory: InventoryItem[];
};
export type InventoryForm = {
  sku: string;
  barcode: string;
  aircon_model_number: string;
  aircon_name: string;
  hp: string;
  type_of_aircon: string;
  indoor_outdoor_unit: string;
  quantity: number;
  price: number;
};

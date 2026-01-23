export type MonthlySales = {
  month: string;
  value: number;
};

export type CustomersByCity = {
  city: string;
  count: number;
};

export type FulfillmentStage = {
  stage: string;
  count: number;
};

export type FulfillmentPipeline = {
  past_7_days: FulfillmentStage[];
};

export type InventoryPosition = {
  type: string;
  units: number;
};

export type DashboardResponse = {
  available_units: number;
  open_sales_orders: number;
  receiving_this_week: number;
  total_deliveries: number;
  monthly_sales: MonthlySales[];
  customers_by_city: CustomersByCity[];
  fulfillment_pipeline: FulfillmentPipeline;
  inventory_position: InventoryPosition[];
};

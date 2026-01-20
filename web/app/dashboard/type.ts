export type MonthlySales = {
  month: string;
  value: number;
};

export type CustomersByCity = {
  city: string;
  count: number;
};

export type DashboardResponse = {
  available_units: number;
  open_sales_orders: number;
  receiving_this_week: number;
  total_deliveries: number;
  monthly_sales: MonthlySales[];
  customers_by_city: CustomersByCity[];
};

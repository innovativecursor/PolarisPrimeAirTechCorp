export type SupplierForm = {
  supplier_code: string;
  supplier_name: string;
  tin_number: string;
  organization: string;
  location: string;
};

export type Supplier = {
  id: string;
  supplier_code: string;
  supplier_name: string;
  tin_number: string;
  organization: string;
  location: string;
  created_at: string;
  created_by: string;
};

export type SupplierListResponse = {
  suppliers: Supplier[];
};

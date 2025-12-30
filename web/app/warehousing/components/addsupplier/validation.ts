import { SupplierForm } from "./type";

export function validateSupplier(form: SupplierForm): string | null {
  if (!form.supplier_name.trim()) return "Supplier name is required";
  if (!form.supplier_code.trim()) return "Supplier code is required";
  if (!form.tin_number.trim()) return "TIN number is required";
  if (!form.organization.trim()) return "Organization name is required";
  if (!form.location.trim()) return "Location is required";

  return null;
}

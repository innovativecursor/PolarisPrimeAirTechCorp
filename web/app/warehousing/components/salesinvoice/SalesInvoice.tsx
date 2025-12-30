import { useSupplierPO } from "@/app/purchase-orders/hooks/useSupplierPO";
import CreateSalesInvioce from "./CreateSalesInvoice";
import { useSalesInvoice } from "./hooks/useSalesInvoice";

import SalesInvioceList from "./SalesInvoiceList";
import { useEffect } from "react";
import { useSupplier } from "../addsupplier/hooks/useSupplier";

export default function SalesInvioce() {
  const salesInvoice = useSalesInvoice();
  const { projectsOptions, loadOptions } = useSupplierPO();
  const { GetSupplier, allSupplier } = useSupplier();

  useEffect(() => {
    void loadOptions();
    void GetSupplier();
  }, []);

  return (
    <div className="space-y-6">
      {salesInvoice.mode === "list" ? (
        <SalesInvioceList
          onCreate={() => salesInvoice.setMode("create")}
          loading={salesInvoice.loading || salesInvoice.saving}
        />
      ) : (
        <CreateSalesInvioce
          {...salesInvoice}
          projects={projectsOptions}
          allSupplier={allSupplier}
          onCancel={() => {
            salesInvoice.setMode("list");
            salesInvoice.setEditing(null);
          }}
        />
      )}
    </div>
  );
}

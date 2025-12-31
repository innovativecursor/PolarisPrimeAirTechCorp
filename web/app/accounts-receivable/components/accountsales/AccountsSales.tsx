import { useCallback, useEffect } from "react";
import AccountSalesList from "./AccountSalesLIst";
import CreateAccountSales from "./CreateAccountSales";
import { useAccountSales } from "./hooks/useAccountSales";
import { useSupplierPO } from "@/app/purchase-orders/hooks/useSupplierPO";
import { useInventory } from "@/app/warehousing/components/inventory/hooks/useInventory";
import { useConfirmToast } from "@/app/hooks/useConfirmToast";
import { SalesInvoice } from "./type";

export default function AccountSales() {
  const accountSales = useAccountSales();
  const { projectsOptions, loadOptions, salesOrdersOptions } = useSupplierPO();
  const { GetInventories, allInventories } = useInventory();
  const confirmToast = useConfirmToast();

  useEffect(() => {
    void loadOptions();
    void GetInventories();
    accountSales.GetAccountSales();
  }, []);

  const handleDelete = useCallback(
  (row: SalesInvoice) => {
    confirmToast.confirm({
      title: "Delete Sales Invoice",
      message: `Are you sure you want to delete invoice "${row.invoice_id}"?`,
      confirmText: "Delete",
      cancelText: "Cancel",
      onConfirm: async () => {
        await accountSales.deleteSalesInvoice(row.id);
      },
    });
  },
  [accountSales.deleteSalesInvoice, confirmToast]
);


  return (
    <div className="space-y-6">
      {accountSales.mode === "list" ? (
        <AccountSalesList
          loading={accountSales.loading || accountSales.saving}
          onCreate={() => {
            accountSales.setEditing(null);
            accountSales.setMode("create");
          }}
          allAccountSales={accountSales.allAccountSales}
          onEdit={(id) => {
            accountSales.setEditing(id);
            accountSales.setMode("create");
          }}
           onDelete={handleDelete}
        />
      ) : (
        <CreateAccountSales
          saving={accountSales.saving}
          onCancel={() => {
            accountSales.setMode("list");
            accountSales.setEditing(null);
          }}
          projects={projectsOptions}
          salesOrders={salesOrdersOptions}
          form={accountSales.form}
          updateForm={accountSales.updateForm}
          items={accountSales.items}
          addItem={accountSales.addItem}
          updateItem={accountSales.updateItem}
          removeItem={accountSales.removeItem}
          onSubmit={accountSales.onSubmit}
          allInventories={allInventories}
        />
      )}
    </div>
  );
}

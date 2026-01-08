import { useCallback, useEffect } from "react";
import AccountSalesList from "./AccountSalesLIst";
import CreateAccountSales from "./CreateAccountSales";
import { useAccountSales } from "./hooks/useAccountSales";
import { useInventory } from "@/app/warehousing/components/inventory/hooks/useInventory";
import { useConfirmToast } from "@/app/hooks/useConfirmToast";
import { SalesInvoice } from "./type";
import { useSalesOrders } from "@/app/sales-orders/hooks/useSalesOrders";

export default function AccountSales() {
  const accountSales = useAccountSales();
  const {
    loadProjectName,
    projectName,
    loadCustomerByProject,
    loadOrders,
    orders,
  } = useSalesOrders();
  const { GetInventories, allInventories } = useInventory();
  const confirmToast = useConfirmToast();

  useEffect(() => {
    void loadProjectName();
    void GetInventories();
    void loadOrders();
  }, []);

  useEffect(() => {
    accountSales.GetAccountSales();
  }, [accountSales.page]);

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
          onEdit={(row) => {
            accountSales.loadInvoiceForEdit(row.id);
          }}
          onDelete={handleDelete}
          page={accountSales.page}
          setPage={accountSales.setPage}
          total={accountSales.total}
          limit={accountSales.limit}
        />
      ) : (
        <CreateAccountSales
          saving={accountSales.saving}
          onCancel={() => {
            accountSales.setForm({
              project_id: "",
              customer_id: "",
              customer_name: "",
              sales_order_id: "",
            });

            accountSales.setItems([]);
            accountSales.setEditing(null);
            accountSales.setMode("list");
          }}
          projectsName={projectName}
          salesOrders={orders}
          form={accountSales.form}
          updateForm={accountSales.updateForm}
          items={accountSales.items}
          addItem={accountSales.addItem}
          updateItem={accountSales.updateItem}
          removeItem={accountSales.removeItem}
          onSubmit={accountSales.onSubmit}
          allInventories={allInventories}
          loadCustomerByProject={loadCustomerByProject}
          isEdit={!!accountSales.editing}
        />
      )}
    </div>
  );
}

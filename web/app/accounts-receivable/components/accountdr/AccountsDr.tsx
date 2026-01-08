import { useCallback, useEffect } from "react";

import { useAccountDr } from "./hooks/useAccountDr";
import CreateAccountDr from "./CreateAccountDr";

import AccountList from "./AccountList";
import { useAccountSales } from "../accountsales/hooks/useAccountSales";
import { useConfirmToast } from "@/app/hooks/useConfirmToast";
import { DeliveryReceipt } from "./type";
import { useSalesOrders } from "@/app/sales-orders/hooks/useSalesOrders";

export default function AccountDr() {
  const dr = useAccountDr();
  const { GetAccountSales, allAccountSales } = useAccountSales();
  const confirmToast = useConfirmToast();
  const { loadProjectName, projectName, loadCustomerByProject } =
    useSalesOrders();

  const handleDelete = useCallback(
    (row: DeliveryReceipt) => {
      confirmToast.confirm({
        title: "Delete Sales Invoice",
        message: `Are you sure you want to delete invoice "${row.dr_number}"?`,
        confirmText: "Delete",
        cancelText: "Cancel",
        onConfirm: async () => {
          await dr.deleteAccountDr(row.id);
        },
      });
    },
    [dr.deleteAccountDr, confirmToast]
  );

  useEffect(() => {
    void GetAccountSales();
    void loadProjectName();
    void dr.GetAccountDr();
  }, []);

  return (
    <div className="space-y-6">
      {dr.mode === "list" ? (
        <AccountList
          loading={dr.loading || dr.saving}
          onCreate={() => dr.setMode("create")}
          allAccountDr={dr.allAccountDr}
          onDelete={handleDelete}
          onUpdateStatus={dr.updateDeliveryReceiptStatus}
        />
      ) : (
        <CreateAccountDr
          saving={dr.saving}
          onCancel={() => dr.setMode("list")}
          allAccountSales={allAccountSales}
          projectsName={projectName}
          selectedInvoice={dr.selectedInvoice}
          onSelectInvoice={dr.onSelectInvoice}
          onSubmit={dr.createDeliveryReceipt}
          loadCustomerByProject={loadCustomerByProject}
        />
      )}
    </div>
  );
}

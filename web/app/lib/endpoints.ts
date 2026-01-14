const baseURLLive = "https://api-polaris.innovativecursor.com";
const baseURLDev = "http://localhost:10001";

const isLive = true;
const baseUrl = isLive ? baseURLLive : baseURLDev;

const apiPrefix = "/v1";

const full = (path: string) => `${baseUrl}${apiPrefix}${path}`;

const endpoints = {
  // ---------- AUTH ----------
  auth: {
    health: full("/auth"), // GET "Auth Service Healthy"
    signUpEmail: full("/auth/sign-up-email"), // POST
    signInEmail: full("/auth/sign-in-email"), // POST
    getAllUsers: full("/auth/get-all-user"), // GET
    getAllRoles: full("/auth/get-all-roles"), // GET
    createRole: full("/auth/create-roles"), // POST
    updateUserRoles: full("/auth/update-user-roles"), // POST
  },

  // ---------- PROJECT ----------
  project: {
    create: full("/project/create-project"), // POST
    getAll: (page = 1) => full(`/project/get-all-project?page=${page}`),
    getById: (id: string) => full(`/project/get-project-by/${id}`), // GET
    getCustomerDetails: (id: string) =>
      full(`/project/get-customer-details/${id}`), // GET
    update: (id: string) => full(`/project/edit-project/${id}`), // PUT
    delete: (id: string) => full(`/project/delete-project/${id}`), // DELETE
  },
  projectInfo: {
    getAll: full("/project/get-all-project-info"), // GET
  },
  supplierinvoice: {
    getAll: full("/supplier/invoice/get-all-info"), // GET
  },
  supplierdeliveryR: {
    getAll: full("/supplier/dr/get-all-info"), // GET
  },
  supplierpo: {
    getAll: full("/supplierpo/get-all-info"), // GET
  },
  allmenus: {
    getAll: full("/auth/get-all-menus"), // GET
    getById:  full("/auth/get-menus-by-roles"), // POST
    update: full("/auth/update-menus-of-roles"), // PUT
  },

  // ---------- CUSTOMER ----------
  customer: {
    addOrUpdate: full("/customer/add-update-customer"), // POST
    getAll: full("/customer/get-all-customer"), // GET
    delete: full("/customer/delete-customer"), // DELETE (likely expects body/query id)
  },

  // ---------- QUOTATION ----------
  quotation: {
    upsert: full("/quotation/upsert"), // POST
    toggleStatus: full("/quotation/toggle-status"), // POST
    byCustomer: (customerId: string) =>
      full(`/quotation/customer-quotations/${customerId}`), // GET
    getById: (quotationId: string) =>
      full(`/quotation/get-quotation-by-id/${quotationId}`), // GET
    delete: (quotationId: string) =>
      full(`/quotation/delete-quotation/${quotationId}`), // DELETE
  },

  // ---------- SUPPLIER PURCHASE ORDER ----------
  supplierPO: {
    add: full("/supplierpo/add"), // POST
    update: full("/supplierpo/update"), // PUT
    getAll: (page = 1) => full(`/supplierpo/get-all-supplierpo?page=${page}`), // GET
    getById: (supplierPOId: string) => full(`/supplierpo/${supplierPOId}`), // GET
    delete: (id: string) => full(`/supplierpo/delete-po/${id}`),
    toggleStatus: full("/supplierpo/status"), // PUT
  },

  // ---------- INVENTORY ----------
  inventory: {
    add: full("/inventory/add"), // POST
    getAll: full("/inventory/get"), // GET
    getById: (id: string) => full(`/inventory/get-by/${id}`), // GET
    update: (id: string) => full(`/inventory/update/${id}`), // PUT
    delete: (id: string) => full(`/inventory/delete/${id}`), // DELETE
  },

  // ---------- SALES ORDER ----------
  salesOrder: {
    create: full("/salesorder/create-sales-order"), // POST
    edit: full("/salesorder/edit-sales-order"), // PUT
    getAll: full("/salesorder/get-all-sales-order"), // GET
    getById: (id: string) => full(`/salesorder/get-sales-order-by-id/${id}`), // GET
    delete: full("/salesorder/delete-sales-order"), // DELETE
    addAircon: full("/salesorder/add-aircon"), // POST
    getAircon: full("/salesorder/get-aircon"), // GET
  },

  // ---------- INVOICES ----------
  invoices: {
    add: full("/invoices/add"), // POST
    getAll: full("/invoices/get"), // GET
    getById: (id: string) => full(`/invoices/get-by/${id}`), // GET
    update: (id: string) => full(`/invoices/update/${id}`), // PUT
    delete: (id: string) => full(`/invoices/delete/${id}`), // DELETE
  },

  // ---------- SUPPLIER DELIVERY RECEIPT (DR) ----------
  supplierDR: {
    create: full("/supplier/delivery-r-create"), // POST
    getAll: full("/supplier/dr/get-all"), // GET
    getById: (id: string) => full(`/supplier/dr-get-by-id/${id}`), // GET
    edit: full("/supplier/dr-edit"), // PUT
    delete: full("/supplier/dr-delete"), // DELETE
  },

  // ---------- SUPPLIER INVOICE ----------
  supplierInvoice: {
    create: full("/supplier/invoice-create"), // POST
    getAll: full("/supplier/invoice/get-all"), // GET
    getById: (id: string) => full(`/supplier/invoice-get-by-id/${id}`), // GET
    edit: full("/supplier/invoice-edit"), // PUT
    delete: full("/supplier/invoice-delete"), // DELETE
  },

  // ---------- RECEIVING REPORT (RR) ----------
  receivingReport: {
    create: full("/receiving-r/rr-create"), // POST
    getAll: (page = 1) => full(`/receiving-r/rr-get-all?page=${page}`),
    getById: (id: string) => full(`/receiving-r/rr-get-by-id/${id}`), // GET
    // delete: full("/receiving-r/rr-delete"), // DELETE
    delete: (id: string) => full(`/receiving-r/rr-delete/${id}`),
  },

  // ---------- SUPPLIER MASTER ----------
  supplier: {
    add: full("/supplier/add-supplier"), // POST
    getAll: full("/supplier/get-all-suppliers"), // GET
    getById: (id: string) => full(`/supplier/get-supplier-by-id/${id}`), // GET
    edit: full("/supplier/edit-supplier"), // PUT
    delete: full("/supplier/supplier-delete"), // DELETE
  },

  // ---------- SALES INVOICE ----------
  salesInvoice: {
    create: full("/sales-invoice/create-sales-invoice"), // POST
    getAll: full("/sales-invoice/get-all-sales-invoice"), // GET
    getById: (id: string) =>
      full(`/sales-invoice/get-sales-invoice-by-id/${id}`), // GET
    update: (id: string) => full(`/sales-invoice/update-sales-invoice/${id}`), // PUT
    delete: (id: string) => full(`/sales-invoice/delete-sales-invoice/${id}`), // DELETE
    customerByProject: (projectId: string) =>
      full(`/sales-invoice/customer-by-project/${projectId}`), // GET
  },

  projectinfo: {
    infobyproject: (projectId: string) =>
      full(`/project/all-data-by-project/${projectId}`),
  },

  // ---------- DELIVERY RECEIPT ----------
  deliveryReceipt: {
    create: full("/delivery-receipt/create-delivery-receipt"), // POST
    // getAll: full("/delivery-receipt/get-all-delivery-receipts"), // GET
    getAll: (page = 1) =>
      full(`/delivery-receipt/get-all-delivery-receipts?page=${page}`),

    getById: (id: string) =>
      full(`/delivery-receipt/get-delivery-receipt-by-id/${id}`), // GET
    update: (id: string) =>
      full(`/delivery-receipt/update-delivery-receipt/${id}`), // PUT
    delete: (id: string) =>
      full(`/delivery-receipt/delete-delivery-receipt/${id}`), // DELETE
  },

  // ---------- GENERATE REPORT ----------
  GenerateReport: {
    create: full("/generate-report/generate-report"), // POST
  },
};

export { baseUrl, apiPrefix };
export default endpoints;

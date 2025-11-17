import { useEffect, useMemo, useState } from "react";
import LoginView from "./components/LoginView";
import Sidebar from "./components/Sidebar";
import DashboardHeader from "./components/DashboardHeader";
import StatsGrid from "./components/StatsGrid";
import InventoryPanel from "./components/InventoryPanel";
import WarehousingPanel from "./components/WarehousingPanel";
import PipelinePanel from "./components/PipelinePanel";
import ProjectsPanel from "./components/ProjectsPanel";
import CustomersPanel from "./components/CustomersPanel";
import SalesOrderPanel from "./components/SalesOrderPanel";
import PurchaseOrderPanel from "./components/PurchaseOrderPanel";
import ReceivingReportPanel from "./components/ReceivingReportPanel";
import InvoicePanel from "./components/InvoicePanel";
import DeliveryReceiptPanel from "./components/DeliveryReceiptPanel";
import InventoryCreatePanel from "./components/InventoryCreatePanel";
import SupplierPanel from "./components/SupplierPanel";
import RowActions from "./components/RowActions";
import "./App.css";

const insights = [
  { label: "Cold-chain uptime", value: "99.2%" },
  { label: "Global depots", value: "43" },
  { label: "Avg. response", value: "12m" },
];

const inventoryItems = [
  {
    sku: "SKU-001-AC",
    model: "MX-1200",
    name: "1.5HP Window aircon",
    hp: "1.5",
    type: "Window",
    unit: "Indoor",
  },
  {
    sku: "SKU-002-AC",
    model: "DX-2200",
    name: "2.0HP Ducted split",
    hp: "2.0",
    type: "Ducted",
    unit: "Indoor",
  },
  {
    sku: "SKU-003-AC",
    model: "VRF-4500",
    name: "4.5HP VRF module",
    hp: "4.5",
    type: "VRF",
    unit: "Outdoor",
  },
];

const suppliersData = [
  {
    code: "SUP-1001",
    name: "Metro Supply Co.",
    tin: "123-456-789-012",
    organization: "MetroCool Group",
    location: "APAC",
  },
  {
    code: "SUP-1002",
    name: "Polar Source Trading",
    tin: "234-567-890-123",
    organization: "Polar Nexus Holdings",
    location: "EMEA",
  },
  {
    code: "SUP-1003",
    name: "Skyline Engineering Partners",
    tin: "345-678-901-234",
    organization: "Skyline Retail Group",
    location: "Americas",
  },
];

const deliveryReceiptsData = [
  {
    code: "DR-7001",
    project: "Manila Airport retrofit",
    salesOrder: "SO-1001",
    invoice: "INV-5001",
    status: "Ready",
  },
  {
    code: "DR-7002",
    project: "MetroCool retail rollout",
    salesOrder: "SO-1002",
    invoice: "INV-5002",
    status: "Issued",
  },
];

const supplierInvoices = ["INV-9001", "INV-9002", "INV-9010"];

const invoicesData = [
  {
    code: "INV-5001",
    project: "Manila Airport retrofit",
    customer: "AeroCool Logistics",
    salesOrder: "SO-1001",
    amount: "₱1.42M",
  },
  {
    code: "INV-5002",
    project: "MetroCool retail rollout",
    customer: "MetroCool Services",
    salesOrder: "SO-1002",
    amount: "₱980K",
  },
];

const navItems = [
  { label: "Dashboard", key: "dashboard", icon: "grid" },
  { label: "Projects", key: "projects", icon: "layers" },
  { label: "Customers", key: "customers", icon: "users" },
  { label: "Sales Order", key: "sales-order", icon: "tag" },
  { label: "Purchase Order", key: "purchase-order", icon: "cart" },
  { label: "Warehousing", key: "warehousing", icon: "warehouse" },
  { label: "Accounts Receivable", key: "accounts-receivable", icon: "invoice" },
];

const clients = [
  "AeroCool Logistics",
  "Polar Nexus Holdings",
  "Skyline Retail Group",
  "MetroCool Services",
];

const summaryCards = [
  {
    label: "Available units",
    value: "4,382",
    descriptor: "Ready for deployment",
    trend: "+3.2% vs last week",
  },
  {
    label: "Open sales orders",
    value: "128",
    descriptor: "Awaiting fulfillment",
    trend: "12 urgent",
  },
  {
    label: "Receiving this week",
    value: "26",
    descriptor: "Inbound shipments",
    trend: "6 customs hold",
  },
  {
    label: "Total deliveries",
    value: "2,416",
    descriptor: "Completed YTD",
    trend: "+184 vs plan",
  },
];

const inventoryProducts = [
  { label: "Window aircon", quantity: "1,120", committed: "23%" },
  { label: "Ducted splits", quantity: "2,008", committed: "41%" },
  { label: "Centralized units", quantity: "462", committed: "12%" },
];

const warehousingUpdates = [
  {
    title: "North hub receiving",
    detail: "12 condensing units checked in, 2 flagged for QA",
  },
  {
    title: "Inventory audit",
    detail: "Cycle count complete for VRF modules, variance 0.4%",
  },
  {
    title: "Supplier onboarding",
    detail: "MetroCool contract finalized, ready for PO release",
  },
];

const pipelineStages = [
  {
    label: "Install-ready",
    value: "38 projects",
    detail: "76% materials staged",
  },
  {
    label: "Awaiting shipment",
    value: "19 orders",
    detail: "4 require compliance docs",
  },
  {
    label: "Pending invoicing",
    value: "11 deliveries",
    detail: "ETA within 48h",
  },
];

const projectsData = [
  {
    code: "PRJ-1042",
    name: "Manila Airport retrofit",
    client: "AeroCool Logistics",
    status: "Install-ready",
    region: "APAC",
  },
  {
    code: "PRJ-0987",
    name: "MetroCool retail rollout",
    client: "MetroCool Services",
    status: "Awaiting shipment",
    region: "APAC",
  },
  {
    code: "PRJ-0861",
    name: "Skyline tower commissioning",
    client: "Skyline Retail Group",
    status: "Pending invoicing",
    region: "EMEA",
  },
];

const customersData = [
  {
    id: "CUST-4312",
    name: "AeroCool Logistics",
    organization: "Cold-chain ops",
    location: "APAC",
    tin: "123-456-789-012",
  },
  {
    id: "CUST-2745",
    name: "MetroCool Services",
    organization: "Retail HVAC",
    location: "APAC",
    tin: "234-567-890-123",
  },
  {
    id: "CUST-3920",
    name: "Skyline Retail Group",
    organization: "Commercial",
    location: "EMEA",
    tin: "345-678-901-234",
  },
];

const salesOrdersData = [
  {
    code: "SO-1001",
    project: "Manila Airport retrofit",
    customer: "AeroCool Logistics",
    status: "Approved",
  },
  {
    code: "SO-1002",
    project: "MetroCool retail rollout",
    customer: "MetroCool Services",
    status: "Pending",
  },
  {
    code: "SO-1003",
    project: "Skyline tower commissioning",
    customer: "Skyline Retail Group",
    status: "Pending",
  },
];

const purchaseOrdersData = [
  {
    code: "PO-2001",
    supplier: "Metro Supply Co.",
    project: "Manila Airport retrofit",
    salesOrder: "SO-1001",
    status: "Pending",
  },
  {
    code: "PO-2002",
    supplier: "Polar Source Trading",
    project: "MetroCool retail rollout",
    salesOrder: "SO-1002",
    status: "Approved",
  },
];

const receivingReportsData = [
  {
    code: "RR-3001",
    delivery: "DR-001",
    purchaseOrder: "PO-2001",
    salesOrder: "SO-1001",
    invoice: "INV-5001",
    status: "Draft",
  },
  {
    code: "RR-3002",
    delivery: "DR-002",
    purchaseOrder: "PO-2002",
    salesOrder: "SO-1002",
    invoice: "INV-5002",
    status: "Posted",
  },
];

const getInitialSection = () => {
  if (typeof window === "undefined") return "dashboard";
  const path = window.location.pathname;
  if (path === "/projects") return "projects";
  if (path === "/customers") return "customers";
  if (path === "/sales-order") return "sales-order";
  if (path === "/purchase-order") return "purchase-order";
  if (path === "/receiving-report") return "receiving-report";
  if (path === "/accounts-receivable") return "accounts-receivable";
  if (path === "/sales-invoice") return "sales-invoice";
  if (path === "/delivery-receipt") return "delivery-receipt";
  return "dashboard";
};

const warehousingSections = [
  {
    key: "receiving-report",
    title: "Receiving Report",
    copy: "Log deliveries as they arrive at the depot.",
    accent: "accent-aqua",
    icon: "M4 6h16v11H4z M4 10h16",
    statLabel: "Total logged",
    statValue: "148",
  },
  {
    key: "inventory",
    title: "Inventory",
    copy: "Review on-hand stock across locations.",
    accent: "accent-amber",
    icon: "M6 5h12v14H6z M6 9h12 M6 13h12",
    statLabel: "Units on hand",
    statValue: "4,382",
  },
  {
    key: "add-supplier",
    title: "Add Supplier",
    copy: "Register a new vendor for purchasing.",
    accent: "accent-lilac",
    icon: "M5 12h14M7 9V5h10v4M8 15l4 4 4-4",
    statLabel: "Active suppliers",
    statValue: "62",
  },
  {
    key: "sales-invoice",
    title: "Sales Invoice",
    copy: "Prepare invoices from the warehouse.",
    accent: "accent-coral",
    icon: "M7 4h10l3 4v12H7z M7 8h13",
    statLabel: "Invoices sent",
    statValue: "214",
  },
  {
    key: "delivery-receipt",
    title: "Delivery Receipt",
    copy: "Track items released from the warehouse.",
    accent: "accent-mint",
    icon: "M4 6h16l-2 10H6z M8 16v4h8v-4",
    statLabel: "Receipts issued",
    statValue: "189",
  },
];

const accountsReceivableSections = [
  {
    key: "sales-invoice",
    title: "Sales Invoice",
    copy: "Issue invoices against fulfilled orders.",
    accent: "accent-coral",
    icon: "M7 4h10l3 4v12H7z M7 8h13",
    statLabel: "Invoices sent",
    statValue: "214",
  },
  {
    key: "delivery-receipt",
    title: "Delivery Receipt",
    copy: "Confirm shipments handed to customers.",
    accent: "accent-mint",
    icon: "M4 6h16l-2 10H6z M8 16v4h8v-4",
    statLabel: "Receipts issued",
    statValue: "189",
  },
];

function App() {
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const [expandedNav, setExpandedNav] = useState({ warehousing: true });
  const [activeSection, setActiveSection] = useState(getInitialSection);
  const [projectsMode, setProjectsMode] = useState("list");
  const [customersMode, setCustomersMode] = useState("list");
  const [salesOrderMode, setSalesOrderMode] = useState("list");
  const [purchaseOrderMode, setPurchaseOrderMode] = useState("list");
  const [receivingReportMode, setReceivingReportMode] = useState("list");
  const [invoiceMode, setInvoiceMode] = useState("list");
  const [deliveryReceiptMode, setDeliveryReceiptMode] = useState("list");
  const [inventoryMode, setInventoryMode] = useState("list");
  const [supplierMode, setSupplierMode] = useState("list");
  const projectId = useMemo(
    () => `PRJ-${Math.floor(Math.random() * 9000 + 1000)}`,
    []
  );
  const customerId = useMemo(
    () => `CUST-${Math.floor(Math.random() * 9000 + 1000)}`,
    []
  );

  const handleSubmit = (event) => {
    event.preventDefault();
    setIsAuthenticated(true);
    setActiveSection("dashboard");
  };

  const toggleNavSection = (key) => {
    setExpandedNav((prev) => ({
      ...prev,
      [key]: !prev[key],
    }));
  };

  const applySectionDefaults = (key) => {
    if (key === "projects") {
      setProjectsMode("list");
    }
    if (key === "customers") {
      setCustomersMode("list");
    }
    if (key === "sales-order") {
      setSalesOrderMode("list");
    }
    if (key === "purchase-order") {
      setPurchaseOrderMode("list");
    }
    if (key === "inventory") {
      setInventoryMode("list");
    }
    if (key === "add-supplier") {
      setSupplierMode("list");
    }
    if (key === "receiving-report") {
      setReceivingReportMode("list");
    }
    if (key === "sales-invoice") {
      setInvoiceMode("list");
    }
    if (key === "delivery-receipt") {
      setDeliveryReceiptMode("list");
    }
  };

  const navigateToSection = (key) => {
    applySectionDefaults(key);
    setActiveSection(key);
  };

  const handleNavSelect = (key) => {
    navigateToSection(key);
  };

  const handleLogout = () => {
    setIsAuthenticated(false);
    setActiveSection("dashboard");
  };

  const handleAddCustomer = () => {
    setActiveSection("customers");
    setCustomersMode("create");
  };

  useEffect(() => {
    if (!isAuthenticated) return;
    let nextPath = "/";
    if (activeSection === "projects") nextPath = "/projects";
    if (activeSection === "customers") nextPath = "/customers";
    if (activeSection === "sales-order") nextPath = "/sales-order";
    if (activeSection === "purchase-order") nextPath = "/purchase-order";
    if (activeSection === "receiving-report") nextPath = "/receiving-report";
    if (activeSection === "accounts-receivable")
      nextPath = "/accounts-receivable";
    if (activeSection === "sales-invoice") nextPath = "/sales-invoice";
    if (activeSection === "delivery-receipt") nextPath = "/delivery-receipt";
    window.history.replaceState({}, "", nextPath);
  }, [activeSection, isAuthenticated]);

  if (!isAuthenticated) {
    return <LoginView insights={insights} onSubmit={handleSubmit} />;
  }

  return (
    <div className="dashboard-page">
      <Sidebar
        navItems={navItems}
        expandedNav={expandedNav}
        onToggleSection={toggleNavSection}
        onSelect={handleNavSelect}
        activeKey={activeSection}
        onLogout={handleLogout}
      />

      <main className="dashboard-main">
        <DashboardHeader
          title="Polaris Airtech Prime Corporation"
          userName="Ma'am Che"
        />

        {activeSection === "projects" && projectsMode === "list" && (
          <section className="panel-card wide">
            <div className="panel-header">
              <div>
                <p className="eyebrow">Projects</p>
                <h3>Project Portfolio</h3>
              </div>
              <button
                type="button"
                className="primary-btn"
                onClick={() => setProjectsMode("create")}
              >
                Create project
              </button>
            </div>
            <div className="entity-table-wrapper">
              <table className="entity-table">
                <thead>
                  <tr>
                    <th>Project ID</th>
                    <th>Project name</th>
                    <th>Customer</th>
                    <th>Status</th>
                    <th>Region</th>
                    <th>Actions</th>
                  </tr>
                </thead>
                <tbody>
                  {projectsData.map((project) => (
                    <tr key={project.code}>
                      <td>{project.code}</td>
                      <td>{project.name}</td>
                      <td>{project.client}</td>
                      <td>{project.status}</td>
                      <td>{project.region}</td>
                      <td>
                        <RowActions />
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </section>
        )}

        {activeSection === "projects" && projectsMode === "create" && (
          <ProjectsPanel
            projectId={projectId}
            clients={clients}
            onAddCustomer={handleAddCustomer}
          />
        )}

        {activeSection === "customers" && customersMode === "list" && (
          <section className="panel-card wide">
            <div className="panel-header">
              <div>
                <p className="eyebrow">Customers</p>
                <h3>Customer Registry</h3>
              </div>
              <button
                type="button"
                className="primary-btn"
                onClick={() => setCustomersMode("create")}
              >
                Add customer
              </button>
            </div>
            <div className="entity-table-wrapper">
              <table className="entity-table">
                <thead>
                  <tr>
                    <th>Customer ID</th>
                    <th>Customer name</th>
                    <th>Organization</th>
                    <th>Location</th>
                    <th>TIN</th>
                    <th>Actions</th>
                  </tr>
                </thead>
                <tbody>
                  {customersData.map((customer) => (
                    <tr key={customer.id}>
                      <td>{customer.id}</td>
                      <td>{customer.name}</td>
                      <td>{customer.organization}</td>
                      <td>{customer.location}</td>
                      <td>{customer.tin}</td>
                      <td>
                        <RowActions />
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </section>
        )}

        {activeSection === "customers" && customersMode === "create" && (
          <CustomersPanel customerId={customerId} />
        )}

        {activeSection === "sales-order" && salesOrderMode === "list" && (
          <section className="panel-card wide">
            <div className="panel-header">
              <div>
                <p className="eyebrow">Sales Orders</p>
                <h3>Sales Order Registry</h3>
              </div>
              <button
                type="button"
                className="primary-btn"
                onClick={() => setSalesOrderMode("create")}
              >
                Create sales order
              </button>
            </div>
            <div className="entity-table-wrapper">
              <table className="entity-table">
                <thead>
                  <tr>
                    <th>Sales Order ID</th>
                    <th>Project name</th>
                    <th>Customer name</th>
                    <th>Status</th>
                    <th>Actions</th>
                  </tr>
                </thead>
                <tbody>
                  {salesOrdersData.map((order) => (
                    <tr key={order.code}>
                      <td>{order.code}</td>
                      <td>{order.project}</td>
                      <td>{order.customer}</td>
                      <td>
                        <span
                          className={`status-pill status-pill--${order.status.toLowerCase()}`}
                        >
                          {order.status}
                        </span>
                      </td>
                      <td>
                        <RowActions />
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </section>
        )}

        {activeSection === "sales-order" && salesOrderMode === "create" && (
          <SalesOrderPanel />
        )}

        {activeSection === "purchase-order" && purchaseOrderMode === "list" && (
          <section className="panel-card wide">
            <div className="panel-header">
              <div>
                <p className="eyebrow">Purchase Orders</p>
                <h3>Purchase Order Registry</h3>
              </div>
              <button
                type="button"
                className="primary-btn"
                onClick={() => setPurchaseOrderMode("create")}
              >
                Create purchase order
              </button>
            </div>
            <div className="entity-table-wrapper">
              <table className="entity-table">
                <thead>
                  <tr>
                    <th>Purchase Order ID</th>
                    <th>Supplier</th>
                    <th>Project name</th>
                    <th>Sales order</th>
                    <th>Status</th>
                    <th>Actions</th>
                  </tr>
                </thead>
                <tbody>
                  {purchaseOrdersData.map((po) => (
                    <tr key={po.code}>
                      <td>{po.code}</td>
                      <td>{po.supplier}</td>
                      <td>{po.project}</td>
                      <td>{po.salesOrder}</td>
                      <td>
                        <span
                          className={`status-pill status-pill--${po.status.toLowerCase()}`}
                        >
                          {po.status}
                        </span>
                      </td>
                      <td>
                        <RowActions />
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </section>
        )}

        {activeSection === "purchase-order" &&
          purchaseOrderMode === "create" && <PurchaseOrderPanel />}

        {activeSection === "inventory" && inventoryMode === "list" && (
          <section className="panel-card wide">
            <div className="panel-header">
              <div>
                <p className="eyebrow">Warehousing</p>
                <h3>Inventory Registry</h3>
              </div>
              <button
                type="button"
                className="primary-btn"
                onClick={() => setInventoryMode("create")}
              >
                Add inventory
              </button>
            </div>
            <div className="entity-table-wrapper">
              <table className="entity-table">
                <thead>
                  <tr>
                    <th>SKU</th>
                    <th>Model number</th>
                    <th>Aircon name</th>
                    <th>HP</th>
                    <th>Type</th>
                    <th>Unit</th>
                    <th>Actions</th>
                  </tr>
                </thead>
                <tbody>
                  {inventoryItems.map((item) => (
                    <tr key={item.sku}>
                      <td>{item.sku}</td>
                      <td>{item.model}</td>
                      <td>{item.name}</td>
                      <td>{item.hp}</td>
                      <td>{item.type}</td>
                      <td>{item.unit}</td>
                      <td>
                        <RowActions />
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </section>
        )}

        {activeSection === "inventory" && inventoryMode === "create" && (
          <InventoryCreatePanel onClose={() => setInventoryMode("list")} />
        )}

        {activeSection === "add-supplier" && supplierMode === "list" && (
          <section className="panel-card wide">
            <div className="panel-header">
              <div>
                <p className="eyebrow">Warehousing</p>
                <h3>Supplier Registry</h3>
              </div>
              <button
                type="button"
                className="primary-btn"
                onClick={() => setSupplierMode("create")}
              >
                Add supplier
              </button>
            </div>
            <div className="entity-table-wrapper">
              <table className="entity-table">
                <thead>
                  <tr>
                    <th>Supplier code</th>
                    <th>Supplier name</th>
                    <th>TIN number</th>
                    <th>Organization</th>
                    <th>Location</th>
                    <th>Actions</th>
                  </tr>
                </thead>
                <tbody>
                  {suppliersData.map((supplier) => (
                    <tr key={supplier.code}>
                      <td>{supplier.code}</td>
                      <td>{supplier.name}</td>
                      <td>{supplier.tin}</td>
                      <td>{supplier.organization}</td>
                      <td>{supplier.location}</td>
                      <td>
                        <RowActions />
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </section>
        )}

        {activeSection === "add-supplier" && supplierMode === "create" && (
          <SupplierPanel onClose={() => setSupplierMode("list")} />
        )}

        {activeSection === "receiving-report" &&
          receivingReportMode === "list" && (
            <section className="panel-card wide">
              <div className="panel-header">
                <div>
                  <p className="eyebrow">Warehousing</p>
                  <h3>Receiving Report Registry</h3>
                </div>
                <button
                  type="button"
                  className="primary-btn"
                  onClick={() => setReceivingReportMode("create")}
                >
                  Create receiving report
                </button>
              </div>
              <div className="entity-table-wrapper">
                <table className="entity-table">
                  <thead>
                    <tr>
                      <th>Receiving Report ID</th>
                      <th>Delivery receipt</th>
                      <th>Purchase order</th>
                      <th>Sales order</th>
                      <th>Supplier invoice</th>
                      <th>Status</th>
                      <th>Actions</th>
                    </tr>
                  </thead>
                  <tbody>
                    {receivingReportsData.map((report) => (
                      <tr key={report.code}>
                        <td>{report.code}</td>
                        <td>{report.delivery}</td>
                        <td>{report.purchaseOrder}</td>
                        <td>{report.salesOrder}</td>
                        <td>{report.invoice}</td>
                        <td>{report.status}</td>
                        <td>
                          <RowActions />
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </section>
          )}

        {activeSection === "receiving-report" &&
          receivingReportMode === "create" && (
            <ReceivingReportPanel
              deliveryReceipts={deliveryReceiptsData}
              purchaseOrders={purchaseOrdersData}
              salesOrders={salesOrdersData}
              supplierInvoices={supplierInvoices}
              onClose={() => setReceivingReportMode("list")}
            />
          )}

        {activeSection === "warehousing" && (
          <section className="panel-card wide">
            <div className="panel-header">
              <div>
                <p className="eyebrow">Warehousing</p>
                <h3>Warehouse Operations</h3>
              </div>
            </div>
            <div className="warehousing-hub">
              {warehousingSections.map((section) => (
                <button
                  key={section.key}
                  type="button"
                  className={`warehousing-card ${section.accent}`}
                  onClick={() => navigateToSection(section.key)}
                >
                  <div className="warehousing-card__content">
                    <span className="warehousing-card__icon" aria-hidden="true">
                      <svg
                        viewBox="0 0 24 24"
                        fill="none"
                        stroke="currentColor"
                        strokeWidth="1.8"
                      >
                        <path
                          d={section.icon}
                          strokeLinecap="round"
                          strokeLinejoin="round"
                        />
                      </svg>
                    </span>
                    <div className="warehousing-card__copy">
                      <h4>{section.title}</h4>
                      <p>{section.copy}</p>
                    </div>
                  </div>
                  <div className="warehousing-card__stat">
                    <p>{section.statLabel}</p>
                    <strong>{section.statValue}</strong>
                  </div>
                </button>
              ))}
            </div>
          </section>
        )}

        {activeSection === "accounts-receivable" && (
          <section className="panel-card wide">
            <div className="panel-header">
              <div>
                <p className="eyebrow">Accounts Receivable</p>
                <h3>Billing & Dispatch</h3>
              </div>
            </div>
            <div className="warehousing-hub">
              {accountsReceivableSections.map((section) => (
                <button
                  key={section.key}
                  type="button"
                  className={`warehousing-card ${section.accent}`}
                  onClick={() => navigateToSection(section.key)}
                >
                  <div className="warehousing-card__content">
                    <span className="warehousing-card__icon" aria-hidden="true">
                      <svg
                        viewBox="0 0 24 24"
                        fill="none"
                        stroke="currentColor"
                        strokeWidth="1.8"
                      >
                        <path
                          d={section.icon}
                          strokeLinecap="round"
                          strokeLinejoin="round"
                        />
                      </svg>
                    </span>
                    <div className="warehousing-card__copy">
                      <h4>{section.title}</h4>
                      <p>{section.copy}</p>
                    </div>
                  </div>
                  <div className="warehousing-card__stat">
                    <p>{section.statLabel}</p>
                    <strong>{section.statValue}</strong>
                  </div>
                </button>
              ))}
            </div>
          </section>
        )}

        {activeSection === "sales-invoice" && invoiceMode === "list" && (
          <section className="panel-card wide">
            <div className="panel-header">
              <div>
                <p className="eyebrow">Accounts Receivable</p>
                <h3>Sales Invoice Registry</h3>
              </div>
              <button
                type="button"
                className="primary-btn"
                onClick={() => setInvoiceMode("create")}
              >
                Create invoice
              </button>
            </div>
            <div className="entity-table-wrapper">
              <table className="entity-table">
                <thead>
                  <tr>
                    <th>Invoice ID</th>
                    <th>Project</th>
                    <th>Customer</th>
                    <th>Sales order</th>
                    <th>Amount</th>
                    <th>Actions</th>
                  </tr>
                </thead>
                <tbody>
                  {invoicesData.map((invoice) => (
                    <tr key={invoice.code}>
                      <td>{invoice.code}</td>
                      <td>{invoice.project}</td>
                      <td>{invoice.customer}</td>
                      <td>{invoice.salesOrder}</td>
                      <td>{invoice.amount}</td>
                      <td>
                        <RowActions />
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </section>
        )}

        {activeSection === "sales-invoice" && invoiceMode === "create" && (
          <InvoicePanel
            projects={projectsData}
            salesOrders={salesOrdersData}
            onClose={() => setInvoiceMode("list")}
          />
        )}

        {activeSection === "delivery-receipt" &&
          deliveryReceiptMode === "list" && (
            <section className="panel-card wide">
              <div className="panel-header">
                <div>
                  <h3>Delivery Receipt Registry</h3>
                </div>
                <button
                  type="button"
                  className="primary-btn"
                  onClick={() => setDeliveryReceiptMode("create")}
                >
                  Create delivery receipt
                </button>
              </div>
              <div className="entity-table-wrapper">
                <table className="entity-table">
                  <thead>
                    <tr>
                      <th>Delivery Receipt ID</th>
                      <th>Project</th>
                      <th>Sales order</th>
                      <th>Sales invoice</th>
                      <th>Status</th>
                      <th>Actions</th>
                    </tr>
                  </thead>
                  <tbody>
                    {deliveryReceiptsData.map((receipt) => (
                      <tr key={receipt.code}>
                        <td>{receipt.code}</td>
                        <td>{receipt.project}</td>
                        <td>{receipt.salesOrder}</td>
                        <td>{receipt.invoice}</td>
                        <td>{receipt.status}</td>
                        <td>
                          <RowActions />
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </section>
          )}

        {activeSection === "delivery-receipt" &&
          deliveryReceiptMode === "create" && (
            <DeliveryReceiptPanel
              projects={projectsData}
              salesOrders={salesOrdersData}
              invoices={invoicesData}
              customers={customersData}
              onClose={() => setDeliveryReceiptMode("list")}
            />
          )}

        {activeSection === "dashboard" && (
          <>
            <StatsGrid cards={summaryCards} />

            <section className="panels-grid">
              <InventoryPanel products={inventoryProducts} />
              <WarehousingPanel updates={warehousingUpdates} />
              <PipelinePanel stages={pipelineStages} />
            </section>
          </>
        )}
      </main>
    </div>
  );
}

export default App;

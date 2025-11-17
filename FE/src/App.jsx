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
import RowActions from "./components/RowActions";
import "./App.css";

const insights = [
  { label: "Cold-chain uptime", value: "99.2%" },
  { label: "Global depots", value: "43" },
  { label: "Avg. response", value: "12m" },
];

const navItems = [
  { label: "Dashboard", key: "dashboard", icon: "grid" },
  { label: "Projects", key: "projects", icon: "layers" },
  { label: "Customers", key: "customers", icon: "users" },
  { label: "Sales Order", key: "sales-order", icon: "tag" },
  { label: "Purchase Order", key: "purchase-order", icon: "cart" },
  {
    label: "Warehousing",
    key: "warehousing",
    icon: "warehouse",
    children: [
      { label: "Receiving report", key: "receiving-report" },
      { label: "Inventory", key: "inventory" },
      { label: "Add supplier", key: "add-supplier" },
      { label: "Sales invoice", key: "wh-sales-invoice" },
      { label: "Delivery receipt", key: "wh-delivery-receipt" },
    ],
  },
  { label: "Sales Invoice", key: "sales-invoice", icon: "invoice" },
  { label: "Delivery Receipt", key: "delivery-receipt", icon: "ship" },
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

const getInitialSection = () => {
  if (typeof window === "undefined") return "dashboard";
  const path = window.location.pathname;
  if (path === "/projects") return "projects";
  if (path === "/customers") return "customers";
  return "dashboard";
};

function App() {
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const [expandedNav, setExpandedNav] = useState({ warehousing: true });
  const [activeSection, setActiveSection] = useState(getInitialSection);
  const [projectsMode, setProjectsMode] = useState("list");
  const [customersMode, setCustomersMode] = useState("list");
  const [salesOrderMode, setSalesOrderMode] = useState("list");
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

  const handleNavSelect = (key) => {
    setActiveSection(key);
    if (key === "projects") {
      setProjectsMode("list");
    }
    if (key === "customers") {
      setCustomersMode("list");
    }
    if (key === "sales-order") {
      setSalesOrderMode("list");
    }
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
          title="HVAC Distribution Control Center"
          userName="Ma'am J"
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

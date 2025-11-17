import { useMemo, useState } from "react";
import ProjectCard from "./ProjectCard";
import ProjectFieldGrid from "./ProjectFieldGrid";

const DeliveryReceiptPanel = ({
  projects,
  salesOrders,
  invoices,
  customers,
  onClose,
}) => {
  const [selectedProject, setSelectedProject] = useState("");
  const [selectedSalesOrder, setSelectedSalesOrder] = useState("");
  const [selectedInvoice, setSelectedInvoice] = useState("");
  const [customerName, setCustomerName] = useState("");
  const [customerOrg, setCustomerOrg] = useState("");
  const [customerTin, setCustomerTin] = useState("");
  const [customerLocation, setCustomerLocation] = useState("");

  const salesOrdersForProject = useMemo(() => {
    if (!selectedProject) return salesOrders;
    const project = projects.find((p) => p.code === selectedProject);
    if (!project) return salesOrders;
    return salesOrders.filter((order) => order.project === project.name);
  }, [projects, salesOrders, selectedProject]);

  const invoicesForSelection = useMemo(() => {
    if (!selectedSalesOrder) {
      if (!selectedProject) return invoices;
      const project = projects.find((p) => p.code === selectedProject);
      if (!project) return invoices;
      return invoices.filter((invoice) => invoice.project === project.name);
    }
    return invoices.filter(
      (invoice) => invoice.salesOrder === selectedSalesOrder
    );
  }, [invoices, projects, selectedProject, selectedSalesOrder]);

  const handleProjectChange = (event) => {
    const code = event.target.value;
    setSelectedProject(code);
    setSelectedSalesOrder("");
    setSelectedInvoice("");
    const project = projects.find((p) => p.code === code);
    if (project) {
      const customer = customers.find((c) => c.name === project.client);
      setCustomerName(customer ? customer.name : project.client || "");
      setCustomerOrg(customer?.organization || "");
      setCustomerTin(customer?.tin || "");
      setCustomerLocation(customer?.location || "");
    } else {
      setCustomerName("");
      setCustomerOrg("");
      setCustomerTin("");
      setCustomerLocation("");
    }
  };

  const handleSalesOrderChange = (event) => {
    setSelectedSalesOrder(event.target.value);
    setSelectedInvoice("");
  };

  return (
    <ProjectCard title="Create delivery receipt">
      <form className="projects-form">
        <ProjectFieldGrid>
          <label className="projects-field">
            <span>Select project</span>
            <select value={selectedProject} onChange={handleProjectChange}>
              <option value="" disabled>
                Choose a project
              </option>
              {projects.map((project) => (
                <option key={project.code} value={project.code}>
                  {project.name}
                </option>
              ))}
            </select>
          </label>
          <label className="projects-field">
            <span>Select sales order</span>
            <select
              value={selectedSalesOrder}
              onChange={handleSalesOrderChange}
            >
              <option value="" disabled>
                Choose a sales order
              </option>
              {salesOrdersForProject.map((order) => (
                <option key={order.code} value={order.code}>
                  {order.code}
                </option>
              ))}
            </select>
          </label>
          <label className="projects-field">
            <span>Select sales invoice</span>
            <select
              value={selectedInvoice}
              onChange={(event) => setSelectedInvoice(event.target.value)}
            >
              <option value="" disabled>
                Choose a sales invoice
              </option>
              {invoicesForSelection.map((invoice) => (
                <option key={invoice.code} value={invoice.code}>
                  {invoice.code}
                </option>
              ))}
            </select>
          </label>
        </ProjectFieldGrid>

        <ProjectFieldGrid>
          <label className="projects-field">
            <span>Customer</span>
            <input
              type="text"
              value={customerName}
              readOnly
              placeholder="Auto-filled"
            />
          </label>
          <label className="projects-field">
            <span>Customer organization</span>
            <input
              type="text"
              value={customerOrg}
              readOnly
              placeholder="Auto-filled"
            />
          </label>
          <label className="projects-field">
            <span>Customer TIN</span>
            <input
              type="text"
              value={customerTin}
              readOnly
              placeholder="Auto-filled"
            />
          </label>
          <label className="projects-field">
            <span>Customer location</span>
            <input
              type="text"
              value={customerLocation}
              readOnly
              placeholder="Auto-filled"
            />
          </label>
        </ProjectFieldGrid>

        <div className="projects-actions">
          <button type="button" className="ghost-btn" onClick={onClose}>
            Cancel
          </button>
          <button type="submit" className="primary-btn">
            Save delivery receipt
          </button>
        </div>
      </form>
    </ProjectCard>
  );
};

export default DeliveryReceiptPanel;

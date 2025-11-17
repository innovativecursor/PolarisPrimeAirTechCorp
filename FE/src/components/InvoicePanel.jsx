import { useMemo, useState } from "react";
import ProjectCard from "./ProjectCard";
import ProjectFieldGrid from "./ProjectFieldGrid";
import InvoiceItemRow from "./InvoiceItemRow";

const InvoicePanel = ({ projects, salesOrders, onClose }) => {
  const [selectedProject, setSelectedProject] = useState("");
  const [customerName, setCustomerName] = useState("");
  const [selectedSalesOrder, setSelectedSalesOrder] = useState("");
  const [lines, setLines] = useState([0]);

  const salesOrdersForProject = useMemo(() => {
    if (!selectedProject) return salesOrders;
    const project = projects.find((p) => p.code === selectedProject);
    if (!project) return salesOrders;
    return salesOrders.filter((order) => order.project === project.name);
  }, [projects, salesOrders, selectedProject]);

  const handleProjectChange = (event) => {
    const code = event.target.value;
    setSelectedProject(code);
    const project = projects.find((p) => p.code === code);
    setCustomerName(project ? project.client : "");
    setSelectedSalesOrder("");
  };

  const handleAddLine = () => {
    setLines((prev) => [...prev, prev.length]);
  };

  const handleRemoveLine = (id) => {
    setLines((prev) => prev.filter((lineId) => lineId !== id));
  };

  return (
    <ProjectCard title="Create invoice" eyebrow="Accounts Receivable">
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
            <span>Customer</span>
            <input
              type="text"
              value={customerName}
              readOnly
              placeholder="Auto-filled"
            />
          </label>
          <label className="projects-field">
            <span>Select sales order</span>
            <select
              value={selectedSalesOrder}
              onChange={(event) => setSelectedSalesOrder(event.target.value)}
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
        </ProjectFieldGrid>

        {lines.map((id, index) => (
          <InvoiceItemRow
            key={id}
            canRemove={lines.length > 1}
            onRemove={() => handleRemoveLine(id)}
          />
        ))}

        <div className="sales-add-row">
          <button
            type="button"
            className="projects-inline-btn projects-inline-btn--icon projects-inline-btn--sm"
            onClick={handleAddLine}
            aria-label="Add invoice item"
          >
            +
          </button>
        </div>

        <div className="projects-actions">
          <button type="button" className="ghost-btn" onClick={onClose}>
            Cancel
          </button>
          <button type="submit" className="primary-btn">
            Save invoice
          </button>
        </div>
      </form>
    </ProjectCard>
  );
};

export default InvoicePanel;

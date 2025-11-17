import { useState } from "react";
import ProjectCard from "./ProjectCard";
import ProjectFieldGrid from "./ProjectFieldGrid";
import PurchaseOrderItemRow from "./PurchaseOrderItemRow";

const PurchaseOrderPanel = () => {
  const [lines, setLines] = useState([0]);

  const handleAddLine = () => {
    setLines((prev) => [...prev, prev.length]);
  };

  const handleRemoveLine = (id) => {
    setLines((prev) => prev.filter((lineId) => lineId !== id));
  };

  return (
    <>
      <ProjectCard
        title="Create Purchase Order"
        eyebrow="Purchase Orders"
        actions={
          <div className="projects-card__actions-group">
            <button
              type="button"
              className="ghost-btn ghost-btn--subtle"
              aria-label="Import purchase order from Excel"
            >
              Import purchase order
            </button>
            <button
              type="button"
              className="ghost-btn ghost-btn--subtle"
              aria-label="Export purchase order to Excel"
            >
              Export purchase order
            </button>
          </div>
        }
      >
        <form className="projects-form">
          <ProjectFieldGrid>
            <label className="projects-field">
              <span>Select supplier</span>
              <select defaultValue="">
                <option value="" disabled>
                  Choose a supplier
                </option>
                <option value="metro-supply">Metro Supply Co.</option>
                <option value="polar-source">Polar Source Trading</option>
              </select>
            </label>
            <label className="projects-field">
              <span>Select project</span>
              <select defaultValue="">
                <option value="" disabled>
                  Choose a project
                </option>
                <option value="prj-1042">Manila Airport retrofit</option>
                <option value="prj-0987">MetroCool retail rollout</option>
              </select>
            </label>
            <label className="projects-field">
              <span>Select sales order</span>
              <select defaultValue="">
                <option value="" disabled>
                  Link a sales order
                </option>
                <option value="so-1001">SO-1001</option>
                <option value="so-1002">SO-1002</option>
              </select>
            </label>
          </ProjectFieldGrid>
        </form>
      </ProjectCard>

      <ProjectCard title="Items to purchase" eyebrow="Purchase Orders">
        <form className="projects-form">
          {lines.map((id) => (
            <PurchaseOrderItemRow
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
              aria-label="Add another purchase line"
            >
              +
            </button>
          </div>
        </form>
      </ProjectCard>
    </>
  );
};

export default PurchaseOrderPanel;

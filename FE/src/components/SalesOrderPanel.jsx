import { useState } from "react";
import ProjectCard from "./ProjectCard";
import ProjectFieldGrid from "./ProjectFieldGrid";
import SalesOrderItemRow from "./SalesOrderItemRow";

const SalesOrderPanel = () => {
  const [lines, setLines] = useState([0]);

  const handleAddLine = () => {
    setLines((prev) => [...prev, prev.length]);
  };

  const handleRemoveLine = (id) => {
    setLines((prev) => prev.filter((lineId) => lineId !== id));
  };

  return (
    <ProjectCard title="Create Sales Order" eyebrow="Sales Orders">
      <form className="projects-form">
        <ProjectFieldGrid>
          <label className="projects-field">
            <span>Project name</span>
            <input type="text" placeholder="Eg. Manila Airport retrofit" />
          </label>
          <label className="projects-field">
            <span>Customer name</span>
            <input type="text" placeholder="Eg. AeroCool Logistics" />
          </label>
          <div />
        </ProjectFieldGrid>
        {lines.map((id, index) => (
          <SalesOrderItemRow
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
            aria-label="Add another aircon line"
          >
            +
          </button>
        </div>
        <div className="projects-actions">
          <button type="button" className="ghost-btn">
            Cancel
          </button>
          <button type="submit" className="primary-btn">
            Save sales order
          </button>
        </div>
      </form>
    </ProjectCard>
  );
};

export default SalesOrderPanel;

import ProjectCard from "./ProjectCard";
import ProjectFieldGrid from "./ProjectFieldGrid";

const InventoryCreatePanel = ({ onClose }) => (
  <ProjectCard title="Add inventory" eyebrow="Warehousing">
    <form className="projects-form">
      <div className="scan-field">
        <span className="scan-field__label">Scan barcode</span>
        <p className="scan-field__helper">
          Use camera or scanner to capture SKU barcode.
        </p>
      </div>

      <ProjectFieldGrid>
        <label className="projects-field">
          <span>SKU</span>
          <input type="text" placeholder="Auto-generated" readOnly />
        </label>
        <label className="projects-field">
          <span>Aircon model number</span>
          <input type="text" placeholder="Eg. MX-1200" />
        </label>
        <label className="projects-field">
          <span>Aircon name</span>
          <input type="text" placeholder="Eg. 1.5HP Window aircon" />
        </label>
        <label className="projects-field">
          <span>HP (Horsepower)</span>
          <input type="number" min="0" step="0.5" placeholder="1.5" />
        </label>
        <label className="projects-field">
          <span>Type of aircon</span>
          <select defaultValue="">
            <option value="" disabled>
              Select type
            </option>
            <option value="window">Window</option>
            <option value="split">Split</option>
            <option value="ducted">Ducted</option>
            <option value="vrf">VRF</option>
          </select>
        </label>
        <label className="projects-field">
          <span>Indoor / outdoor unit</span>
          <select defaultValue="">
            <option value="" disabled>
              Select unit type
            </option>
            <option value="indoor">Indoor unit</option>
            <option value="outdoor">Outdoor unit</option>
          </select>
        </label>
        <div />
        <div />
        <div />
      </ProjectFieldGrid>

      <div className="projects-actions">
        <button type="button" className="ghost-btn" onClick={onClose}>
          Cancel
        </button>
        <button type="submit" className="primary-btn">
          Save inventory
        </button>
      </div>
    </form>
  </ProjectCard>
);

export default InventoryCreatePanel;

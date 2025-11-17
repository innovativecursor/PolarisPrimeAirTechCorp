import ProjectCard from "./ProjectCard";
import ProjectFieldGrid from "./ProjectFieldGrid";

const SupplierPanel = ({ onClose }) => (
  <ProjectCard title="Add supplier" eyebrow="Warehousing">
    <form className="projects-form">
      <ProjectFieldGrid>
        <label className="projects-field">
          <span>Supplier name</span>
          <input type="text" placeholder="Eg. Metro Supply Co." />
        </label>
        <label className="projects-field">
          <span>Supplier code</span>
          <input type="text" placeholder="Eg. SUP-1001" />
        </label>
        <label className="projects-field">
          <span>TIN number</span>
          <input type="text" placeholder="123-456-789-012" />
        </label>
      </ProjectFieldGrid>
      <ProjectFieldGrid>
        <label className="projects-field">
          <span>Organization name</span>
          <input type="text" placeholder="Legal entity or business unit" />
        </label>
        <label className="projects-field">
          <span>Location</span>
          <select defaultValue="">
            <option value="" disabled>
              Choose a location
            </option>
            <option value="apac">APAC</option>
            <option value="emea">EMEA</option>
            <option value="americas">Americas</option>
          </select>
        </label>
        <div />
      </ProjectFieldGrid>
      <div className="projects-actions">
        <button type="button" className="ghost-btn" onClick={onClose}>
          Cancel
        </button>
        <button type="submit" className="primary-btn">
          Save supplier
        </button>
      </div>
    </form>
  </ProjectCard>
);

export default SupplierPanel;

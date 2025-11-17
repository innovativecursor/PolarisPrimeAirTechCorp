import ProjectCard from "./ProjectCard";
import ProjectFieldGrid from "./ProjectFieldGrid";

const CustomersPanel = ({ customerId }) => (
  <ProjectCard title="Add new customer" eyebrow="Customers">
    <form className="projects-form">
      <ProjectFieldGrid>
        <label className="projects-field">
          <span>Customer ID</span>
          <input type="text" value={customerId} readOnly />
        </label>
        <label className="projects-field">
          <span>Customer name</span>
          <input type="text" placeholder="Eg. MetroCool Services" />
        </label>
        <label className="projects-field">
          <span>Customer location</span>
          <select defaultValue="">
            <option value="" disabled>
              Choose a location
            </option>
            <option value="apac">APAC</option>
            <option value="emea">EMEA</option>
            <option value="americas">Americas</option>
          </select>
        </label>
      </ProjectFieldGrid>
      <ProjectFieldGrid>
        <label className="projects-field">
          <span>TIN number</span>
          <input
            type="text"
            placeholder="123-456-789-012"
            pattern="\d{3}-\d{3}-\d{3}-\d{3}"
            inputMode="numeric"
          />
        </label>
        <label className="projects-field">
          <span>Customer organization</span>
          <input type="text" placeholder="Business unit" />
        </label>
        <div />
      </ProjectFieldGrid>
      <div className="projects-actions">
        <button type="button" className="ghost-btn">
          Cancel
        </button>
        <button type="submit" className="primary-btn">
          Save customer
        </button>
      </div>
    </form>
  </ProjectCard>
);

export default CustomersPanel;

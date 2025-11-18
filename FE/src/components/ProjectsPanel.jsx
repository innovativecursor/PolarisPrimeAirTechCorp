import ProjectCard from "./ProjectCard";
import ProjectFieldGrid from "./ProjectFieldGrid";

const ProjectsPanel = ({
  projectId,
  project,
  mode = "create",
  clients,
  onAddCustomer,
  onClose,
}) => {
  const isEditMode = mode === "edit";
  const heading = isEditMode ? "Edit project" : "Create new project";
  const submitLabel = isEditMode ? "Save project" : "Create project";
  return (
    <ProjectCard title={heading} eyebrow="Projects">
      <form className="projects-form">
        <ProjectFieldGrid>
          <label className="projects-field">
            <span>Project ID</span>
            <input type="text" value={project?.code ?? projectId} readOnly />
          </label>
          <label className="projects-field">
            <span>Project name</span>
            <input
              type="text"
              placeholder="Eg. Manila Airport retrofit"
              defaultValue={project?.name ?? ""}
            />
          </label>
          <label className="projects-field">
            <span>Select customer</span>
            <div className="projects-field__row">
              <select defaultValue="">
                <option value="" disabled>
                  Choose a client
                </option>
                {clients.map((client) => (
                  <option key={client} value={client}>
                    {client}
                  </option>
                ))}
              </select>
              <button
                type="button"
                className="projects-inline-btn projects-inline-btn--icon"
                onClick={onAddCustomer}
                aria-label="Add new customer"
              >
                +
              </button>
            </div>
          </label>
        </ProjectFieldGrid>
        <ProjectFieldGrid>
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
          <label className="projects-field">
            <span>Customer organization</span>
            <input
              type="text"
              value={project?.client ?? "Polaris Enterprise"}
              readOnly
            />
          </label>
          <label className="projects-field">
            <span>Deployment notes</span>
            <input
              type="text"
              placeholder="Add internal note"
              defaultValue={project?.notes ?? ""}
            />
          </label>
        </ProjectFieldGrid>
        <div className="projects-actions">
          <button type="button" className="ghost-btn" onClick={onClose}>
            Cancel
          </button>
          <button type="submit" className="primary-btn">
            {submitLabel}
          </button>
        </div>
      </form>
    </ProjectCard>
  );
};

export default ProjectsPanel;

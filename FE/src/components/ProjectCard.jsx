const ProjectCard = ({ title, eyebrow, children, actions }) => (
  <section className="projects-card" aria-labelledby="projects-heading">
    <div className="projects-card__header">
      <div>
        {eyebrow && <p className="eyebrow">{eyebrow}</p>}
        <h3 id="projects-heading">{title}</h3>
      </div>
      {actions && <div className="projects-card__actions">{actions}</div>}
    </div>
    {children}
  </section>
);

export default ProjectCard;

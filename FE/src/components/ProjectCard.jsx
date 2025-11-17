const ProjectCard = ({ title, eyebrow, children }) => (
  <section className="projects-card" aria-labelledby="projects-heading">
    <div className="projects-card__header">
      <div>
        {eyebrow && <p className="eyebrow">{eyebrow}</p>}
        <h3 id="projects-heading">{title}</h3>
      </div>
    </div>
    {children}
  </section>
);

export default ProjectCard;

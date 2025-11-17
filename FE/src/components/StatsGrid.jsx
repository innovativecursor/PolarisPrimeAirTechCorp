const StatsGrid = ({ cards }) => (
  <section className="stats-grid" aria-label="Key metrics">
    {cards.map((card) => (
      <article key={card.label} className="stat-card">
        <p className="stat-label">{card.label}</p>
        <h3>{card.value}</h3>
        <p className="stat-descriptor">{card.descriptor}</p>
        <span className="stat-trend">{card.trend}</span>
      </article>
    ))}
  </section>
);

export default StatsGrid;

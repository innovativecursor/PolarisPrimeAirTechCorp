const WarehousingPanel = ({ updates }) => (
  <article className="panel-card">
    <div className="panel-header">
      <h3>Warehousing updates</h3>
      <span>Live feed</span>
    </div>
    <ul className="update-list">
      {updates.map((update) => (
        <li key={update.title} className="update-card">
          <strong>{update.title}</strong>
          <p>{update.detail}</p>
        </li>
      ))}
    </ul>
  </article>
);

export default WarehousingPanel;

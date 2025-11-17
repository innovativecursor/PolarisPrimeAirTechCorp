const DashboardHeader = ({ title, userName }) => (
  <header className="dashboard-header">
    <div>
      <p className="eyebrow">Operations overview</p>
      <h2>{title}</h2>
    </div>
    <div className="header-greeting">
      <span className="header-greeting-label">Welcome back</span>
      <div className="header-greeting-name">
        <span className="header-greeting-text">{userName}</span>
      </div>
    </div>
  </header>
);

export default DashboardHeader;

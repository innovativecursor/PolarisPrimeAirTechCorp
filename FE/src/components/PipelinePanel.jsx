const PipelinePanel = ({ stages }) => (
  <article className="panel-card wide">
    <div className="panel-header">
      <h3>Fulfillment pipeline</h3>
      <span>Past 7 days</span>
    </div>
    <div className="pipeline-table-wrapper">
      <table className="pipeline-table">
        <thead>
          <tr>
            <th>Stage</th>
            <th>Volume</th>
            <th>Status</th>
          </tr>
        </thead>
        <tbody>
          {stages.map((stage) => (
            <tr key={stage.label}>
              <td>{stage.label}</td>
              <td>{stage.value}</td>
              <td>{stage.detail}</td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  </article>
);

export default PipelinePanel;

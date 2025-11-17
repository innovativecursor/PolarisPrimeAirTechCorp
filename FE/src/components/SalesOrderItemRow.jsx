const SalesOrderItemRow = ({ onRemove, canRemove }) => (
  <div className="projects-grid sales-items-row">
    <label className="projects-field">
      <span>Select aircon</span>
      <select defaultValue="">
        <option value="" disabled>
          Choose a unit
        </option>
        <option value="window">Window aircon</option>
        <option value="ducted">Ducted splits</option>
        <option value="centralized">Centralized units</option>
      </select>
    </label>
    <label className="projects-field">
      <span>Quantity</span>
      <input type="number" min="1" placeholder="0" />
    </label>
    <label className="projects-field">
      <span>Unit of measurement</span>
      <select defaultValue="pcs">
        <option value="pcs">pcs</option>
        <option value="sets">sets</option>
      </select>
    </label>
    <label className="projects-field">
      <span>Price</span>
      <input type="number" min="0" step="0.01" placeholder="0.00" />
    </label>
    {canRemove && (
      <div className="sales-row-actions">
        <button
          type="button"
          className="table-action-btn table-action-btn--danger sales-row-remove-btn"
          onClick={onRemove}
          aria-label="Remove aircon line"
        >
          <svg
            className="table-action-icon"
            viewBox="0 0 20 20"
            fill="none"
            stroke="currentColor"
            strokeWidth="1.8"
            aria-hidden="true"
          >
            <path
              d="M6 6h8l-.7 10H6.7L6 6Z"
              strokeLinecap="round"
              strokeLinejoin="round"
            />
            <path
              d="M8.5 6V4.5h3V6"
              strokeLinecap="round"
              strokeLinejoin="round"
            />
            <path d="M4 6h12" strokeLinecap="round" strokeLinejoin="round" />
          </svg>
        </button>
      </div>
    )}
  </div>
);

export default SalesOrderItemRow;

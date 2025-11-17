const InvoiceItemRow = ({ canRemove, onRemove }) => (
  <div className="projects-grid invoice-items-row">
    <label className="projects-field">
      <span>SKU number</span>
      <input type="text" placeholder="Eg. SKU-001" />
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
        <option value="lots">lots</option>
      </select>
    </label>
    {canRemove && (
      <div className="sales-row-actions">
        <button
          type="button"
          className="table-action-btn table-action-btn--danger sales-row-remove-btn"
          onClick={onRemove}
          aria-label="Remove invoice line"
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

export default InvoiceItemRow;

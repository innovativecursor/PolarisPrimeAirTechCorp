const RowActions = ({ onEdit, onDelete }) => (
  <div className="table-actions">
    <button
      type="button"
      className="table-action-btn table-action-btn--ghost"
      aria-label="Edit row"
      onClick={onEdit}
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
          d="M4 13.5 4.5 16l2.5-.5L14 8.5 11.5 6 4 13.5Z"
          strokeLinecap="round"
          strokeLinejoin="round"
        />
        <path
          d="M11.5 6 13 4.5 15.5 7 14 8.5"
          strokeLinecap="round"
          strokeLinejoin="round"
        />
      </svg>
    </button>
    <button
      type="button"
      className="table-action-btn table-action-btn--danger"
      aria-label="Delete row"
      onClick={onDelete}
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
        <path d="M8.5 6V4.5h3V6" strokeLinecap="round" strokeLinejoin="round" />
        <path d="M4 6h12" strokeLinecap="round" strokeLinejoin="round" />
      </svg>
    </button>
  </div>
);

export default RowActions;

import ProjectCard from "./ProjectCard";
import ProjectFieldGrid from "./ProjectFieldGrid";

const ReceivingReportPanel = ({
  deliveryReceipts,
  purchaseOrders,
  salesOrders,
  supplierInvoices,
  onClose,
}) => (
  <form className="projects-form">
    <ProjectCard title="Create receiving report" eyebrow="Warehousing">
      <ProjectFieldGrid>
        <label className="projects-field">
          <span>Select delivery receipt</span>
          <select defaultValue="">
            <option value="" disabled>
              Choose a delivery receipt
            </option>
            {deliveryReceipts.map((receipt) => (
              <option key={receipt.code} value={receipt.code}>
                {receipt.code}
              </option>
            ))}
          </select>
        </label>
        <label className="projects-field">
          <span>Select purchase order</span>
          <select defaultValue="">
            <option value="" disabled>
              Choose a purchase order
            </option>
            {purchaseOrders.map((po) => (
              <option key={po.code} value={po.code}>
                {po.code}
              </option>
            ))}
          </select>
        </label>
        <label className="projects-field">
          <span>Select sales order</span>
          <select defaultValue="">
            <option value="" disabled>
              Choose a sales order
            </option>
            {salesOrders.map((order) => (
              <option key={order.code} value={order.code}>
                {order.code}
              </option>
            ))}
          </select>
        </label>
        <label className="projects-field">
          <span>Supplier invoice number</span>
          <select defaultValue="">
            <option value="" disabled>
              Choose supplier invoice
            </option>
            {supplierInvoices.map((invoice) => (
              <option key={invoice} value={invoice}>
                {invoice}
              </option>
            ))}
          </select>
        </label>
      </ProjectFieldGrid>
    </ProjectCard>

    <ProjectCard title="Add item">
      <div className="scan-field">
        <span className="scan-field__label">Scan barcode</span>
        <p className="scan-field__helper">
          Use camera or scanner to capture SKU barcode.
        </p>
      </div>

      <ProjectFieldGrid>
        <label className="projects-field">
          <span>SKU</span>
          <input type="text" placeholder="Eg. SKU-001-AC" />
        </label>
        <label className="projects-field">
          <span>Aircon model number</span>
          <input type="text" placeholder="Eg. MX-1200" />
        </label>
        <label className="projects-field">
          <span>Aircon name</span>
          <input type="text" placeholder="Eg. 1.5HP Window aircon" />
        </label>
        <label className="projects-field">
          <span>HP (Horsepower)</span>
          <input type="number" min="0" step="0.5" placeholder="1.5" />
        </label>
        <label className="projects-field">
          <span>Type of aircon</span>
          <select defaultValue="">
            <option value="" disabled>
              Select type
            </option>
            <option value="window">Window</option>
            <option value="split">Split</option>
            <option value="ducted">Ducted</option>
            <option value="vrf">VRF</option>
          </select>
        </label>
        <label className="projects-field">
          <span>Indoor / outdoor unit</span>
          <select defaultValue="">
            <option value="" disabled>
              Select unit type
            </option>
            <option value="indoor">Indoor unit</option>
            <option value="outdoor">Outdoor unit</option>
          </select>
        </label>
        <div />
        <div />
        <div />
      </ProjectFieldGrid>
    </ProjectCard>

    <div className="projects-actions">
      <button type="button" className="ghost-btn" onClick={onClose}>
        Cancel
      </button>
      <button type="submit" className="primary-btn">
        Save receiving report
      </button>
    </div>
  </form>
);

export default ReceivingReportPanel;

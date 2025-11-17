const InventoryPanel = ({ products }) => (
  <article className="panel-card">
    <div className="panel-header">
      <h3>Inventory position</h3>
      <span>Week 24</span>
    </div>
    <div className="inventory-breakdown">
      {products.map((product) => (
        <article key={product.label} className="inventory-item">
          <p className="inventory-label">{product.label}</p>
          <strong>{product.quantity} units</strong>
          <small>{product.committed} committed</small>
        </article>
      ))}
    </div>
    <button className="text-link" type="button">
      View full inventory
    </button>
  </article>
);

export default InventoryPanel;

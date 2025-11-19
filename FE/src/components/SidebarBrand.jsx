import image from "../../public/image.png";
const SidebarBrand = () => (
  <div className="sidebar-brand">
    {/* <div className="brand-mark">PA</div>
    <div>
      <p className="brand-eyebrow">Polaris Air Tech</p>
      <h1>Inventory Suite</h1>
    </div> */}
    <div className="brand-logo">
      <img src={image} alt="Polaris Air Tech logo" />
    </div>
  </div>
);

export default SidebarBrand;

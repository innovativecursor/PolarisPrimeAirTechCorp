import SidebarBrand from "./SidebarBrand";

const ICON_PATHS = {
  grid: "M4 4h16v16H4z M4 10h16 M10 4v16",
  layers: "M4 10 12 6l8 4-8 4-8-4Zm0 6 8 4 8-4M4 14l8 4 8-4",
  users: "M9 11a3 3 0 1 1 6 0 3 3 0 0 1-6 0Zm-4 9a6 6 0 1 1 12 0",
  tag: "M4 11V4h7l7 7-7 7-7-7Z",
  cart: "M5 6h2l1.2 7h9.6L19.5 8H8M9 19a1 1 0 1 1 0 2 1 1 0 0 1 0-2zm8 0a1 1 0 1 1 0 2 1 1 0 0 1 0-2z",
  warehouse: "M3 10 12 5l9 5v9H3z M7 19v-6h10v6",
  invoice: "M6 4h12v16l-3-2-3 2-3-2-3 2Z",
  ship: "M3 10h18l-2 6H5l-2-6Zm2 6v2h14v-2",
  report:
    "M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z",
};

const Sidebar = ({
  navItems,
  expandedNav,
  onToggleSection,
  onSelect,
  activeKey,
  onLogout,
}) => (
  <aside className="sidebar" aria-label="Primary navigation">
    <SidebarBrand />
    <nav>
      <ul className="nav-list">
        {navItems.map((item) => {
          const hasChildren = Boolean(item.children?.length);
          const isExpanded = hasChildren ? expandedNav[item.key] : false;
          const isActive = activeKey === item.key;

          return (
            <li
              key={item.key}
              className={`nav-item ${hasChildren ? "has-children" : ""} ${
                isExpanded ? "expanded" : ""
              } ${isActive ? "active" : ""}`}
            >
              <button
                type="button"
                className="nav-trigger"
                onClick={() => {
                  if (hasChildren) {
                    onToggleSection(item.key);
                  }
                  onSelect?.(item.key);
                }}
                aria-expanded={hasChildren ? Boolean(isExpanded) : undefined}
                aria-controls={hasChildren ? `${item.key}-sublist` : undefined}
              >
                <span className="nav-leading">
                  {item.icon && ICON_PATHS[item.icon] && (
                    <svg
                      className="nav-icon"
                      viewBox="0 0 24 24"
                      fill="none"
                      stroke="currentColor"
                      strokeWidth="1.6"
                      aria-hidden="true"
                    >
                      <path
                        d={ICON_PATHS[item.icon]}
                        strokeLinecap="round"
                        strokeLinejoin="round"
                      />
                    </svg>
                  )}
                  <span className="nav-label">{item.label}</span>
                </span>
                {hasChildren && (
                  <span className={`chevron ${isExpanded ? "open" : ""}`}>
                    ▾
                  </span>
                )}
              </button>
              {hasChildren && (
                <div
                  className={`accordion-panel ${isExpanded ? "visible" : ""}`}
                >
                  <ul id={`${item.key}-sublist`} className="nav-sublist">
                    {item.children.map((subItem) => (
                      <li
                        key={subItem.key}
                        className="nav-subitem"
                        onClick={() => onSelect?.(subItem.key)}
                      >
                        {subItem.label}
                      </li>
                    ))}
                  </ul>
                </div>
              )}
            </li>
          );
        })}
      </ul>
    </nav>
    <div className="nav-footer">
      <button className="nav-settings" type="button">
        <svg
          className="nav-settings__icon"
          viewBox="0 0 24 24"
          aria-hidden="true"
        >
          <path
            d="M12 8.5a3.5 3.5 0 1 0 0 7 3.5 3.5 0 0 0 0-7zm6.1 3.5a5.7 5.7 0 0 1-.2 1.5l1.9 1.6-1.2 2.2-2-.6a5.5 5.5 0 0 1-1.2 1l.2 2.3h-2.4L13 18a6 6 0 0 1-1.5.1l-.4 2.2H8l.2-2.3a5.3 5.3 0 0 1-1.2-1l-2 .6-1.2-2.2 1.9-1.6a5.9 5.9 0 0 1-.2-1.5 5.9 5.9 0 0 1 .2-1.5L3.5 9.9l1.2-2.2 2 .6c.3-.3.6-.6 1-1l-.2-2.3h2.4L10 6a6 6 0 0 1 1.5-.1l.4-2.2h2.4l-.2 2.3c.4.1.8.3 1.2.6l2-.6 1.2 2.2-1.9 1.6c.1.5.1 1 .2 1.5z"
            fill="white"
          />
        </svg>
        Settings
      </button>
      <button className="nav-logout" type="button" onClick={onLogout}>
        Logout
      </button>
    </div>
  </aside>
);

export default Sidebar;

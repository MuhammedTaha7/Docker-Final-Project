const SidebarItem = ({title, icon, badge, selected, onClick, isCollapsed, isActive,}) => {
  return (
    <div
      className={`sidebar-item ${selected === title && !isActive ? "active" : ""} ${isActive ? "chat-active" : ""}`}
      onClick={onClick}
      title={title}
    >
      <div className="sidebar-icon">{icon}</div>
      {!isCollapsed && (
        <>
          <span className="sidebar-title">{title}</span>
          {badge && <span className="sidebar-badge">{badge}</span>}
        </>
      )}
    </div>
  );
};
export default SidebarItem;
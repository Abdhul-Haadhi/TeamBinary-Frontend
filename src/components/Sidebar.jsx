import React, { useState } from "react";
import "./Sidebar.css";

function Sidebar({
  role,
  activePage,
  setActivePage,
  onLogout,
}) {
  const [collapsed, setCollapsed] = useState(false);

  const isAdmin = role === "admin";

  const investigationItems = [
    {
      id: "vehicle-search",
      label: "Vehicle Search",
      icon: "⌕",
    },
    {
      id: "number-plate",
      label: "Number Plate Detection",
      icon: "▣",
    },
    {
      id: "vehicle-track",
      label: "Vehicle Path Track",
      icon: "⌁",
    },
    {
      id: "reports",
      label: "Reports",
      icon: "▤",
    },
  ];

  const adminItems = [
    {
      id: "cctv",
      label: "CCTV Management",
      icon: "◉",
    },
    {
      id: "users",
      label: "User Management",
      icon: "♙",
    },
  ];

  const handleNavigation = (id) => {
    setActivePage(id);
  };

  return (
    <aside
      className={`at-sidebar ${
        collapsed ? "at-sidebar-collapsed" : ""
      }`}
    >
      {/* ==================================================
          TOP DECORATION
      ================================================== */}

      <div className="at-window-controls">
        <span className="window-dot red"></span>
        <span className="window-dot yellow"></span>
        <span className="window-dot green"></span>
      </div>


      {/* ==================================================
          BRAND
      ================================================== */}

      <div className="at-brand">

        <div className="at-logo-wrapper">
          <img
            src="/team-binary-logo.png"
            alt="AUTO TRACE"
            className="at-logo"
          />
        </div>

        {!collapsed && (
          <div className="at-brand-info">
            <div className="at-brand-name">
              AUTO TRACE
            </div>

            <div className="at-brand-subtitle">
              VEHICLE INTELLIGENCE
            </div>
          </div>
        )}

      </div>


      {/* ==================================================
          USER PROFILE
      ================================================== */}

      {!collapsed && (
        <div className="at-profile">

          <div className="at-profile-avatar">
            {isAdmin ? "A" : "I"}
          </div>

          <div className="at-profile-info">

            <span className="at-profile-label">
              {isAdmin ? "SYSTEM ADMINISTRATOR" : "INVESTIGATOR"}
            </span>

            <strong>
              {isAdmin ? "Administrator" : "Investigator"}
            </strong>

          </div>

        </div>
      )}


      {/* ==================================================
          COLLAPSE BUTTON
      ================================================== */}

      <button
        type="button"
        className="at-collapse-button"
        onClick={() => setCollapsed(!collapsed)}
        title={collapsed ? "Open sidebar" : "Collapse sidebar"}
      >
        {collapsed ? "›" : "‹"}
      </button>


      {/* ==================================================
          NAVIGATION
      ================================================== */}

      <div className="at-navigation">

        {/* INVESTIGATION */}

        {!collapsed && (
          <div className="at-section-title">
            INVESTIGATION
          </div>
        )}

        <nav className="at-menu">

          {investigationItems.map((item) => (
            <button
              key={item.id}
              type="button"
              className={`at-menu-item ${
                activePage === item.id
                  ? "at-menu-item-active"
                  : ""
              }`}
              onClick={() => handleNavigation(item.id)}
              title={collapsed ? item.label : ""}
            >

              <span className="at-menu-icon">
                {item.icon}
              </span>

              {!collapsed && (
                <span className="at-menu-label">
                  {item.label}
                </span>
              )}

              {!collapsed &&
                activePage === item.id && (
                  <span className="at-active-dot"></span>
                )}

            </button>
          ))}

        </nav>


        {/* ADMINISTRATION */}

        {isAdmin && (
          <div className="at-admin-section">

            {!collapsed && (
              <div className="at-section-title">
                ADMINISTRATION
              </div>
            )}

            <nav className="at-menu">

              {adminItems.map((item) => (
                <button
                  key={item.id}
                  type="button"
                  className={`at-menu-item ${
                    activePage === item.id
                      ? "at-menu-item-active"
                      : ""
                  }`}
                  onClick={() => handleNavigation(item.id)}
                  title={collapsed ? item.label : ""}
                >

                  <span className="at-menu-icon">
                    {item.icon}
                  </span>

                  {!collapsed && (
                    <span className="at-menu-label">
                      {item.label}
                    </span>
                  )}

                  {!collapsed &&
                    activePage === item.id && (
                      <span className="at-active-dot"></span>
                    )}

                </button>
              ))}

            </nav>

          </div>
        )}

      </div>


      {/* ==================================================
          BOTTOM AREA
      ================================================== */}

      <div className="at-sidebar-bottom">

        {!collapsed && (
          <div className="at-status">

            <span className="at-status-dot"></span>

            <span>
              SYSTEM ONLINE
            </span>

          </div>
        )}


        {/* LOGOUT */}

        <button
          type="button"
          className="at-logout"
          onClick={onLogout}
          title="Logout"
        >

          <span className="at-logout-icon">
            ↪
          </span>

          {!collapsed && (
            <span>
              Logout
            </span>
          )}

        </button>

      </div>

    </aside>
  );
}

export default Sidebar;
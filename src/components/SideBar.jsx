import React from "react";
import { NavLink } from "react-router-dom";
import "../css/SideBar.css";

const SideBar = ({ isOpen }) => {

  const user = JSON.parse(localStorage.getItem("user"));

  return (
    <aside className={`sidebar ${isOpen ? "open" : "closed"}`}>

      <div className="sidebar-header">
        <h2>AutoTrace</h2>
      </div>

      <nav>

        <NavLink to="/admin-dashboard" className="sidebar-link">
          📊 Dashboard
        </NavLink>

        <NavLink to="/camera-management" className="sidebar-link">
          📷 Camera Management
        </NavLink>

        <NavLink to="/investigator-management" className="sidebar-link">
          👮 Investigator Management
        </NavLink>

        <NavLink to="/vehicle-search" className="sidebar-link">
          🚗 Vehicle Search
        </NavLink>

        <NavLink to="/reports" className="sidebar-link">
          📄 Reports
        </NavLink>

        <NavLink to="/text-search" className="sidebar-link">
          🚗 Text Based Search
        </NavLink>

        {/* {user?.role === "ADMIN" && (
          <NavLink to="/settings" className="sidebar-link">
            ⚙ Settings
          </NavLink>
        )} */}

      </nav>

    </aside>
  );
};

export default SideBar;
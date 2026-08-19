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

        <NavLink to="/registered-cameras" className="sidebar-link">
          📷 Registered Cameras
        </NavLink>

        <NavLink to="/vehicle-classification" className="sidebar-link">
          🚗 Vehicle Classification
        </NavLink>

        <NavLink to="/number-plate" className="sidebar-link">
          🚗 Number plate detection
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
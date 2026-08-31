import React from "react";
import { NavLink } from "react-router-dom";
import {
  LayoutDashboard,
  Camera,
  Car,
  ScanLine,
  Users,
  Search,
  FileText,
  Network,
  ShieldCheck,
  ChevronLeft,
  ChevronRight,
} from "lucide-react";

import "../css/SideBar.css";


const SideBar = ({
  isOpen,
  toggleSidebar,
}) => {

  // =========================================================
  // USER
  // =========================================================

  let user = null;

  try {

    const storedUser =
      localStorage.getItem("user");

    if (storedUser) {
      user = JSON.parse(storedUser);
    }

  } catch (error) {

    console.error(
      "Could not read logged-in user:",
      error
    );
  }


  const role =
    user?.role || "INVESTIGATOR";


  // =========================================================
  // COMMON MENU ITEMS
  // =========================================================

  const commonItems = [

    {
      path: "/admin-dashboard",
      label: "Dashboard",
      icon: LayoutDashboard,
    },

    {
      path: "/vehicle-search",
      label: "Vehicle Search",
      icon: Search,
    },

    // {
    //   path: "/vehicle-classification",
    //   label: "Vehicle Classification",
    //   icon: Car,
    // },

    // {
    //   path: "/number-plate",
    //   label: "Number Plate Detection",
    //   icon: ScanLine,
    // },



    {
      path: "/reports",
      label: "Reports",
      icon: FileText,
    },

  ];


  // =========================================================
  // ADMIN-ONLY MENU
  // =========================================================

  const adminItems = [

    {
      path: "/CCTV-Management",
      label: "Camera Management",
      icon: Camera,
    },

    {
      path: "/registered-cameras",
      label: "Registered Cameras",
      icon: Network,
    },

    {
      path: "/investigator-management",
      label: "Investigator Management",
      icon: Users,
    },

    // {
    //   path: "/image-search",
    //   label: "Image Search",
    //   icon: Search,
    // },

  ];


  // =========================================================
  // BUILD MENU
  // =========================================================

  const menuItems =
    role === "ADMIN"
      ? [
        ...commonItems.slice(0, 1),

        ...adminItems,

        ...commonItems.slice(1),
      ]
      : commonItems;


  // =========================================================
  // ROLE LABEL
  // =========================================================

  const roleLabel =
    role === "ADMIN"
      ? "Administrator"
      : "Investigator";


  // =========================================================
  // RENDER
  // =========================================================

  return (

    <aside
      className={`sidebar ${isOpen
        ? "open"
        : "closed"
        }`}
    >


      {/* ==================================================
                SIDEBAR HEADER
            ================================================== */}

      <div className="sidebar-header">


        <div className="sidebar-system-status">

          <span className="system-status-dot"></span>

          <span>
            SYSTEM ONLINE
          </span>

        </div>


        <div className="sidebar-role-card">

          <div className="sidebar-role-icon">

            <ShieldCheck
              size={17}
            />

          </div>


          <div className="sidebar-role-info">

            <span>
              Current Access
            </span>

            <strong>
              {roleLabel}
            </strong>

          </div>

        </div>

      </div>


      {/* ==================================================
                NAVIGATION
            ================================================== */}

      <nav className="sidebar-nav">


        <div className="sidebar-section-label">

          Main Navigation

        </div>


        {menuItems.map(
          ({
            path,
            label,
            icon: Icon,
          }) => (

            <NavLink
              key={path}
              to={path}
              end={
                path ===
                "/admin-dashboard"
              }
              className={({
                isActive,
              }) =>
                `sidebar-link ${isActive
                  ? "active"
                  : ""
                }`
              }
            >

              <span className="sidebar-link-icon">

                <Icon
                  size={18}
                  strokeWidth={
                    2
                  }
                />

              </span>


              <span className="sidebar-link-label">

                {label}

              </span>


              <span className="sidebar-active-indicator"></span>

            </NavLink>

          )
        )}

      </nav>


      {/* ==================================================
                SIDEBAR FOOTER
            ================================================== */}

      <div className="sidebar-footer">


        <div className="sidebar-footer-line"></div>


        <div className="sidebar-security">

          <ShieldCheck
            size={14}
          />

          <div>

            <span>
              Authorized Access
            </span>

            <small>
              AutoTrace Security
            </small>

          </div>

        </div>


        {/* Collapse button */}

        <button
          className="sidebar-collapse-btn"
          onClick={
            toggleSidebar
          }
          title={
            isOpen
              ? "Collapse sidebar"
              : "Expand sidebar"
          }
        >

          {isOpen ? (

            <>
              <ChevronLeft
                size={15}
              />

              <span>
                Collapse
              </span>
            </>

          ) : (

            <ChevronRight
              size={17}
            />

          )}

        </button>

      </div>

    </aside>
  );
};


export default SideBar;
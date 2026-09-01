import React, {
  useEffect,
  useState,
} from "react";

import {
  Outlet,
  useLocation,
} from "react-router-dom";

import NavBar from "./NavBar";
import SideBar from "./SideBar";

import "../css/AdminLayout.css";


const AdminLayout = () => {

  const [sidebarOpen, setSidebarOpen] =
    useState(true);

  const location =
    useLocation();


  // =========================================================
  // PAGE TITLES
  // =========================================================

  const pageTitles = {

    "/admin-dashboard":
      "Dashboard",

    "/camera-management":
      "Camera Management",

    "/registered-cameras":
      "Registered Cameras",

    "/vehicle-classification":
      "Vehicle Classification",

    "/number-plate":
      "Number Plate Detection",

    "/investigator-management":
      "Investigator Management",

    "/vehicle-search":
      "Vehicle Search",

    "/reports":
      "Reports",

  };


  const pageTitle =
    pageTitles[
    location.pathname
    ] || "Dashboard";


  // =========================================================
  // RESPONSIVE SIDEBAR
  // =========================================================

  useEffect(() => {

    const handleResize = () => {

      if (
        window.innerWidth <=
        700
      ) {

        setSidebarOpen(
          false
        );

      } else {

        setSidebarOpen(
          true
        );
      }
    };


    handleResize();


    window.addEventListener(
      "resize",
      handleResize
    );


    return () => {

      window.removeEventListener(
        "resize",
        handleResize
      );

    };

  }, []);


  // =========================================================
  // RENDER
  // =========================================================

  return (

    <div className="app-shell">


      {/* ==================================================
                NAVBAR
            ================================================== */}

      <NavBar
        title={pageTitle}
        toggleSidebar={() =>
          setSidebarOpen(
            previous =>
              !previous
          )
        }
      />


      {/* ==================================================
                SIDEBAR
            ================================================== */}

      <SideBar
        isOpen={
          sidebarOpen
        }
        toggleSidebar={() =>
          setSidebarOpen(
            previous =>
              !previous
          )
        }
      />


      {/* ==================================================
                MAIN CONTENT
            ================================================== */}

      <main
        className={`app-main ${sidebarOpen
            ? "sidebar-open"
            : "sidebar-closed"
          }`}
      >

        <Outlet />

      </main>

    </div>
  );
};


export default AdminLayout;
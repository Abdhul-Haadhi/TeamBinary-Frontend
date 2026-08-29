import React, { useState } from "react";

import Login from "./pages/Login";
import VehicleSearch from "./pages/VehicleSearch";
import CCTVManagement from "./pages/CCTVManagement";
import Sidebar from "./components/Sidebar";

import "./App.css";

function App() {
  // =====================================================
  // LOGIN STATE
  // =====================================================

  const [loggedIn, setLoggedIn] = useState(
    localStorage.getItem("isLoggedIn") === "true"
  );

  const [role, setRole] = useState(
    localStorage.getItem("userRole") || ""
  );

  // =====================================================
  // ACTIVE PAGE
  // =====================================================

  const [activePage, setActivePage] = useState(
    "vehicle-search"
  );

  // =====================================================
  // LOGIN
  // =====================================================

  const handleLogin = (userRole) => {
    localStorage.setItem("isLoggedIn", "true");
    localStorage.setItem("userRole", userRole);

    setRole(userRole);
    setLoggedIn(true);

    setActivePage("vehicle-search");
  };

  // =====================================================
  // LOGOUT
  // =====================================================

  const handleLogout = () => {
    localStorage.removeItem("isLoggedIn");
    localStorage.removeItem("userRole");

    setRole("");
    setLoggedIn(false);
    setActivePage("vehicle-search");
  };

  // =====================================================
  // LOGIN SCREEN
  // =====================================================

  if (!loggedIn) {
    return <Login onLogin={handleLogin} />;
  }

  // =====================================================
  // MAIN APPLICATION
  // =====================================================

  return (
    <div className="app-layout">

      {/* ===============================================
          SIDEBAR
      =============================================== */}

      <Sidebar
        role={role}
        activePage={activePage}
        setActivePage={setActivePage}
        onLogout={handleLogout}
      />

      {/* ===============================================
          MAIN CONTENT
      =============================================== */}

      <main className="main-content">

        {/* VEHICLE SEARCH */}

        {activePage === "vehicle-search" && (
          <VehicleSearch />
        )}


        {/* NUMBER PLATE */}

        {activePage === "number-plate" && (
          <div className="page-placeholder">

            <h1>
              Number Plate Detection
            </h1>

            <p>
              Number plate detection module.
            </p>

          </div>
        )}


        {/* VEHICLE PATH TRACK */}

        {activePage === "vehicle-track" && (
          <div className="page-placeholder">

            <h1>
              Vehicle Path Track
            </h1>

            <p>
              Vehicle tracking module.
            </p>

          </div>
        )}


        {/* REPORTS */}

        {activePage === "reports" && (
          <div className="page-placeholder">

            <h1>
              Reports
            </h1>

            <p>
              Investigation reports will appear here.
            </p>

          </div>
        )}


        {/* =============================================
            CCTV MANAGEMENT
            ADMIN ONLY
        ============================================= */}

        {activePage === "cctv" && role === "admin" && (
          <CCTVManagement />
        )}


        {/* USER MANAGEMENT */}

        {activePage === "users" && role === "admin" && (
          <div className="page-placeholder">

            <h1>
              User Management
            </h1>

            <p>
              Investigator and administrator
              accounts can be managed here.
            </p>

          </div>
        )}

      </main>

    </div>
  );
}

export default App;
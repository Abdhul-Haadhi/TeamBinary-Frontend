import React, { useState } from "react";
import { Outlet } from "react-router-dom";
import NavBar from "../components/NavBar";
import SideBar from "../components/SideBar";

const AdminLayout = () => {
  const [sidebarOpen, setSidebarOpen] = useState(true);

  return (
    <>
      <NavBar
        title="AutoTrace"
        toggleSidebar={() => setSidebarOpen(!sidebarOpen)}
      />

      <SideBar isOpen={sidebarOpen} />

      <div
        style={{
          marginTop: "70px",
          marginLeft: sidebarOpen ? "260px" : "80px",
          padding: "20px",
          transition: "0.3s",
        }}
      >
        <Outlet />
      </div>
    </>
  );
};

export default AdminLayout;
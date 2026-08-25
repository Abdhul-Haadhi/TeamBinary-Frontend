import React, { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import "../css/NavBar.css";

const NavBar = ({ title = "Dashboard", toggleSidebar }) => {
    const navigate = useNavigate();

    const user = JSON.parse(localStorage.getItem("user"));

    const handleLogout = () => {
        localStorage.removeItem("user");
        navigate("/login", { replace: true });
    };

    return (
        <nav className="navbar">
            {/* Left Side */}
            <div className="navbar-left">
                <button className="menu-btn" onClick={toggleSidebar}>
                    ☰
                </button>

                <h2 className="logo">AutoTrace</h2>

                {/* <span className="page-title">{title}</span> */}
            </div>

            {/* Right Side */}
            <div className="navbar-right">
                <button className="notification-btn">🔔</button>

                <div className="user-info">
                    <span className="user-name">{user?.email}</span>

                    <span className="user-role">{user?.role}</span>
                </div>

                <button className="logout-btn" onClick={handleLogout}>
                    Logout
                </button>
            </div>
        </nav>
    );
};

export default NavBar;
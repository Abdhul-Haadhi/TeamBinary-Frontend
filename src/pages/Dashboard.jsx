import React, { useEffect } from "react";
import { useNavigate } from "react-router-dom";
import "../css/Dashboard.css";

const Dashboard = () => {
  const navigate = useNavigate();

  useEffect(() => {
    const user = localStorage.getItem("user");
    if (!user) {
      navigate("/login", { replace: true });
    }
  }, [navigate]);

  const sidebarPages = [
    {
      title: "Camera Management",
      icon: "📷",
      path: "/CCTV-Management",
      description: "Manage camera configurations, view active feeds, and monitor network camera health.",
      theme: "theme-camera",
      badgeText: "System Feeds"
    },
    {
      title: "Vehicle Classification",
      icon: "🚗",
      path: "/vehicle-classification",
      description: "Classify vehicles by category, color, make, and model using AI video analytics.",
      theme: "theme-classification",
      badgeText: "AI Analytics"
    },
    {
      title: "Number Plate Detection",
      icon: "🔢",
      path: "/number-plate",
      description: "Real-time automatic Number plate recognition (ANPR) and detection alerts.",
      theme: "theme-plate",
      badgeText: "ANPR Engine"
    },
    {
      title: "Investigator Management",
      icon: "👮",
      path: "/investigator-management",
      description: "Manage investigator accounts, track team permissions, and assign investigation tasks.",
      theme: "theme-investigator",
      badgeText: "Team Admin"
    },
    {
      title: "Vehicle Search",
      icon: "🔍",
      path: "/vehicle-search",
      description: "Search historical logs by license plate number, timeframe, or camera location.",
      theme: "theme-search",
      badgeText: "Log Query"
    },
    {
      title: "Reports",
      icon: "📄",
      path: "/reports",
      description: "Generate comprehensive system reports, statistical insights, and case exports.",
      theme: "theme-report",
      badgeText: "Analytics"
    }
  ];

  return (
    <div className="dashboard-container">
      <div className="dashboard-header">
        <h1 className="dashboard-title">
          Welcome to <span className="dashboard-title-highlight">AutoTrace</span> Dashboard
        </h1>
        <p className="dashboard-subtitle">
          Select any section below or use the sidebar to access system modules and features.
        </p>
      </div>

      <div className="dashboard-section-title">
        <span>📌 System Modules & Pages</span>
      </div>

      <div className="dashboard-grid">
        {sidebarPages.map((page, index) => (
          <div
            key={index}
            className={`dashboard-card ${page.theme}`}
            onClick={() => navigate(page.path)}
          >
            <div className="card-top">
              <div className="card-icon-badge">{page.icon}</div>
              <div className="card-arrow-icon">➔</div>
            </div>

            <div className="card-body">
              <h3 className="card-title">{page.title}</h3>
              <p className="card-description">{page.description}</p>
            </div>

            <div className="card-footer">
              <span className="card-action-text">Explore Module</span>
              <span style={{ fontSize: '11px', opacity: 0.8 }}>{page.badgeText}</span>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};

export default Dashboard;

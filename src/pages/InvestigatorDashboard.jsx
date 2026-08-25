import React from "react";
import { useNavigate } from "react-router-dom";
import { useEffect } from "react";

const InvestigatorDashboard = () => {
  const navigate = useNavigate();

  useEffect(() => {
    const user = localStorage.getItem("user");

    if (!user) {
      navigate("/login", { replace: true });
    }
  }, [navigate]);

  const handleLogout = () => {
    localStorage.removeItem("user");

    navigate("/login", { replace: true });
  };

  return (
    <div>
      <h1>Investigator Dashboard</h1>
      <button
        style={{ backgroundColor: "red", color: "white" }}
        onClick={handleLogout}
      >
        Logout
      </button>
    </div>
  );
};

export default InvestigatorDashboard;

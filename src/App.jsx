import { useState } from "react";
import "./App.css";
import LoginPage from "./pages/LoginPage";
import Dashboard from "./pages/Dashboard";
import InvestigatorDashboard from "./pages/InvestigatorDashboard";
import { BrowserRouter as Router, Routes, Route } from "react-router-dom";
import ProtectedRoute from "./components/ProtectedRoute";

function App() {
  return (
    <Routes>
      <Route path="/" element={<LoginPage />} />
      <Route path="/login" element={<LoginPage />} />
      <Route
        path="/admin-dashboard"
        element={
          <ProtectedRoute role="ADMIN">
            <Dashboard />
          </ProtectedRoute>
        }
      />

      <Route
        path="/investigator-dashboard"
        element={
          <ProtectedRoute role="INVESTIGATOR">
            <InvestigatorDashboard />
          </ProtectedRoute>
        }
      />
    </Routes>

    // <div>
    //   <LoginPage></LoginPage>
    // </div>
  );
}

export default App;

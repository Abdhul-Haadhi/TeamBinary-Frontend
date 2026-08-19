import { useState } from "react";
import "./App.css";
import LoginPage from "./pages/LoginPage";
import Dashboard from "./pages/Dashboard";
import InvestigatorDashboard from "./pages/InvestigatorDashboard";
import { BrowserRouter as Router, Routes, Route } from "react-router-dom";
import ProtectedRoute from "./components/ProtectedRoute";
import AdminLayout from "./components/AdminLayout";
import Cameras from "./pages/Cameras";
import Investigators from "./pages/Investigators";
import Report from "./pages/Report";
import VehicleClassification from "./pages/VehicleClassification";
import NumberPlateDetection from "./pages/NumberPlateDetection";
import VehicleSearch from "./pages/VehicleSearch";
import RegisteredCameras from "./pages/RegisteredCameras";

function App() {
  return (
    <Routes>

      <Route path="/" element={<LoginPage />} />
      <Route path="/login" element={<LoginPage />} />

      <Route
        element={
          <ProtectedRoute role="ADMIN">
            <AdminLayout />
          </ProtectedRoute>
        }
      >
        <Route path="/admin-dashboard" element={<Dashboard />} />
        <Route path="/camera-management" element={<Cameras />} />
        <Route path="/registered-cameras" element={<RegisteredCameras />} />
        <Route path="/vehicle-classification" element={<VehicleClassification />} />
        <Route path="/number-plate" element={<NumberPlateDetection />} />
        <Route path="/investigator-management" element={<Investigators />} />
        <Route path="/reports" element={<Report />} />
        <Route path="/vehicle-search" element={<VehicleSearch />} />
        {/* More admin pages */}
      </Route>

    </Routes>

    // <div>
    //   <LoginPage></LoginPage>
    // </div>
  );
}

export default App;

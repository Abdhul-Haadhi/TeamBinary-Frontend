import { useState } from "react";
import "./App.css";
import LoginPage from "./pages/LoginPage";
import Dashboard from "./pages/Dashboard";
import InvestigatorDashboard from "./pages/InvestigatorDashboard";
import { BrowserRouter as Router, Routes, Route } from "react-router-dom";
import ProtectedRoute from "./components/ProtectedRoute";
import Cameras from "./pages/Cameras";
import AdminLayout from "./components/AdminLayout";
import Investigators from "./pages/Investigators";
import Report from "./pages/Report";
import VehicleReport from "./pages/VehicleReport";
import PlateReport from "./pages/PlateReport";
import TrackingReport from "./pages/TrackingReport";
import HistoryReport from "./pages/HistoryReport";
import CameraReport from "./pages/CameraReport";
import TextVehicleSearch from "./pages/TextVehicleSearch";

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
        <Route path="/investigator-management" element={<Investigators />} />
        <Route path="/reports" element={<Report />} />
        <Route path="/reports/vehicles" element={<VehicleReport />} />
        <Route path="/reports/plates" element={<PlateReport />} />
        <Route path="/reports/tracking" element={<TrackingReport />} />
        <Route path="/reports/history" element={<HistoryReport />} />
        <Route path="/reports/cameras" element={<CameraReport />} />
        <Route path="/text-search" element={<TextVehicleSearch />} />
        {/* More admin pages */}
      </Route>

    </Routes>

    // <div>
    //   <LoginPage></LoginPage>
    // </div>
  );
}

export default App;

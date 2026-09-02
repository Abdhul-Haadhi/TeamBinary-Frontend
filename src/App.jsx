
import "./App.css";

import {
  Routes,
  Route,
  Navigate,
} from "react-router-dom";

// AUTH
import LoginPage from "./pages/LoginPage";
import ProtectedRoute from "./components/ProtectedRoute";

// SHARED APPLICATION LAYOUT
import AdminLayout from "./components/AdminLayout";

// PAGES
import Dashboard from "./pages/Dashboard";
import CCTVManagement from "./pages/CCTVManagement";
import RegisteredCameras from "./pages/RegisteredCameras";
import VehicleClassification from "./pages/VehicleClassification";
import NumberPlateDetection from "./pages/NumberPlateDetection";
import Investigators from "./pages/Investigators";
import Report from "./pages/Report";
import VehicleSearch from "./pages/VehicleSearch";
import HistoryReport from "./pages/HistoryReport";
import CameraReport from "./pages/CameraReport";

// VEHICLE REPORT
import VehicleSearchReport from "./pages/VehicleSearchReport";

// SYSTEM ADMIN
import OrganizationManagement from "./pages/OrganizationManagement";
import ImageSearch from "./pages/imageSearch";


function App() {
  return (
    <Routes>

      {/* =========================
          PUBLIC
      ========================== */}

      <Route
        path="/"
        element={<LoginPage />}
      />

      <Route
        path="/login"
        element={<LoginPage />}
      />


      {/* =========================
          SYSTEM ADMIN
      ========================== */}

      <Route
        path="/organization-management"
        element={
          <ProtectedRoute role="SYSTEM_ADMIN">
            <OrganizationManagement />
          </ProtectedRoute>
        }
      />


      {/* =========================
          ADMIN + INVESTIGATOR
      ========================== */}

      <Route
        element={
          <ProtectedRoute
            roles={[
              "ADMIN",
              "INVESTIGATOR",
            ]}
          >
            <AdminLayout />
          </ProtectedRoute>
        }
      >

        {/* =========================
            DASHBOARD
        ========================== */}

        <Route
          path="/admin-dashboard"
          element={<Dashboard />}
        />

        <Route
          path="/dashboard"
          element={<Dashboard />}
        />


        {/* =========================
            INVESTIGATION FEATURES
        ========================== */}

        <Route
          path="/vehicle-classification"
          element={<VehicleClassification />}
        />

        <Route
          path="/image-search"
          element={<ImageSearch />}
        />

        <Route
          path="/number-plate"
          element={<NumberPlateDetection />}
        />

        <Route
          path="/vehicle-search"
          element={<VehicleSearch />}
        />


        {/* =========================
            REPORTS
        ========================== */}

        <Route
          path="/reports"
          element={<Report />}
        />

        {/* VEHICLE DETECTION REPORT */}
        <Route
          path="/reports/vehicles"
          element={<VehicleSearchReport />}
        />

        {/* SEARCH HISTORY REPORT */}
        <Route
          path="/reports/history"
          element={<HistoryReport />}
        />

        {/* CAMERA ACTIVITY REPORT */}
        <Route
          path="/reports/cameras"
          element={<CameraReport />}
        />


        {/* =========================
            ADMIN ONLY
        ========================== */}

        <Route
          path="/CCTV-Management"
          element={
            <ProtectedRoute role="ADMIN">
              <CCTVManagement />
            </ProtectedRoute>
          }
        />

        <Route
          path="/registered-cameras"
          element={
            <ProtectedRoute role="ADMIN">
              <RegisteredCameras />
            </ProtectedRoute>
          }
        />

        <Route
          path="/investigator-management"
          element={
            <ProtectedRoute role="ADMIN">
              <Investigators />
            </ProtectedRoute>
          }
        />

      </Route>


      {/* =========================
          OLD INVESTIGATOR DASHBOARD
      ========================== */}

      <Route
        path="/investigator-dashboard"
        element={
          <Navigate
            to="/admin-dashboard"
            replace
          />
        }
      />


      {/* =========================
          FALLBACK
      ========================== */}

      <Route
        path="*"
        element={
          <Navigate
            to="/login"
            replace
          />
        }
      />

    </Routes>
  );
}

export default App;


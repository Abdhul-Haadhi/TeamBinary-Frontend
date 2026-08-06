import { BrowserRouter as Router, Routes, Route, Navigate } from "react-router-dom";
import Report from "./Report/Report.jsx";
import classification from "./vehicleclassification/classification.jsx";
import VehicleReport from "./Report/VehicleReport.jsx";
import PlateReport from "./Report/PlateReport.jsx";
import TrackingReport from "./Report/TrackingReport.jsx";
import CameraReport from "./Report/CameraReport.jsx";
import HistoryReport from "./Report/HistoryReport.jsx";


function App() {
  return (
    
      <Routes>
        {/* Redirect root to reports */}
        <Route path="/" element={<Navigate to="/reports" />} />

        {/* Dashboard */}
        <Route path="/reports" element={<Report />} />

        {/* Vehicle Report Page */}
        <Route path="/reports/vehicles" element={<VehicleReport />} />

        {/*number plate repot page*/}
        <Route path="/reports/plates" element={<PlateReport />} />

        {/*number tracking repot page*/}
        <Route path="/reports/tracking" element={<TrackingReport />} />

        {/*number history repot page*/}
        <Route path="/reports/history" element={<HistoryReport />} />

        {/*number camera repot page*/}
        <Route path="/reports/cameras" element={<CameraReport />} />
      </Routes>
    
  );
};

export default App;
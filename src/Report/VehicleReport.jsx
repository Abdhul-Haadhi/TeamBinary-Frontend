

import { useNavigate } from "react-router-dom";

const VehicleReport = () => {
  const navigate = useNavigate();

  return (
    <div style={{ padding: "20px" }}>
      <h2>🚗 Vehicle Detection Report</h2>

      <button
        onClick={() => navigate("/reports")}
        style={{
          marginBottom: "20px",
          padding: "8px 12px",
          cursor: "pointer",
        }}
      >
        ← Back to Dashboard
      </button>

      <table border="1" cellPadding="10" style={{ borderCollapse: "collapse" }}>
        <thead>
          <tr>
            <th>ID</th>
            <th>Vehicle Type</th>
            <th>Detected Time</th>
          </tr>
        </thead>
        <tbody>
          <tr>
            <td>1</td>
            <td>Car</td>
            <td>10:30 AM</td>
          </tr>
          <tr>
            <td>2</td>
            <td>Truck</td>
            <td>11:00 AM</td>
          </tr>
          <tr>
            <td>3</td>
            <td>Bike</td>
            <td>11:30 AM</td>
          </tr>
        </tbody>
      </table>
    </div>
  );
};

export default VehicleReport;
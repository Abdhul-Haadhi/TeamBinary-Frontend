

import { useNavigate } from "react-router-dom";

const PlateReport = () => {
    const navigate = useNavigate();
    
  return (
    <div style={{ padding: "20px" }}>
      <h2>Number Plate Recognition Report</h2>
      <p>Displays recognized number plates from videos.</p>

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
    </div>
  );
};

export default PlateReport;
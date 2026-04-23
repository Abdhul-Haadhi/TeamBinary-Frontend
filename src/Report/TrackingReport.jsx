import { useNavigate } from "react-router-dom";


const TrackingReport = () => {
    const navigate = useNavigate();
  return (
    <div>
      <h2>Vehicle Tracking Report</h2>
      <p>Track vehicle movements here.</p>

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

export default TrackingReport;
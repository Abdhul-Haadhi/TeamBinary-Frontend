import { useNavigate } from "react-router-dom";
const CameraReport = () => {
     const navigate = useNavigate();
  return (
    <div>
      <h2>Camera Activity Report</h2>
      <p>Monitor camera usage and logs.</p>

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

export default CameraReport;
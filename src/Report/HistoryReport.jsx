import { useNavigate } from "react-router-dom";
const HistoryReport = () => {
     const navigate = useNavigate();
  return (
    <div>
      <h2>Search History Report</h2>
      <p>View past search activities.</p>

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

export default HistoryReport;
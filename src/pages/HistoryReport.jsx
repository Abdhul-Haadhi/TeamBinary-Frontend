import { useNavigate } from "react-router-dom";

const historyData = [
  { query: "Vehicle search - Toyota", user: "Admin 01", time: "08:10 AM", result: "24 matches" },
  { query: "License plate lookup", user: "Ops 02", time: "09:35 AM", result: "7 matches" },
  { query: "Camera activity - Gate A", user: "Admin 03", time: "11:02 AM", result: "12 events" },
  { query: "Tracking - V-1098", user: "Ops 01", time: "01:15 PM", result: "3 checkpoints" },
];

const HistoryReport = () => {
  const navigate = useNavigate();

  return (
    <div style={{ padding: "24px" }}>
      <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: "20px", flexWrap: "wrap" }}>
        <div>
          <h2 style={{ margin: 0 }}>Search History Report</h2>
          <p style={{ margin: "8px 0 0", color: "#666" }}>Recent search and lookup activity across the system.</p>
        </div>

        <button
          onClick={() => navigate("/reports")}
          style={{
            padding: "10px 16px",
            border: "none",
            borderRadius: "8px",
            background: "#0f172a",
            color: "#fff",
            cursor: "pointer",
            fontWeight: "600",
          }}
        >
          Back to Reports
        </button>
      </div>

      <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fit, minmax(180px, 1fr))", gap: "16px", marginBottom: "24px" }}>
        {[
          { label: "Total Searches", value: "1,482" },
          { label: "Unique Users", value: "28" },
          { label: "Plate Lookups", value: "502" },
          { label: "Vehicle Queries", value: "690" },
        ].map((item) => (
          <div key={item.label} style={{ background: "#fff", borderRadius: "12px", padding: "20px", boxShadow: "0 4px 12px rgba(0,0,0,0.08)" }}>
            <div style={{ color: "#666", fontSize: "14px" }}>{item.label}</div>
            <h3 style={{ margin: "10px 0 0", fontSize: "28px" }}>{item.value}</h3>
          </div>
        ))}
      </div>

      <div style={{ background: "#fff", borderRadius: "12px", boxShadow: "0 4px 12px rgba(0,0,0,0.08)", overflow: "hidden" }}>
        <table style={{ width: "100%", borderCollapse: "collapse" }}>
          <thead>
            <tr style={{ background: "#f8fafc" }}>
              <th style={tableHeaderStyle}>Query</th>
              <th style={tableHeaderStyle}>User</th>
              <th style={tableHeaderStyle}>Time</th>
              <th style={tableHeaderStyle}>Results</th>
            </tr>
          </thead>
          <tbody>
            {historyData.map((entry, index) => (
              <tr key={`${entry.query}-${index}`}>
                <td style={tableCellStyle}>{entry.query}</td>
                <td style={tableCellStyle}>{entry.user}</td>
                <td style={tableCellStyle}>{entry.time}</td>
                <td style={tableCellStyle}>{entry.result}</td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
};

const tableHeaderStyle = {
  textAlign: "left",
  padding: "14px 16px",
  borderBottom: "1px solid #e5e7eb",
  color: "#374151",
  fontSize: "14px",
};

const tableCellStyle = {
  padding: "14px 16px",
  borderBottom: "1px solid #f1f5f9",
  color: "#1f2937",
};

export default HistoryReport;

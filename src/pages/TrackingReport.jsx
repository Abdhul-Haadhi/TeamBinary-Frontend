import { useNavigate } from "react-router-dom";

const trackingData = [
  { vehicle: "V-1024", route: "Gate A → East Gate", duration: "18 min", status: "Completed" },
  { vehicle: "V-1041", route: "Parking North → Exit", duration: "26 min", status: "Completed" },
  { vehicle: "V-1067", route: "Tower 1 → Loading Bay", duration: "42 min", status: "In Progress" },
  { vehicle: "V-1098", route: "Gate C → Security Check", duration: "12 min", status: "Delayed" },
];

const TrackingReport = () => {
  const navigate = useNavigate();

  return (
    <div style={{ padding: "24px" }}>
      <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: "20px", flexWrap: "wrap" }}>
        <div>
          <h2 style={{ margin: 0 }}>Vehicle Tracking Report</h2>
          <p style={{ margin: "8px 0 0", color: "#666" }}>Movement paths and route status for tracked vehicles.</p>
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
          { label: "Active Tracks", value: "74" },
          { label: "Completed Routes", value: "316" },
          { label: "Avg. Duration", value: "21 min" },
          { label: "Delayed Vehicles", value: "12" },
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
              <th style={tableHeaderStyle}>Vehicle</th>
              <th style={tableHeaderStyle}>Route</th>
              <th style={tableHeaderStyle}>Duration</th>
              <th style={tableHeaderStyle}>Status</th>
            </tr>
          </thead>
          <tbody>
            {trackingData.map((entry) => (
              <tr key={entry.vehicle}>
                <td style={tableCellStyle}>{entry.vehicle}</td>
                <td style={tableCellStyle}>{entry.route}</td>
                <td style={tableCellStyle}>{entry.duration}</td>
                <td style={tableCellStyle}>
                  <span
                    style={{
                      display: "inline-block",
                      padding: "6px 10px",
                      borderRadius: "999px",
                      fontWeight: "600",
                      background:
                        entry.status === "Completed" ? "#dcfce7" : entry.status === "In Progress" ? "#dbeafe" : "#fef3c7",
                      color:
                        entry.status === "Completed" ? "#166534" : entry.status === "In Progress" ? "#1d4ed8" : "#92400e",
                    }}
                  >
                    {entry.status}
                  </span>
                </td>
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

export default TrackingReport;

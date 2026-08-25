import { useNavigate } from "react-router-dom";

const cameraData = [
  { name: "Gate A", location: "Main Entrance", status: "Online", vehicles: 142, alerts: 3, uptime: "99.2%" },
  { name: "Gate B", location: "Parking North", status: "Online", vehicles: 128, alerts: 1, uptime: "98.8%" },
  { name: "Gate C", location: "Loading Bay", status: "Offline", vehicles: 0, alerts: 5, uptime: "74.1%" },
  { name: "Tower 1", location: "Perimeter East", status: "Online", vehicles: 94, alerts: 2, uptime: "97.9%" },
];

const CameraReport = () => {
  const navigate = useNavigate();

  return (
    <div style={{ padding: "24px" }}>
      <div
        style={{
          display: "flex",
          justifyContent: "space-between",
          alignItems: "center",
          marginBottom: "20px",
          gap: "12px",
          flexWrap: "wrap",
        }}
      >
        <div>
          <h2 style={{ margin: 0 }}>Camera Activity Report</h2>
          <p style={{ margin: "8px 0 0", color: "#666" }}>
            Live overview of camera uptime, traffic flow, and alerts.
          </p>
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

      <div
        style={{
          display: "grid",
          gridTemplateColumns: "repeat(auto-fit, minmax(180px, 1fr))",
          gap: "16px",
          marginBottom: "24px",
        }}
      >
        {[
          { label: "Active Cameras", value: "18" },
          { label: "Vehicles Captured", value: "4,382" },
          { label: "Critical Alerts", value: "11" },
          { label: "Avg. Uptime", value: "96.7%" },
        ].map((item) => (
          <div
            key={item.label}
            style={{
              background: "#fff",
              borderRadius: "12px",
              padding: "20px",
              boxShadow: "0 4px 12px rgba(0,0,0,0.08)",
            }}
          >
            <div style={{ color: "#666", fontSize: "14px" }}>{item.label}</div>
            <h3 style={{ margin: "10px 0 0", fontSize: "28px" }}>{item.value}</h3>
          </div>
        ))}
      </div>

      <div
        style={{
          background: "#fff",
          borderRadius: "12px",
          boxShadow: "0 4px 12px rgba(0,0,0,0.08)",
          overflow: "hidden",
        }}
      >
        <table style={{ width: "100%", borderCollapse: "collapse" }}>
          <thead>
            <tr style={{ background: "#f8fafc" }}>
              <th style={tableHeaderStyle}>Camera</th>
              <th style={tableHeaderStyle}>Location</th>
              <th style={tableHeaderStyle}>Status</th>
              <th style={tableHeaderStyle}>Vehicles</th>
              <th style={tableHeaderStyle}>Alerts</th>
              <th style={tableHeaderStyle}>Uptime</th>
            </tr>
          </thead>
          <tbody>
            {cameraData.map((camera) => (
              <tr key={camera.name}>
                <td style={tableCellStyle}>{camera.name}</td>
                <td style={tableCellStyle}>{camera.location}</td>
                <td style={tableCellStyle}>
                  <span
                    style={{
                      display: "inline-block",
                      padding: "6px 10px",
                      borderRadius: "999px",
                      fontWeight: "600",
                      background:
                        camera.status === "Online" ? "#dcfce7" : "#fee2e2",
                      color:
                        camera.status === "Online" ? "#166534" : "#991b1b",
                    }}
                  >
                    {camera.status}
                  </span>
                </td>
                <td style={tableCellStyle}>{camera.vehicles}</td>
                <td style={tableCellStyle}>{camera.alerts}</td>
                <td style={tableCellStyle}>{camera.uptime}</td>
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

export default CameraReport;

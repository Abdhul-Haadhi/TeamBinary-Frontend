import { useNavigate } from "react-router-dom";

const vehicleData = [
  { id: "V-1024", type: "Sedan", time: "08:15 AM", camera: "Gate A", status: "Matched" },
  { id: "V-1041", type: "SUV", time: "09:40 AM", camera: "Gate B", status: "Matched" },
  { id: "V-1067", type: "Truck", time: "11:05 AM", camera: "Tower 1", status: "Flagged" },
  { id: "V-1098", type: "Van", time: "01:20 PM", camera: "Gate C", status: "Pending" },
];

const VehicleReport = () => {
  const navigate = useNavigate();

  return (
    <div style={{ padding: "24px" }}>
      <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: "20px", flexWrap: "wrap" }}>
        <div>
          <h2 style={{ margin: 0 }}>Vehicle Detection Report</h2>
          <p style={{ margin: "8px 0 0", color: "#666" }}>Detected vehicle activity and classification summary.</p>
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
          { label: "Vehicles Detected", value: "1,842" },
          { label: "Unique Vehicles", value: "642" },
          { label: "Matched Detections", value: "1,521" },
          { label: "Flagged Cases", value: "34" },
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
              <th style={tableHeaderStyle}>Vehicle ID</th>
              <th style={tableHeaderStyle}>Type</th>
              <th style={tableHeaderStyle}>Time</th>
              <th style={tableHeaderStyle}>Camera</th>
              <th style={tableHeaderStyle}>Status</th>
            </tr>
          </thead>
          <tbody>
            {vehicleData.map((vehicle) => (
              <tr key={vehicle.id}>
                <td style={tableCellStyle}>{vehicle.id}</td>
                <td style={tableCellStyle}>{vehicle.type}</td>
                <td style={tableCellStyle}>{vehicle.time}</td>
                <td style={tableCellStyle}>{vehicle.camera}</td>
                <td style={tableCellStyle}>
                  <span
                    style={{
                      display: "inline-block",
                      padding: "6px 10px",
                      borderRadius: "999px",
                      fontWeight: "600",
                      background:
                        vehicle.status === "Matched" ? "#dcfce7" : vehicle.status === "Flagged" ? "#fef3c7" : "#e2e8f0",
                      color:
                        vehicle.status === "Matched" ? "#166534" : vehicle.status === "Flagged" ? "#92400e" : "#475569",
                    }}
                  >
                    {vehicle.status}
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

export default VehicleReport;

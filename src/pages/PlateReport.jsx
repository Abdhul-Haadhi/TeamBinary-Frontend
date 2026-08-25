import { useNavigate } from "react-router-dom";

const plateData = [
  { plate: "ABC-1245", owner: "R. Silva", confidence: "98.6%", camera: "Gate A", time: "08:20 AM" },
  { plate: "XYZ-9981", owner: "M. Ahmed", confidence: "97.4%", camera: "Gate B", time: "09:12 AM" },
  { plate: "QWE-4412", owner: "Unknown", confidence: "94.1%", camera: "Tower 1", time: "10:49 AM" },
  { plate: "LMN-7043", owner: "J. Brown", confidence: "96.8%", camera: "Gate C", time: "12:03 PM" },
];

const PlateReport = () => {
  const navigate = useNavigate();

  return (
    <div style={{ padding: "24px" }}>
      <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: "20px", flexWrap: "wrap" }}>
        <div>
          <h2 style={{ margin: 0 }}>Number Plate Recognition Report</h2>
          <p style={{ margin: "8px 0 0", color: "#666" }}>Recognized plates, confidence scores, and access comparisons.</p>
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
          { label: "Plates Read", value: "2,410" },
          { label: "High Confidence", value: "2,103" },
          { label: "Unknown Plates", value: "81" },
          { label: "Avg. Accuracy", value: "96.9%" },
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
              <th style={tableHeaderStyle}>Plate No.</th>
              <th style={tableHeaderStyle}>Owner</th>
              <th style={tableHeaderStyle}>Confidence</th>
              <th style={tableHeaderStyle}>Camera</th>
              <th style={tableHeaderStyle}>Time</th>
            </tr>
          </thead>
          <tbody>
            {plateData.map((plate) => (
              <tr key={plate.plate}>
                <td style={tableCellStyle}>{plate.plate}</td>
                <td style={tableCellStyle}>{plate.owner}</td>
                <td style={tableCellStyle}>{plate.confidence}</td>
                <td style={tableCellStyle}>{plate.camera}</td>
                <td style={tableCellStyle}>{plate.time}</td>
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

export default PlateReport;

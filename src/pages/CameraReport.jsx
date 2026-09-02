
import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";

const CameraReport = () => {
  const navigate = useNavigate();

  const [reportData, setReportData] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  useEffect(() => {
    fetchCameraReport();
  }, []);

  const fetchCameraReport = async () => {
    try {
      setLoading(true);
      setError("");

      const response = await fetch(
        "http://localhost:8080/api/reports/cameras"
      );

      if (!response.ok) {
        throw new Error("Failed to load camera report");
      }

      const data = await response.json();

      setReportData(data);
    } catch (err) {
      console.error(err);
      setError("Unable to load camera report.");
    } finally {
      setLoading(false);
    }
  };

  /*
   * Statistics
   */
  const totalCameras = reportData.length;

  const activeCameras = reportData.filter(
    (item) =>
      item.status &&
      item.status.toLowerCase() === "active"
  ).length;

  const inactiveCameras = reportData.filter(
    (item) =>
      !item.status ||
      item.status.toLowerCase() !== "active"
  ).length;

  const cameraTypes = new Set(
    reportData
      .map((item) => item.cameraType)
      .filter((type) => type)
  ).size;

  return (
    <div style={{ padding: "24px" }}>

      {/* Header */}
      <div
        style={{
          display: "flex",
          justifyContent: "space-between",
          alignItems: "center",
          marginBottom: "20px",
          flexWrap: "wrap",
          gap: "12px",
        }}
      >
        <div>
          <h2 style={{ margin: 0 }}>
            Camera Activity Report
          </h2>

          <p
            style={{
              margin: "8px 0 0",
              color: "#666",
            }}
          >
            Camera information and activity across the CCTV network.
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

      {/* Summary Cards */}
      <div
        style={{
          display: "grid",
          gridTemplateColumns:
            "repeat(auto-fit, minmax(180px, 1fr))",
          gap: "16px",
          marginBottom: "24px",
        }}
      >
        {[
          {
            label: "Total Cameras",
            value: totalCameras,
          },
          {
            label: "Active Cameras",
            value: activeCameras,
          },
          {
            label: "Inactive Cameras",
            value: inactiveCameras,
          },
          {
            label: "Camera Types",
            value: cameraTypes,
          },
        ].map((item) => (
          <div
            key={item.label}
            style={{
              background: "#fff",
              borderRadius: "12px",
              padding: "20px",
              boxShadow:
                "0 4px 12px rgba(0,0,0,0.08)",
            }}
          >
            <div
              style={{
                color: "#666",
                fontSize: "14px",
              }}
            >
              {item.label}
            </div>

            <h3
              style={{
                margin: "10px 0 0",
                fontSize: "28px",
              }}
            >
              {item.value}
            </h3>
          </div>
        ))}
      </div>

      {/* Error */}
      {error && (
        <div
          style={{
            background: "#fee2e2",
            color: "#991b1b",
            padding: "14px 16px",
            borderRadius: "8px",
            marginBottom: "20px",
          }}
        >
          {error}
        </div>
      )}

      {/* Loading */}
      {loading ? (
        <div
          style={{
            background: "#fff",
            padding: "30px",
            borderRadius: "12px",
            textAlign: "center",
            boxShadow:
              "0 4px 12px rgba(0,0,0,0.08)",
          }}
        >
          Loading camera report...
        </div>
      ) : (
        <div
          style={{
            background: "#fff",
            borderRadius: "12px",
            boxShadow:
              "0 4px 12px rgba(0,0,0,0.08)",
            overflowX: "auto",
          }}
        >
          <table
            style={{
              width: "100%",
              borderCollapse: "collapse",
              minWidth: "900px",
            }}
          >
            <thead>
              <tr
                style={{
                  background: "#f8fafc",
                }}
              >
                <th style={tableHeaderStyle}>
                  Camera ID
                </th>

                <th style={tableHeaderStyle}>
                  Camera Name
                </th>

                <th style={tableHeaderStyle}>
                  Location
                </th>

                <th style={tableHeaderStyle}>
                  Camera Type
                </th>

                <th style={tableHeaderStyle}>
                  Status
                </th>

                <th style={tableHeaderStyle}>
                  Description
                </th>
              </tr>
            </thead>

            <tbody>
              {reportData.length === 0 ? (
                <tr>
                  <td
                    colSpan="6"
                    style={{
                      padding: "30px",
                      textAlign: "center",
                      color: "#666",
                    }}
                  >
                    No camera records found.
                  </td>
                </tr>
              ) : (
                reportData.map((item) => (
                  <tr key={item.id}>

                    <td style={tableCellStyle}>
                      {item.id || "-"}
                    </td>

                    <td
                      style={{
                        ...tableCellStyle,
                        fontWeight: "600",
                      }}
                    >
                      {item.cameraName || "-"}
                    </td>

                    <td style={tableCellStyle}>
                      {item.location || "-"}
                    </td>

                    <td style={tableCellStyle}>
                      {item.cameraType || "-"}
                    </td>

                    <td style={tableCellStyle}>
                      <span
                        style={{
                          display: "inline-block",
                          padding: "6px 10px",
                          borderRadius: "999px",
                          fontWeight: "600",
                          background:
                            item.status?.toLowerCase() ===
                            "active"
                              ? "#dcfce7"
                              : "#fee2e2",
                          color:
                            item.status?.toLowerCase() ===
                            "active"
                              ? "#166534"
                              : "#991b1b",
                        }}
                      >
                        {item.status || "Unknown"}
                      </span>
                    </td>

                    <td style={tableCellStyle}>
                      {item.description || "-"}
                    </td>

                  </tr>
                ))
              )}
            </tbody>
          </table>
        </div>
      )}

      {/* Refresh button */}
      <div
        style={{
          marginTop: "20px",
          display: "flex",
          justifyContent: "flex-end",
        }}
      >
        <button
          onClick={fetchCameraReport}
          style={{
            padding: "10px 16px",
            border: "none",
            borderRadius: "8px",
            background: "#2563eb",
            color: "#fff",
            cursor: "pointer",
            fontWeight: "600",
          }}
        >
          Refresh Report
        </button>
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
  whiteSpace: "nowrap",
};

const tableCellStyle = {
  padding: "14px 16px",
  borderBottom: "1px solid #f1f5f9",
  color: "#1f2937",
  whiteSpace: "nowrap",
};

export default CameraReport;


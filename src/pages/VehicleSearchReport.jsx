import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";

const VehicleSearchReport = () => {
  const navigate = useNavigate();

  const [reportData, setReportData] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  useEffect(() => {
    fetchVehicleSearchReport();
  }, []);

  const fetchVehicleSearchReport = async () => {
    try {
      setLoading(true);
      setError("");

      const response = await fetch(
        "http://localhost:8080/api/reports/vehicle-search"
      );

      if (!response.ok) {
        throw new Error("Failed to load vehicle search report");
      }

      const data = await response.json();

      setReportData(data);
    } catch (err) {
      console.error(err);
      setError("Unable to load vehicle search report.");
    } finally {
      setLoading(false);
    }
  };

  /*
   * Statistics
   */
  const totalResults = reportData.length;

  const uniqueCameras = new Set(
    reportData
      .map((item) => item.cameraId)
      .filter((id) => id !== null && id !== undefined)
  ).size;

  const matchedResults = reportData.filter(
    (item) =>
      item.matchConfidence !== null &&
      item.matchConfidence !== undefined
  ).length;

  const averageConfidence =
    reportData.length > 0
      ? reportData.reduce(
          (sum, item) =>
            sum + (Number(item.matchConfidence) || 0),
          0
        ) / reportData.length
      : 0;

  const formatConfidence = (confidence) => {
    if (confidence === null || confidence === undefined) {
      return "-";
    }

    const value = Number(confidence);

    /*
     * Handles both:
     * 0.95 -> 95%
     * 95 -> 95%
     */
    return `${value <= 1
      ? (value * 100).toFixed(1)
      : value.toFixed(1)}%`;
  };

  const formatDateTime = (dateTime) => {
    if (!dateTime) {
      return "-";
    }

    try {
      return new Date(dateTime).toLocaleString();
    } catch {
      return dateTime;
    }
  };

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
            Vehicle Search Report
          </h2>

          <p
            style={{
              margin: "8px 0 0",
              color: "#666",
            }}
          >
            Vehicle search results across the CCTV camera network.
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
            label: "Search Results",
            value: totalResults,
          },
          {
            label: "Cameras Found",
            value: uniqueCameras,
          },
          {
            label: "Matched Results",
            value: matchedResults,
          },
          {
            label: "Avg. Match Confidence",
            value: `${averageConfidence <= 1
              ? (averageConfidence * 100).toFixed(1)
              : averageConfidence.toFixed(1)}%`,
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
          Loading vehicle search report...
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
              minWidth: "1100px",
            }}
          >
            <thead>
              <tr
                style={{
                  background: "#f8fafc",
                }}
              >
                <th style={tableHeaderStyle}>
                  Search File
                </th>

                <th style={tableHeaderStyle}>
                  Plate
                </th>

                <th style={tableHeaderStyle}>
                  Vehicle Type
                </th>

                <th style={tableHeaderStyle}>
                  Color
                </th>

                <th style={tableHeaderStyle}>
                  Camera
                </th>

                <th style={tableHeaderStyle}>
                  Location
                </th>

                <th style={tableHeaderStyle}>
                  Match
                </th>

                <th style={tableHeaderStyle}>
                  Detection Time
                </th>
              </tr>
            </thead>

            <tbody>
              {reportData.length === 0 ? (
                <tr>
                  <td
                    colSpan="8"
                    style={{
                      padding: "30px",
                      textAlign: "center",
                      color: "#666",
                    }}
                  >
                    No vehicle search results found.
                  </td>
                </tr>
              ) : (
                reportData.map((item) => (
                  <tr key={item.id}>

                    <td style={tableCellStyle}>
                      {item.searchFileName || "-"}
                    </td>

                    <td
                      style={{
                        ...tableCellStyle,
                        fontWeight: "600",
                      }}
                    >
                      {item.detectedPlate || "-"}
                    </td>

                    <td style={tableCellStyle}>
                      {item.detectedVehicleType || "-"}
                    </td>

                    <td style={tableCellStyle}>
                      {item.detectedColor || "-"}
                    </td>

                    <td style={tableCellStyle}>
                      {item.cameraName || "-"}
                    </td>

                    <td style={tableCellStyle}>
                      {item.cameraLocation || "-"}
                    </td>

                    <td style={tableCellStyle}>
                      <span
                        style={{
                          display: "inline-block",
                          padding: "6px 10px",
                          borderRadius: "999px",
                          fontWeight: "600",
                          background:
                            "#dcfce7",
                          color:
                            "#166534",
                        }}
                      >
                        {formatConfidence(
                          item.matchConfidence
                        )}
                      </span>
                    </td>

                    <td style={tableCellStyle}>
                      {item.timestamp ||
                        formatDateTime(
                          item.searchedAt
                        )}
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
          onClick={fetchVehicleSearchReport}
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

export default VehicleSearchReport;
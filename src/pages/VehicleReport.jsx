
import { useEffect, useState } from "react";

const VehicleReport = () => {
  const [reports, setReports] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  useEffect(() => {
    fetch("http://localhost:8080/api/reports/vehicle-search")
      .then((response) => {
        if (!response.ok) {
          throw new Error("Failed to load vehicle report");
        }

        return response.json();
      })
      .then((data) => {
        setReports(data);
        setLoading(false);
      })
      .catch((err) => {
        console.error(err);
        setError("Unable to load vehicle detection report.");
        setLoading(false);
      });
  }, []);

  // =========================
  // CALCULATIONS
  // =========================

  const totalResults = reports.length;

  const uniqueVehicles = new Set(
    reports
      .map((item) => item.detectedPlate)
      .filter((plate) => plate && plate.trim() !== "")
  ).size;

  const camerasInvolved = new Set(
    reports
      .map((item) => item.cameraId)
      .filter((id) => id !== null && id !== undefined)
  ).size;

  const confidenceValues = reports
    .map((item) => item.matchConfidence)
    .filter(
      (confidence) =>
        confidence !== null &&
        confidence !== undefined &&
        !isNaN(confidence)
    );

  const averageConfidence =
    confidenceValues.length > 0
      ? (
          confidenceValues.reduce(
            (sum, value) => sum + Number(value),
            0
          ) / confidenceValues.length
        ).toFixed(1)
      : "0.0";

  // =========================
  // LOADING
  // =========================

  if (loading) {
    return (
      <div style={styles.page}>
        <h2 style={styles.title}>Vehicle Detection Report</h2>

        <p style={styles.message}>
          Loading vehicle detection report...
        </p>
      </div>
    );
  }

  // =========================
  // ERROR
  // =========================

  if (error) {
    return (
      <div style={styles.page}>
        <h2 style={styles.title}>Vehicle Detection Report</h2>

        <div style={styles.error}>
          {error}
        </div>
      </div>
    );
  }

  return (
    <div style={styles.page}>

      {/* HEADER */}

      <div style={styles.header}>
        <h2 style={styles.title}>
          Vehicle Detection Report
        </h2>

        <p style={styles.subtitle}>
          Vehicle search results detected across the CCTV camera network.
        </p>
      </div>


      {/* SUMMARY CARDS */}

      <div style={styles.cards}>

        <SummaryCard
          title="Search Results"
          value={totalResults}
        />

        <SummaryCard
          title="Unique Vehicles"
          value={uniqueVehicles}
        />

        <SummaryCard
          title="Cameras Involved"
          value={camerasInvolved}
        />

        <SummaryCard
          title="Avg. Match Confidence"
          value={`${averageConfidence}%`}
        />

      </div>


      {/* TABLE */}

      <div style={styles.tableContainer}>

        <h3 style={styles.tableTitle}>
          Vehicle Detection Results
        </h3>

        {reports.length === 0 ? (
          <p style={styles.message}>
            No vehicle detection records found.
          </p>
        ) : (
          <div style={styles.tableWrapper}>

            <table style={styles.table}>

              <thead>
                <tr>
                  <th style={styles.th}>Search File</th>
                  <th style={styles.th}>Plate</th>
                  <th style={styles.th}>Vehicle Type</th>
                  <th style={styles.th}>Color</th>
                  <th style={styles.th}>Camera</th>
                  <th style={styles.th}>Location</th>
                  <th style={styles.th}>Match Confidence</th>
                  <th style={styles.th}>Detection Time</th>
                </tr>
              </thead>

              <tbody>

                {reports.map((item) => (

                  <tr key={item.id}>

                    <td style={styles.td}>
                      {item.searchFileName || "-"}
                    </td>

                    <td style={styles.td}>
                      {item.detectedPlate || "-"}
                    </td>

                    <td style={styles.td}>
                      {item.detectedVehicleType || "-"}
                    </td>

                    <td style={styles.td}>
                      {item.detectedColor || "-"}
                    </td>

                    <td style={styles.td}>
                      {item.cameraName || "-"}
                    </td>

                    <td style={styles.td}>
                      {item.cameraLocation || "-"}
                    </td>

                    <td style={styles.td}>
                      {item.matchConfidence !== null &&
                      item.matchConfidence !== undefined
                        ? `${Number(item.matchConfidence).toFixed(1)}%`
                        : "-"}
                    </td>

                    <td style={styles.td}>
                      {item.timestamp || "-"}
                    </td>

                  </tr>

                ))}

              </tbody>

            </table>

          </div>
        )}

      </div>

    </div>
  );
};


// =========================
// SUMMARY CARD
// =========================

const SummaryCard = ({ title, value }) => {
  return (
    <div style={styles.card}>

      <p style={styles.cardTitle}>
        {title}
      </p>

      <h3 style={styles.cardValue}>
        {value}
      </h3>

    </div>
  );
};


// =========================
// STYLES
// =========================

const styles = {

  page: {
    padding: "30px",
    minHeight: "100vh",
    backgroundColor: "#f5f7fb",
  },

  header: {
    marginBottom: "25px",
  },

  title: {
    margin: 0,
    fontSize: "28px",
    color: "#1f2937",
  },

  subtitle: {
    marginTop: "8px",
    color: "#6b7280",
  },

  cards: {
    display: "grid",
    gridTemplateColumns:
      "repeat(auto-fit, minmax(200px, 1fr))",
    gap: "20px",
    marginBottom: "30px",
  },

  card: {
    backgroundColor: "#ffffff",
    padding: "22px",
    borderRadius: "12px",
    boxShadow:
      "0 4px 12px rgba(0, 0, 0, 0.08)",
    border: "1px solid #e5e7eb",
  },

  cardTitle: {
    margin: 0,
    color: "#6b7280",
    fontSize: "14px",
  },

  cardValue: {
    marginTop: "10px",
    marginBottom: 0,
    fontSize: "28px",
    color: "#2563eb",
  },

  tableContainer: {
    backgroundColor: "#ffffff",
    borderRadius: "12px",
    padding: "20px",
    boxShadow:
      "0 4px 12px rgba(0, 0, 0, 0.08)",
    border: "1px solid #e5e7eb",
  },

  tableTitle: {
    marginTop: 0,
    marginBottom: "20px",
    color: "#1f2937",
  },

  tableWrapper: {
    overflowX: "auto",
  },

  table: {
    width: "100%",
    borderCollapse: "collapse",
    minWidth: "1000px",
  },

  th: {
    padding: "12px",
    textAlign: "left",
    backgroundColor: "#f3f4f6",
    color: "#374151",
    fontSize: "13px",
    borderBottom: "1px solid #d1d5db",
  },

  td: {
    padding: "12px",
    fontSize: "13px",
    color: "#4b5563",
    borderBottom: "1px solid #e5e7eb",
  },

  message: {
    color: "#6b7280",
    padding: "20px 0",
  },

  error: {
    backgroundColor: "#fee2e2",
    color: "#b91c1c",
    padding: "15px",
    borderRadius: "8px",
    marginTop: "20px",
  },

};

export default VehicleReport;


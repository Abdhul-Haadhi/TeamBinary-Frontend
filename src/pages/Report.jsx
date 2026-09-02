
import { useNavigate } from "react-router-dom";

const Report = () => {
  const navigate = useNavigate();

  const reports = [
    {
      title: "Vehicle Detection Report",
      description:
        "View vehicle search results, detected plates, vehicle types, colors, cameras, and match confidence.",
      path: "/reports/vehicles",
    },
    {
      title: "Search History Report",
      description:
        "View previous vehicle searches, search files, search dates, and processing status.",
      path: "/reports/history",
    },
    {
      title: "Camera Activity Report",
      description:
        "View registered CCTV cameras, locations, camera types, and current camera status.",
      path: "/reports/cameras",
    },
  ];

  return (
    <div
      style={{
        padding: "30px",
        minHeight: "100vh",
        backgroundColor: "#f5f7fb",
      }}
    >
      {/* Page Header */}
      <div style={{ marginBottom: "30px" }}>
        <h2
          style={{
            margin: 0,
            fontSize: "28px",
            fontWeight: "700",
            color: "#1f2937",
          }}
        >
          Reports Dashboard
        </h2>

        <p
          style={{
            marginTop: "8px",
            color: "#6b7280",
            fontSize: "15px",
          }}
        >
          Select a report below to view system and investigation information.
        </p>
      </div>

      {/* Report Cards */}
      <div
        style={{
          display: "grid",
          gridTemplateColumns: "repeat(auto-fit, minmax(280px, 1fr))",
          gap: "24px",
          maxWidth: "1100px",
        }}
      >
        {reports.map((report) => (
          <div
            key={report.path}
            onClick={() => navigate(report.path)}
            style={{
              backgroundColor: "#ffffff",
              borderRadius: "14px",
              padding: "28px",
              cursor: "pointer",
              boxShadow: "0 4px 15px rgba(0, 0, 0, 0.08)",
              border: "1px solid #e5e7eb",
              transition: "all 0.25s ease",
            }}
            onMouseEnter={(e) => {
              e.currentTarget.style.transform = "translateY(-5px)";
              e.currentTarget.style.boxShadow =
                "0 8px 22px rgba(0, 0, 0, 0.12)";
            }}
            onMouseLeave={(e) => {
              e.currentTarget.style.transform = "translateY(0)";
              e.currentTarget.style.boxShadow =
                "0 4px 15px rgba(0, 0, 0, 0.08)";
            }}
          >
            <h3
              style={{
                marginTop: 0,
                marginBottom: "12px",
                color: "#111827",
                fontSize: "20px",
              }}
            >
              {report.title}
            </h3>

            <p
              style={{
                color: "#6b7280",
                lineHeight: "1.6",
                fontSize: "14px",
                minHeight: "68px",
              }}
            >
              {report.description}
            </p>

            <button
              onClick={(e) => {
                e.stopPropagation();
                navigate(report.path);
              }}
              style={{
                marginTop: "12px",
                padding: "10px 18px",
                border: "none",
                borderRadius: "8px",
                backgroundColor: "#3d0505",
                color: "#ffffff",
                fontSize: "14px",
                fontWeight: "600",
                cursor: "pointer",
              }}
            >
              View Report →
            </button>
          </div>
        ))}
      </div>
    </div>
  );
};

export default Report;

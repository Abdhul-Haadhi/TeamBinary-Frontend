
import { useNavigate } from "react-router-dom";

const Report = () => {
  const navigate = useNavigate();

  const cards = [
    { title: "Vehicle Detection Report", path: "/reports/vehicles" },
    { title: "Number Plate Recognition Report", path: "/reports/plates" },
    { title: "Vehicle Tracking Report", path: "/reports/tracking" },
    { title: "Search History Report", path: "/reports/history" },
    { title: "Camera Activity Report", path: "/reports/cameras" },
  ];

  return (
    <div style={{ padding: "20px" }}>
      <h2>Reports Dashboard</h2>

      <div style={{ display: "flex", gap: "20px", flexWrap: "wrap" }}>
        {cards.map((card, index) => (
          <div
            key={index}
            onClick={() => navigate(card.path)}
            style={{
              width: "220px",
              padding: "20px",
              borderRadius: "12px",
              cursor: "pointer",
              textAlign: "center",
              background: "#ffffff",
              boxShadow: "0 4px 10px rgba(0,0,0,0.1)",
              transition: "0.3s",
            }}
            onMouseEnter={(e) =>
              (e.currentTarget.style.transform = "scale(1.05)")
            }
            onMouseLeave={(e) =>
              (e.currentTarget.style.transform = "scale(1)")
            }
          >
            <h4>{card.title}</h4>
            <p>Click to view report</p>
          </div>
        ))}
      </div>
    </div>
  );
};

export default Report;
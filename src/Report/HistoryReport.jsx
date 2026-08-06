import { useNavigate } from "react-router-dom";
const HistoryReport = () => {
     const navigate = useNavigate();
     const searchHistory = [
    {
      id: 1,
      investigator: "John Doe",
      searchType: "Vehicle Image",
      keyword: "Red Toyota Car",
      searchDate: "2025-06-01",
      resultCount: 5,
    },
    {
      id: 2,
      investigator: "Jane Smith",
      searchType: "Number Plate",
      keyword: "ABC-1234",
      searchDate: "2025-06-02",
      resultCount: 2,
    },
    {
      id: 3,
      investigator: "Michael Lee",
      searchType: "Text Description",
      keyword: "White Van",
      searchDate: "2025-06-03",
      resultCount: 7,
    },
  ];

  return (
    <div>
      <h2>Search History Report</h2>
      <p>View past search activities.</p>

      <table border="1" width="100%" cellPadding="10">
        <thead>
          <tr>
            <th>Search ID</th>
            <th>Investigator</th>
            <th>Search Type</th>
            <th>Keyword / Input</th>
            <th>Search Date</th>
            <th>Results Found</th>
          </tr>
        </thead>

        <tbody>
          {searchHistory.map((search) => (
            <tr key={search.id}>
              <td>{search.id}</td>
              <td>{search.investigator}</td>
              <td>{search.searchType}</td>
              <td>{search.keyword}</td>
              <td>{search.searchDate}</td>
              <td>{search.resultCount}</td>
            </tr>
          ))}
        </tbody>
      </table>

      <button
        onClick={() => navigate("/reports")}
        style={{
          marginBottom: "20px",
          padding: "8px 12px",
          cursor: "pointer",
        }}
      >
        ← Back to Dashboard
      </button>


    </div>
  );
};

export default HistoryReport;

























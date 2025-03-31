import { useState, useEffect } from "react";
import { AgGridReact } from "ag-grid-react";
import { AllCommunityModule, ModuleRegistry, themeMaterial } from "ag-grid-community";
import "ag-grid-community/styles/ag-theme-material.css";
import api from "../apiConfig";
import "./tablePage.css";

ModuleRegistry.registerModules([AllCommunityModule]);

const TablePage = ({ apiEndpoint, columnDefs, transformData, onRowClicked = null }) => {
  const [rowData, setRowData] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  const defaultColDef = {
    filter: true,
    flex: 1,
  };

  const myTheme = themeMaterial.withParams({
    headerFontSize: "32px",
  });

  useEffect(() => {
    const fetchData = async () => {
      try {
        const response = await api.get(apiEndpoint);
        const data = transformData ? transformData(response.data) : response.data;
        setRowData(data);
      } catch (err) {
        console.error("Error fetching data:", err);
        setError("Failed to load data.");
      } finally {
        setLoading(false);
      }
    };

    fetchData();
  }, [apiEndpoint, transformData]);

  if (loading) {
    return <div className="page">Loading...</div>;
  }

  if (error) {
    return <div className="page">{error}</div>;
  }

  return (
    <div className="page">
      <div className="table ag-theme-material" style={{ height: "100%", width: "100%" }}>
        <AgGridReact
          rowData={rowData}
          columnDefs={columnDefs}
          rowSelection="multiple"
          pagination={true}
          paginationPageSize={20}
          paginationPageSizeSelector={[10, 20, 30, 40]}
          defaultColDef={defaultColDef}
          onRowClicked={onRowClicked}
          theme={myTheme}
        />
      </div>
    </div>
  );
};

export default TablePage;

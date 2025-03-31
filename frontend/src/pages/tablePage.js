import { useState, useEffect } from "react";
import { AgGridReact } from "ag-grid-react";
import { AllCommunityModule, ModuleRegistry, themeMaterial } from "ag-grid-community";
import "ag-grid-community/styles/ag-theme-material.css";
import api from "../apiConfig";
import "./tablePage.css";
import { IoAdd } from "react-icons/io5";

ModuleRegistry.registerModules([AllCommunityModule]);

const TablePage = ({ apiEndpoint, columnDefs, transformData, showActions = false, onRowClicked = null, onAddClick }) => {
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
    return <div className="page loading">Loading...</div>;
  }

  if (error) {
    return <div className="page error">{error}</div>;
  }

  return (
    <div className="page">
      <div className="table ag-theme-material" style={{ height: "70%", width: "100%" }}>
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
      {showActions && (
        <div className="actions">
          <button className="add-btn" onClick={onAddClick}>
            <IoAdd className="icon" /> add new
          </button>
        </div>
      )}
    </div>
  );
};

export default TablePage;

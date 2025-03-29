import { AgGridReact } from "ag-grid-react";
import { AllCommunityModule, ModuleRegistry } from "ag-grid-community";
import "ag-grid-community/styles/ag-theme-quartz.css";

ModuleRegistry.registerModules([AllCommunityModule]);

const TablePage = ({ rowData, columnDefs, }) => {
  const defaultColDef = {
    filter: true,
  };

  return (
    <div className="page">
      <div className="table ag-theme-quartz" style={{ height: "100%", width: "100%" }}>
        <AgGridReact
          rowData={rowData}
          columnDefs={columnDefs}
          rowSelection="multiple"
          pagination={true}
          paginationPageSize={20}
          paginationPageSizeSelector={[10, 20, 30, 40]}
          defaultColDef={defaultColDef}
        />
      </div>
    </div>
  );
};

export default TablePage;

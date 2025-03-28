import { AgGridReact } from "ag-grid-react";
import { ClientSideRowModelModule } from "ag-grid-community";
import "ag-grid-community/styles/ag-theme-alpine.css";

const TablePage = ({ rowData, columnDefs, pagination=false, paginationPageSize=5 }) => {
  return (
    <div className="page">
      <div className="table ag-theme-alpine" style={{ height: 400, width: "100%" }}>
        <AgGridReact
          rowData={rowData}
          columnDefs={columnDefs}
          modules={[ClientSideRowModelModule]}
          pagination={pagination}
          paginationPageSize={paginationPageSize}
        />
      </div>
    </div>
  );
};

export default TablePage;

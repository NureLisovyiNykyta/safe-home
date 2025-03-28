import { useState } from "react";
import TablePage from "./tablePage";

const Admins = () => {
  const [rowData] = useState([
    { name: "Alex", email: "alex@test.com", createdAt: "22.02.25" },
    { name: "John", email: "john@test.com", createdAt: "22.02.25" },
  ]);

  const [columnDefs] = useState([
    { field: "name", headerName: "Name" },
    { field: "email", headerName: "Email" },
    { field: "createdAt", headerName: "Created at" },
  ]);

  return <TablePage rowData={rowData} columnDefs={columnDefs} />;
};

export default Admins;

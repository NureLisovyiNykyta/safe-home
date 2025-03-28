import { useState } from "react";
import TablePage from "./tablePage";

const Subscriptions = () => {
  const [rowData] = useState([
    { name: "basic", maxHomes: 1, maxSensors: 5, price: "0.0$", duration: 30 },
    { name: "premium", maxHomes: 1, maxSensors: 5, price: "0.0$", duration: 30 },
  ]);

  const [columnDefs] = useState([
    { field: "name", headerName: "Name" },
    { field: "maxHomes", headerName: "Max homes" },
    { field: "maxSensors", headerName: "Max sensors" },
    { field: "price", headerName: "Price" },
    { field: "duration", headerName: "Duration days" },
    { 
      field: "edit",
      headerName: "",
      cellRenderer: () => <button className="edit-btn">Edit</button>,
      width: 100,
    },
  ]);

  return <TablePage rowData={rowData} columnDefs={columnDefs} />;
};

export default Subscriptions;

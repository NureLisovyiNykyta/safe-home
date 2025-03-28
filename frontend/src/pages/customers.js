import { useState } from "react";
import TablePage from "./tablePage";

const Customers = () => {
  const [rowData] = useState([
    { name: "Alex", email: "alex@test.com", currentSubscription: "basic", createdAt: "22.02.25", birthday: "22.02.07" },
    { name: "John", email: "john@test.com", currentSubscription: "premium", createdAt: "21.12.20", birthday: "21.05.15" },
    { name: "Emma", email: "emma@test.com", currentSubscription: "standard", createdAt: "23.01.10", birthday: "23.11.03" },
    { name: "Alex", email: "alex@test.com", currentSubscription: "basic", createdAt: "22.02.25", birthday: "22.02.07" },
    { name: "John", email: "john@test.com", currentSubscription: "premium", createdAt: "21.12.20", birthday: "21.05.15" },
    { name: "Emma", email: "emma@test.com", currentSubscription: "standard", createdAt: "23.01.10", birthday: "23.11.03" },
    { name: "Alex", email: "alex@test.com", currentSubscription: "basic", createdAt: "22.02.25", birthday: "22.02.07" },
    { name: "John", email: "john@test.com", currentSubscription: "premium", createdAt: "21.12.20", birthday: "21.05.15" },
    { name: "Emma", email: "emma@test.com", currentSubscription: "standard", createdAt: "23.01.10", birthday: "23.11.03" },
    { name: "Alex", email: "alex@test.com", currentSubscription: "basic", createdAt: "22.02.25", birthday: "22.02.07" },
    { name: "John", email: "john@test.com", currentSubscription: "premium", createdAt: "21.12.20", birthday: "21.05.15" },
    { name: "Emma", email: "emma@test.com", currentSubscription: "standard", createdAt: "23.01.10", birthday: "23.11.03" },
    { name: "Alex", email: "alex@test.com", currentSubscription: "basic", createdAt: "22.02.25", birthday: "22.02.07" },
    { name: "John", email: "john@test.com", currentSubscription: "premium", createdAt: "21.12.20", birthday: "21.05.15" },
    { name: "Emma", email: "emma@test.com", currentSubscription: "standard", createdAt: "23.01.10", birthday: "23.11.03" },
    { name: "Alex", email: "alex@test.com", currentSubscription: "basic", createdAt: "22.02.25", birthday: "22.02.07" },
    { name: "John", email: "john@test.com", currentSubscription: "premium", createdAt: "21.12.20", birthday: "21.05.15" },
    { name: "Emma", email: "emma@test.com", currentSubscription: "standard", createdAt: "23.01.10", birthday: "23.11.03" },
    { name: "Alex", email: "alex@test.com", currentSubscription: "basic", createdAt: "22.02.25", birthday: "22.02.07" },
    { name: "John", email: "john@test.com", currentSubscription: "premium", createdAt: "21.12.20", birthday: "21.05.15" },
    { name: "Emma", email: "emma@test.com", currentSubscription: "standard", createdAt: "23.01.10", birthday: "23.11.03" },
    { name: "Alex", email: "alex@test.com", currentSubscription: "basic", createdAt: "22.02.25", birthday: "22.02.07" },
    { name: "John", email: "john@test.com", currentSubscription: "premium", createdAt: "21.12.20", birthday: "21.05.15" },
    { name: "Emma", email: "emma@test.com", currentSubscription: "standard", createdAt: "23.01.10", birthday: "23.11.03" },
    { name: "Alex", email: "alex@test.com", currentSubscription: "basic", createdAt: "22.02.25", birthday: "22.02.07" },
    { name: "John", email: "john@test.com", currentSubscription: "premium", createdAt: "21.12.20", birthday: "21.05.15" },
    { name: "Emma", email: "emma@test.com", currentSubscription: "standard", createdAt: "23.01.10", birthday: "23.11.03" },
    { name: "Alex", email: "alex@test.com", currentSubscription: "basic", createdAt: "22.02.25", birthday: "22.02.07" },
    { name: "John", email: "john@test.com", currentSubscription: "premium", createdAt: "21.12.20", birthday: "21.05.15" },
    { name: "Emma", email: "emma@test.com", currentSubscription: "standard", createdAt: "23.01.10", birthday: "23.11.03" },
    { name: "Alex", email: "alex@test.com", currentSubscription: "basic", createdAt: "22.02.25", birthday: "22.02.07" },
    { name: "John", email: "john@test.com", currentSubscription: "premium", createdAt: "21.12.20", birthday: "21.05.15" },
    { name: "Emma", email: "emma@test.com", currentSubscription: "standard", createdAt: "23.01.10", birthday: "23.11.03" },
    { name: "Alex", email: "alex@test.com", currentSubscription: "basic", createdAt: "22.02.25", birthday: "22.02.07" },
    { name: "John", email: "john@test.com", currentSubscription: "premium", createdAt: "21.12.20", birthday: "21.05.15" },
    { name: "Emma", email: "emma@test.com", currentSubscription: "standard", createdAt: "23.01.10", birthday: "23.11.03" },
    { name: "Alex", email: "alex@test.com", currentSubscription: "basic", createdAt: "22.02.25", birthday: "22.02.07" },
    { name: "John", email: "john@test.com", currentSubscription: "premium", createdAt: "21.12.20", birthday: "21.05.15" },
    { name: "Emma", email: "emma@test.com", currentSubscription: "standard", createdAt: "23.01.10", birthday: "23.11.03" },
    { name: "Alex", email: "alex@test.com", currentSubscription: "basic", createdAt: "22.02.25", birthday: "22.02.07" },
    { name: "John", email: "john@test.com", currentSubscription: "premium", createdAt: "21.12.20", birthday: "21.05.15" },
    { name: "Emma", email: "emma@test.com", currentSubscription: "standard", createdAt: "23.01.10", birthday: "23.11.03" },
    { name: "Alex", email: "alex@test.com", currentSubscription: "basic", createdAt: "22.02.25", birthday: "22.02.07" },
    { name: "John", email: "john@test.com", currentSubscription: "premium", createdAt: "21.12.20", birthday: "21.05.15" },
    { name: "Emma", email: "emma@test.com", currentSubscription: "standard", createdAt: "23.01.10", birthday: "23.11.03" },
    { name: "Alex", email: "alex@test.com", currentSubscription: "basic", createdAt: "22.02.25", birthday: "22.02.07" },
    { name: "John", email: "john@test.com", currentSubscription: "premium", createdAt: "21.12.20", birthday: "21.05.15" },
    { name: "Emma", email: "emma@test.com", currentSubscription: "standard", createdAt: "23.01.10", birthday: "23.11.03" },
    { name: "Alex", email: "alex@test.com", currentSubscription: "basic", createdAt: "22.02.25", birthday: "22.02.07" },
    { name: "John", email: "john@test.com", currentSubscription: "premium", createdAt: "21.12.20", birthday: "21.05.15" },
    { name: "Emma", email: "emma@test.com", currentSubscription: "standard", createdAt: "23.01.10", birthday: "23.11.03" },
    { name: "Alex", email: "alex@test.com", currentSubscription: "basic", createdAt: "22.02.25", birthday: "22.02.07" },
    { name: "John", email: "john@test.com", currentSubscription: "premium", createdAt: "21.12.20", birthday: "21.05.15" },
    { name: "Emma", email: "emma@test.com", currentSubscription: "standard", createdAt: "23.01.10", birthday: "23.11.03" },
    { name: "Alex", email: "alex@test.com", currentSubscription: "basic", createdAt: "22.02.25", birthday: "22.02.07" },
    { name: "John", email: "john@test.com", currentSubscription: "premium", createdAt: "21.12.20", birthday: "21.05.15" },
    { name: "Emma", email: "emma@test.com", currentSubscription: "standard", createdAt: "23.01.10", birthday: "23.11.03" },
    { name: "Alex", email: "alex@test.com", currentSubscription: "basic", createdAt: "22.02.25", birthday: "22.02.07" },
    { name: "John", email: "john@test.com", currentSubscription: "premium", createdAt: "21.12.20", birthday: "21.05.15" },
    { name: "Emma", email: "emma@test.com", currentSubscription: "standard", createdAt: "23.01.10", birthday: "23.11.03" },
    { name: "Alex", email: "alex@test.com", currentSubscription: "basic", createdAt: "22.02.25", birthday: "22.02.07" },
    { name: "John", email: "john@test.com", currentSubscription: "premium", createdAt: "21.12.20", birthday: "21.05.15" },
    { name: "Emma", email: "emma@test.com", currentSubscription: "standard", createdAt: "23.01.10", birthday: "23.11.03" },
    { name: "Alex", email: "alex@test.com", currentSubscription: "basic", createdAt: "22.02.25", birthday: "22.02.07" },
    { name: "John", email: "john@test.com", currentSubscription: "premium", createdAt: "21.12.20", birthday: "21.05.15" },
    { name: "Emma", email: "emma@test.com", currentSubscription: "standard", createdAt: "23.01.10", birthday: "23.11.03" },
    { name: "Alex", email: "alex@test.com", currentSubscription: "basic", createdAt: "22.02.25", birthday: "22.02.07" },
    { name: "John", email: "john@test.com", currentSubscription: "premium", createdAt: "21.12.20", birthday: "21.05.15" },
    { name: "Emma", email: "emma@test.com", currentSubscription: "standard", createdAt: "23.01.10", birthday: "23.11.03" },
    { name: "Alex", email: "alex@test.com", currentSubscription: "basic", createdAt: "22.02.25", birthday: "22.02.07" },
    { name: "John", email: "john@test.com", currentSubscription: "premium", createdAt: "21.12.20", birthday: "21.05.15" },
    { name: "Emma", email: "emma@test.com", currentSubscription: "standard", createdAt: "23.01.10", birthday: "23.11.03" },
    { name: "Alex", email: "alex@test.com", currentSubscription: "basic", createdAt: "22.02.25", birthday: "22.02.07" },
    { name: "John", email: "john@test.com", currentSubscription: "premium", createdAt: "21.12.20", birthday: "21.05.15" },
    { name: "Emma", email: "emma@test.com", currentSubscription: "standard", createdAt: "23.01.10", birthday: "23.11.03" },
    { name: "Alex", email: "alex@test.com", currentSubscription: "basic", createdAt: "22.02.25", birthday: "22.02.07" },
    { name: "John", email: "john@test.com", currentSubscription: "premium", createdAt: "21.12.20", birthday: "21.05.15" },
    { name: "Emma", email: "emma@test.com", currentSubscription: "standard", createdAt: "23.01.10", birthday: "23.11.03" },
    { name: "Alex", email: "alex@test.com", currentSubscription: "basic", createdAt: "22.02.25", birthday: "22.02.07" },
    { name: "John", email: "john@test.com", currentSubscription: "premium", createdAt: "21.12.20", birthday: "21.05.15" },
    { name: "Emma", email: "emma@test.com", currentSubscription: "standard", createdAt: "23.01.10", birthday: "23.11.03" },
    { name: "Alex", email: "alex@test.com", currentSubscription: "basic", createdAt: "22.02.25", birthday: "22.02.07" },
    { name: "John", email: "john@test.com", currentSubscription: "premium", createdAt: "21.12.20", birthday: "21.05.15" },
    { name: "Emma", email: "emma@test.com", currentSubscription: "standard", createdAt: "23.01.10", birthday: "23.11.03" },
  ]);

  const [columnDefs] = useState([
    { field: "name", headerName: "Name" },
    { field: "email", headerName: "Email" },
    { field: "currentSubscription", headerName: "Current subscription" },
    { field: "createdAt", headerName: "Created at" },
    { field: "birthday", headerName: "Birthday" },
    {
      field: "delete",
      headerName: "",
      cellRenderer: () => <button className="delete-btn">Delete</button>,
      width: 100,
    },
  ]);

  return <TablePage rowData={rowData} columnDefs={columnDefs} pagination={true} paginationPageSize={7} />;
};

export default Customers;

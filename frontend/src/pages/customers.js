import TablePage from "./tablePage";

const Customers = () => {
  const columnDefs = [
    { field: "name", headerName: "Name" },
    { field: "email", headerName: "Email" },
    { field: "currentSubscription", headerName: "Current subscription" },
    { field: "createdAt", headerName: "Created at" },
    {
      field: "delete",
      headerName: "",
      cellRenderer: () => <button className="delete-btn">Delete</button>,
      width: 100,
    },
  ];

  const transformData = (data) =>
    data.users.map((user) => ({
      name: user.name,
      email: user.email,
      currentSubscription: user.subscription_plan_name,
      createdAt: new Date(user.created_at).toLocaleDateString(),
    }));

  return <TablePage
    apiEndpoint="/admin/users"
    columnDefs={columnDefs}
    transformData={transformData} />;
};

export default Customers;

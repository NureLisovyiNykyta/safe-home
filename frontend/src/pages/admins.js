import TablePage from "./tablePage";

const Admins = () => {
  const columnDefs = [
    { field: "name", headerName: "Name" },
    { field: "email", headerName: "Email" },
    { field: "createdAt", headerName: "Created at" },
  ];

  const transformData = (data) =>
    data.admins.map((admin) => ({
      name: admin.name,
      email: admin.email,
      createdAt: new Date(admin.created_at).toLocaleDateString(),
    }));

  return <TablePage
    apiEndpoint="/admin/admins"
    columnDefs={columnDefs}
    transformData={transformData} />;
};

export default Admins;

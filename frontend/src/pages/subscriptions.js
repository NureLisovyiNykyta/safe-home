import TablePage from "./tablePage";

const Subscriptions = () => {
  const columnDefs = [
    { field: "name", headerName: "Name" },
    { field: "maxHomes", headerName: "Max homes" },
    { field: "maxSensors", headerName: "Max sensors" },
    { field: "price", headerName: "Price" },
    { field: "duration", headerName: "Duration (days)" },
    {
      field: "edit",
      headerName: "",
      cellRenderer: () => <button className="edit-btn">Edit</button>,
      width: 100,
    },
  ];

  const transformData = (data) =>
    data.subscription_plans.map((plan) => ({
      name: plan.name,
      maxHomes: plan.max_homes,
      maxSensors: plan.max_sensors,
      price: `${plan.price.toFixed(2)}$`,
      duration: plan.description,
    }));

  return <TablePage
    apiEndpoint="/subscription_plans"
    columnDefs={columnDefs}
    transformData={transformData} />;
};

export default Subscriptions;

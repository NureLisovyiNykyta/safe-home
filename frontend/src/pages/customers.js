import { useState } from "react";
import { useNavigate } from "react-router-dom";
import TablePage from "./tablePage";
import api from "../apiConfig";

const Customers = () => {
  const navigate = useNavigate();
  const [refreshKey, setRefreshKey] = useState(0);

  const columnDefs = [
    { field: "name", headerName: "Name" },
    { field: "email", headerName: "Email" },
    { field: "currentSubscription", headerName: "Current subscription" },
    { field: "createdAt", headerName: "Created at" },
    {
      field: "goToUser",
      headerName: "",
      cellRenderer: (params) => (
        <button
          className="go-to-user-btn"
          onClick={() => navigate(`/subscriptions/user/${params.data.user_id}`)}
        >
          Go to user
        </button>
      ),
      width: 150,
      filter: false,
    },
    {
      field: "delete",
      headerName: "",
      cellRenderer: (params) => (
        <button
          className="delete-btn"
          onClick={() => handleDeleteUser(params.data.user_id)}
        >
          Delete user
        </button>
      ),
      width: 100,
      filter: false,
    },
  ];

  const handleDeleteUser = async (userId) => {
    if (!window.confirm("Are you sure you want to delete this user?")) {
      return;
    }

    try {
      const response = await api.post(`/admin/delete_user/user?user=${userId}`);
      if (response.status === 200) {
        setRefreshKey((prev) => prev + 1);
      }
    } catch (error) {
      console.error("Error deleting user:", error);
    }
  };

  const transformData = (data) =>
    data.users.map((user) => ({
      ...user,
      name: user.name,
      email: user.email,
      currentSubscription: user.subscription_plan_name,
      createdAt: new Date(user.created_at).toLocaleDateString(),
    }));

  return (
    <TablePage
      apiEndpoint="/admin/users"
      columnDefs={columnDefs}
      transformData={transformData}
      refreshKey={refreshKey} 
    />
  );
};

export default Customers;

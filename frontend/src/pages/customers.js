import { useNavigate } from "react-router-dom";
import TablePage from "./tablePage";
import api from "../apiConfig";

const Customers = () => {
  const navigate = useNavigate();

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
    }
  ];

  const handleDeleteUser = async (userId) => {
    try {
      const response = await api.post(`/admin/delete_user/user?user=${userId}`);
      if (response.status === 200) {
        alert("User deleted successfully");
        setTimeout(() => {
          window.location.reload();
        }, 1000);
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
    />
  );
};

export default Customers;

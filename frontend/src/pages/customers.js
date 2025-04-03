import { useState } from "react";
import { useNavigate } from "react-router-dom";
import TablePage from "./tablePage";
import api from "../apiConfig";
import Modal from "../components/modal";

const Customers = () => {
  const navigate = useNavigate();
  const [refreshKey, setRefreshKey] = useState(0);
  const [notification, setNotification] = useState({ isOpen: false, message: "" });
  const [confirmModal, setConfirmModal] = useState({ isOpen: false, userId: null });

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
          className="row-btn go-to-user"
          onClick={() => navigate(`/subscriptions/user/${params.data.user_id}`)}
        >
          Go to user
        </button>
      ),
      width: 150,
      filter: false,
      cellStyle: { textAlign: "center" },
    },
    {
      field: "delete",
      headerName: "",
      cellRenderer: (params) => (
        <button
          className="row-btn delete"
          onClick={() => setConfirmModal({ isOpen: true, userId: params.data.user_id })}
        >
          Delete user
        </button>
      ),
      width: 100,
      filter: false,
      cellStyle: { textAlign: "center" },
    },
  ];

  const handleDeleteUser = async (userId) => {
    try {
      const response = await api.post(`/admin/delete_user/user?user=${userId}`);
      if (response.status === 200) {
        setNotification({ isOpen: true, message: "User deleted successfully" });
        setRefreshKey((prev) => prev + 1);
      }
    } catch (error) {
      console.error("Error deleting user:", error);
      setNotification({ isOpen: true, message: "Failed to delete user" });
    } finally {
      setConfirmModal({ isOpen: false, userId: null });
    }
  };

  return (
    <>
      <TablePage
        apiEndpoint="/admin/users"
        columnDefs={columnDefs}
        transformData={(data) =>
          data.users.map((user) => ({
            ...user,
            name: user.name,
            email: user.email,
            currentSubscription: user.subscription_plan_name,
            createdAt: new Date(user.created_at).toLocaleDateString(),
          }))
        }
        refreshKey={refreshKey}
      />
      <Modal
        isOpen={confirmModal.isOpen}
        onClose={() => setConfirmModal({ isOpen: false, userId: null })}
        showCloseButton={false}
      >
        <p>Are you sure you want to delete this user?</p>
        <div>
          <button
            onClick={() => setConfirmModal({ isOpen: false, userId: null })}
          >
            Cancel
          </button>
          <button
            onClick={() => handleDeleteUser(confirmModal.userId)}
          >
            Confirm
          </button>
        </div>
      </Modal>
      <Modal
        isOpen={notification.isOpen}
        onClose={() => setNotification({ isOpen: false, message: "" })}
        message={notification.message}
        showCloseButton={true}
      />
    </>
  );
};

export default Customers;

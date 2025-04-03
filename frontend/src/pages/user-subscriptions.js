import { useParams } from "react-router-dom";
import { useState } from "react";
import TablePage from "./tablePage";
import api from "../apiConfig";
import Modal from "../components/modal";

const UserSubscriptions = () => {
  const { userId } = useParams();
  const [refreshKey, setRefreshKey] = useState(0);
  const [notification, setNotification] = useState({ isOpen: false, message: "" });

  const columnDefs = [
    { field: "subscriptionPlan", headerName: "Subscription plan" },
    { field: "startDate", headerName: "Start date" },
    { field: "endDate", headerName: "End date" },
    {
      field: "cancel",
      headerName: "",
      cellRenderer: (params) =>
        params.data.isCancelable ? (
          <button
            className="row-btn cancel"
            onClick={() => handleCancel(params.data.subscriptionId)}
          >
            Cancel
          </button>
        ) : null,
      width: 100,
      filter: false,
      cellStyle: { textAlign: "center" },
    },
  ];

  const transformData = (data) =>
    data.subscriptions.map((sub) => ({
      subscriptionPlan: sub.plan.name,
      startDate: new Date(sub.start_date).toLocaleDateString(),
      endDate: new Date(sub.end_date).toLocaleDateString(),
      isCancelable: sub.is_active && sub.plan.name !== "basic",
      subscriptionId: sub.subscription_id,
    }));

  const handleCancel = async (subscriptionId) => {
    try {
      await api.post(`/admin/cancel_current_user_subscription/user?user=${userId}&subscription=${subscriptionId}`);
      setNotification({ isOpen: true, message: "Subscription canceled successfully" });
      setRefreshKey((prev) => prev + 1);
    } catch (err) {
      console.error("Error canceling subscription:", err);
      setNotification({ isOpen: true, message: "Failed to cancel subscription" });
    }
  };

  return (
    <>
      <TablePage
        apiEndpoint={`/admin/user_subscriptions/user?user=${userId}`}
        columnDefs={columnDefs}
        transformData={transformData}
        refreshKey={refreshKey}
      />
      <Modal
        isOpen={notification.isOpen}
        onClose={() => setNotification({ isOpen: false, message: "" })}
        message={notification.message}
        showCloseButton={true}
      />
    </>
  );
};

export default UserSubscriptions;

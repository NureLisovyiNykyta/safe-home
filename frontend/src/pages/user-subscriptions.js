import { useParams } from "react-router-dom";
import TablePage from "./tablePage";
import api from "../apiConfig";

const UserSubscriptions = () => {
  const { userId } = useParams();

  const columnDefs = [
    { field: "subscriptionPlan", headerName: "Subscription plan" },
    { field: "startDate", headerName: "Start date" },
    { field: "endDate", headerName: "End date" },
    {
      field: "cancel",
      headerName: "Actions",
      cellRenderer: (params) =>
        params.data.isCancelable ? (
          <button
            className="cancel-btn"
            onClick={() => handleCancel(params.data.subscriptionId)}
          >
            Cancel
          </button>
        ) : null,
      width: 100,
      filter: false,
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

  const handleCancel = async () => {
    try {
      await api.post(`/admin/cancel_current_user_subscription/user?user=${userId}`);
      alert("Subscription canceled successfully.");
      setTimeout(() => {
        window.location.reload();
      }, 1000);
    } catch (err) {
      console.error("Error canceling subscription:", err);
    }
  };

  return (
    <TablePage
      apiEndpoint={`/admin/user_subscriptions/user?user=${userId}`}
      columnDefs={columnDefs}
      transformData={transformData}
    />
  );
};

export default UserSubscriptions;

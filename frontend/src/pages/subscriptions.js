import { useState } from "react";
import TablePage from "./tablePage";
import Modal from "../components/modal";
import { EditPlanForm } from "../components/forms/editPlan";

const Subscriptions = () => {
  const [modalIsOpen, setModalIsOpen] = useState(false);
  const [refreshKey, setRefreshKey] = useState(0);
  const [editData, setEditData] = useState(null);
  const columnDefs = [
    { field: "name", headerName: "Name" },
    { field: "maxHomes", headerName: "Max homes" },
    { field: "maxSensors", headerName: "Max sensors" },
    { field: "price", headerName: "Price" },
    { field: "duration", headerName: "Duration (days)" },
    {
      field: "edit",
      headerName: "Actions",
      cellRenderer: (params) => (
        <button
          className="edit-btn"
          onClick={() => {
            setEditData(params.data);
            setModalIsOpen(true);
          }}
        >
          Edit
        </button>
      ),
      width: 100,
      filter: false,
    },
  ];

  const transformData = (data) =>
    data.subscription_plans.map((plan) => ({
      id: plan.plan_id,
      name: plan.name,
      maxHomes: plan.max_homes,
      maxSensors: plan.max_sensors,
      price: `${plan.price.toFixed(2)}$`,
      duration: plan.duration,
    }));

  const handleModalClose = (shouldRefresh = false) => {
    setModalIsOpen(false);
    setEditData(null); // Скидаємо дані для редагування
    if (shouldRefresh) {
      setRefreshKey((prev) => prev + 1); // Оновлюємо таблицю
    }
  };

  return (
    <>
      <TablePage
        apiEndpoint="/subscription_plans"
        columnDefs={columnDefs}
        transformData={transformData}
        showActions={true}
        onAddClick={() => {
          setEditData(null); // Очищаємо дані для додавання нового плану
          setModalIsOpen(true);
        }}
        refreshKey={refreshKey} // Передаємо refreshKey для оновлення таблиці
      />
      {modalIsOpen && (
        <Modal isOpen={modalIsOpen} onClose={() => handleModalClose(false)}>
          <EditPlanForm
            initialData={editData} // Передаємо дані для редагування або null для додавання
            onBack={() => handleModalClose(false)}
            onSuccess={() => handleModalClose(true)} // Оновлюємо таблицю після успішного сабміту
          />
        </Modal>
      )}
    </>
  );
};

export default Subscriptions;

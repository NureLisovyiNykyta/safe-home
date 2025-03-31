import FormTemplate from "./template";
import api from "../../apiConfig";

export const EditPlanForm = ({ initialData = null, onBack, onSuccess }) => {
  const handleSubmit = async (data, setStatus) => {
    try {
      if (initialData) {
        // Редагування існуючого плану
        await api.put(`/admin/update_subscription_plan/plan?plan=${initialData.id}`, data);
        setStatus({ message: "Plan updated successfully!", type: "success" });
      } else {
        // Додавання нового плану
        await api.post("/admin/create_subscription_plan", data);
        setStatus({ message: "Plan added successfully!", type: "success" });
      }
      setTimeout(() => {
        onSuccess(); // Викликаємо onSuccess після успішного сабміту
        onBack(); // Закриваємо форму
      }, 1000);
    } catch (error) {
      setStatus({
        message: error.response?.data?.message || "Failed to save plan.",
        type: "error",
      });
    }
  };

  return (
    <FormTemplate
      title={initialData ? "Edit plan" : "Add new plan"} // Змінюємо заголовок залежно від режиму
      buttonText={initialData ? "Save changes" : "Add plan"} // Змінюємо текст кнопки
      onSubmit={handleSubmit}
      fields={[
        {
          name: "name",
          type: "text",
          placeholder: "name",
          defaultValue: initialData?.name || "",
          validation: { required: "Name is required" },
        },
        {
          name: "maxHomes",
          type: "number",
          placeholder: "max homes",
          defaultValue: initialData?.maxHomes || "",
        },
        {
          name: "maxSensors",
          type: "number",
          placeholder: "max sensors",
          defaultValue: initialData?.maxSensors || "",
        },
        {
          name: "price",
          type: "number",
          placeholder: "price",
          defaultValue: initialData?.price || "",
        },
        {
          name: "duration",
          type: "number",
          placeholder: "duration (days)",
          defaultValue: initialData?.duration || "",
        },
      ]}
      onBack={onBack}
    />
  );
};
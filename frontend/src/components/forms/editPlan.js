import FormTemplate from "./template";
import api from "../../apiConfig";

export const EditPlanForm = ({ initialData = null, onBack, onSuccess }) => {
  const handleSubmit = async (data, setStatus) => {
    try {
      const formattedData = {
        ...data,
        price: parseFloat(data.price),
      };

      if (initialData) {
        await api.put(`/admin/update_subscription_plan/plan?plan=${initialData.id}`, formattedData);
        setStatus({ message: "Plan updated successfully!", type: "success" });
      } else {
        await api.post("/admin/create_subscription_plan", formattedData);
        setStatus({ message: "Plan added successfully!", type: "success" });
      }

      setTimeout(() => {
        onSuccess();
        onBack();
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
      title={initialData ? "Edit plan" : "Add new plan"}
      buttonText={initialData ? "Save changes" : "Add plan"}
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
          validation: { required: "Price is required", min: { value: 0.01, message: "Price must be positive" } },
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
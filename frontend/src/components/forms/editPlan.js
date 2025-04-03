import { useTranslation } from "react-i18next";
import FormTemplate from "./template";
import api from "../../configs/api";

export const EditPlanForm = ({ initialData = null, onBack, onSuccess }) => {
  const { t } = useTranslation();

  const handleSubmit = async (data, setStatus) => {
    try {
      const formattedData = {
        name: data.name,
        max_homes: parseInt(data.maxHomes, 10),
        max_sensors: parseInt(data.maxSensors, 10),
        price: parseFloat(data.price),
        duration_days: parseInt(data.duration, 10),
      };

      if (initialData) {
        await api.put(`/admin/update_subscription_plan/plan?plan=${initialData.id}`, formattedData);
        setStatus({ message: t("editPlanForm.planUpdatedSuccessfully"), type: "success" });
      } else {
        await api.post("/admin/create_subscription_plan", formattedData);
        setStatus({ message: t("editPlanForm.planAddedSuccessfully"), type: "success" });
      }

      setTimeout(() => {
        onSuccess();
        onBack();
      }, 1000);
    } catch (error) {
      setStatus({
        message: error.response?.data?.message || t("editPlanForm.failedToSavePlan"),
        type: "error",
      });
    }
  };

  return (
    <FormTemplate
      title={initialData ? t("editPlanForm.editPlan") : t("editPlanForm.addNewPlan")}
      buttonText={initialData ? t("editPlanForm.saveChanges") : t("editPlanForm.addPlan")}
      onSubmit={handleSubmit}
      fields={[
        {
          name: "name",
          type: "text",
          placeholder: t("editPlanForm.name"),
          defaultValue: initialData?.name || "",
          validation: { required: t("editPlanForm.nameRequired") },
        },
        {
          name: "maxHomes",
          type: "number",
          placeholder: t("editPlanForm.maxHomes"),
          defaultValue: initialData?.maxHomes || "",
        },
        {
          name: "maxSensors",
          type: "number",
          placeholder: t("editPlanForm.maxSensors"),
          defaultValue: initialData?.maxSensors || "",
        },
        {
          name: "price",
          type: "text",
          placeholder: t("editPlanForm.price"),
          defaultValue: initialData?.price || "",
          validation: {
            required: t("editPlanForm.priceRequired"),
            pattern: {
              value: /^\d+(\.\d{1,2})?$/,
              message: t("editPlanForm.pricePattern"),
            },
          },
        },
        {
          name: "duration",
          type: "number",
          placeholder: t("editPlanForm.duration"),
          defaultValue: initialData?.duration || "",
        },
      ]}
      onBack={onBack}
    />
  );
};

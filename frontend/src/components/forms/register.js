import FormTemplate from "./template";
import api from "../../apiConfig";

const RegisterForm = ({ onBack }) => {
  const handleRegister = async (data, setStatus) => {
    try {
      const response = await api.post("/admin/register_admin", data);
      if (response.status === 201) {
        setStatus({ message: "Admin added successfully!", type: "success" });
        setTimeout(() => {
          onBack();
        }, 1000);
      }
    } catch (error) {
      setStatus({
        message: error.response?.data?.message || "Failed to register admin.",
        type: "error",
      });
    }
  };

  return (
    <FormTemplate
      title="Add new admin"
      buttonText="Register"
      onSubmit={handleRegister}
      fields={[
        {
          name: "name",
          type: "text",
          placeholder: "name",
          validation: { required: "Name is required" },
        },
        {
          name: "email",
          type: "email",
          placeholder: "email",
          validation: { required: "Email is required" },
        },
        {
          name: "password",
          type: "password",
          placeholder: "password",
          validation: {
            required: "Password is required",
            minLength: { value: 8, message: "Password must be at least 8 characters" },
          },
        },
      ]}
      onBack={onBack} 
    />
  );
};

export default RegisterForm;

import FormTemplate from "./template";
import api from "../../apiConfig";

export const ResetPasswordForm = ({ onBack }) => {
  const handleResetPassword = async (data, setStatus) => {
    try {
      const response = await api.post("/reset_password", { email: data.email });
      if (response.status === 200) {
        setStatus({ message: "Password reset request sent successfully. Redirecting...", type: "success" });
        setTimeout(() => {
          onBack();
        }, 3000);
      }
    } catch (error) {
      setStatus({
        message: error.response?.data?.message || "Failed to send reset password request.",
        type: "error",
      });
    }
  };

  return (
    <FormTemplate
      title="Reset password"
      buttonText="send a request"
      onSubmit={handleResetPassword}
      fields={[
        {
          name: "email",
          type: "email",
          placeholder: "email",
          validation: { required: "email is required" },
        },
      ]}
      onBack={onBack}
      className={"reset-password-form"}
    />
  );
};

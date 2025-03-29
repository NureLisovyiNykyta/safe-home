import FormTemplate from "./template";
import api from "../../apiConfig";
import { useAuth } from "../../authContext";

export const LoginForm = () => {
  const { login } = useAuth();

  const handleLogin = async (data, setStatus) => {
    try {
      const response = await api.post("/login", data);
      if (response.status === 200) {
        setStatus({ message: "Login successful. Redirecting...", type: "success" });
        setTimeout(() => {
          login();
        }, 2000);
      }
    } catch (error) {
      setStatus({
        message: error.response?.data?.message || "Login failed.",
        type: "error",
      });
    }
  };

  return (
    <FormTemplate
      title="Connect a system"
      buttonText="log in"
      onSubmit={handleLogin}
      fields={[
        {
          name: "email",
          type: "email",
          placeholder: "email",
          validation: { required: "email is required" },
        },
        {
          name: "password",
          type: "password",
          placeholder: "password",
          validation: {
            required: "password is required",
            minLength: { value: 8, message: "password must be at least 8 characters" },
          },
        },
      ]}
      isLogin={true}
      className={"login-form"}
    />
  );
};
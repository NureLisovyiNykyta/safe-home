import { useState } from "react";
import { useTranslation } from "react-i18next";
import FormTemplate from "./template";
import { ResetPasswordForm } from "./resetPassword";
import api from "../../apiConfig";
import { useAuth } from "../../authContext";

export const LoginForm = ({ changeLanguage }) => {
  const { login } = useAuth();
  const [isResetPassword, setIsResetPassword] = useState(false);
  const { t } = useTranslation();

  const handleLogin = async (data, setStatus) => {
    try {
      const response = await api.post("/login", data);
      if (response.status === 200) {
        setStatus({ message: t("login.success"), type: "success" });
        setTimeout(() => {
          login();
        }, 2000);
      }
    } catch (error) {
      setStatus({
        message: error.response?.data?.message || t("login.failed"),
        type: "error",
      });
    }
  };

  return isResetPassword ? (
    <ResetPasswordForm onBack={() => setIsResetPassword(false)} />
  ) : (
    <FormTemplate
      title={t("login.title")}
      buttonText={t("login.buttonText")}
      onSubmit={handleLogin}
      fields={[
        {
          name: "email",
          type: "email",
          placeholder: t("login.emailPlaceholder"),
          validation: { required: t("login.emailRequired") },
        },
        {
          name: "password",
          type: "password",
          placeholder: t("login.passwordPlaceholder"),
          validation: {
            required: t("login.passwordRequired"),
            minLength: { value: 8, message: t("login.passwordMinLength") },
          },
        },
      ]}
      isLogin={true}
      className={"login-form"}
      onForgotPassword={() => setIsResetPassword(true)}
      changeLanguage={changeLanguage}
    />
  );
};

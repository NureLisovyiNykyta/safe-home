import './template.css';
import { IoArrowBackOutline } from "react-icons/io5";
import { useForm } from "react-hook-form";
import { useState, useEffect } from 'react';
import { useTranslation } from "react-i18next";
import { FiEye, FiEyeOff } from "react-icons/fi";
import LanguageSwitcher from "../languageSwitcher";
import api from "../../configs/api";
import googleLogo from './google-logo.png';

const FormTemplate = ({
  title,
  fields,
  onSubmit,
  buttonText,
  isLogin = false,
  className,
  onForgotPassword,
  onBack,
  changeLanguage = null,
  isResetPassword = false
}) => {
  const { t } = useTranslation();
  const { register, handleSubmit, formState: { errors }, reset } = useForm();
  const [showPassword, setShowPassword] = useState(false);
  const [status, setStatus] = useState({ message: null, type: null });

  useEffect(() => {
    const defaultValues = {};
    fields.forEach(({ name, defaultValue }) => {
      if (defaultValue !== undefined) {
        defaultValues[name] = defaultValue;
      }
    });
    reset(defaultValues);
  }, [fields, reset]);

  useEffect(() => {
    setTimeout(() => {
      setStatus({ message: null, type: null });
    }, 3000);
  }, [status.message]);

  const handleFormSubmit = async (data) => {
    try {
      await onSubmit(data, setStatus);
    } catch (error) {
      setStatus({
        message: error.response?.data?.message || t("error.generic"),
        type: "error",
      });
    }
  };

  const handleGoogleLogin = async () => {
    window.location.href = api.defaults.baseURL + '/login/google';
  };

  return (
    <div className={`form-template ${className}`}>
      <div className='header'>
        {changeLanguage && <LanguageSwitcher changeLanguage={changeLanguage} />}
        <div className='title'>
          <IoArrowBackOutline className='icon' onClick={onBack} />
          {title}
        </div>
      </div>
      {status.message && <div className={`status ${status.type}`}>{status.message}</div>}
      <form className='form' onSubmit={handleSubmit(handleFormSubmit)}>
        {isResetPassword && (
          <div className='reset-password'>
            <p>{t("resetPassword.instruction")}</p>
          </div>
        )}
        {fields.map(({ name, type, label, validation, showLabel = false, placeholder }) => (
          <div className="form-group" key={name}>
            {showLabel && <label htmlFor={name}>{label}</label>}
            <input
              id={name}
              type={name === "password" && showPassword ? "text" : type}
              {...register(name, validation)}
              autoComplete={name === "password" ? "new-password" : "off"}
              placeholder={!showLabel ? placeholder : undefined}
            />
            {errors[name] && <p className="error">{errors[name].message}</p>}
            {name === "password" && (
              showPassword ? (
                <FiEyeOff className="icon" onClick={() => setShowPassword(false)} />
              ) : (
                <FiEye className="icon" onClick={() => setShowPassword(true)} />
              )
            )}
          </div>
        ))}
        {isLogin && (
          <div className='additional'>
            <span className='forgot' onClick={onForgotPassword}>{t("login.forgotPassword")}</span>
          </div>
        )}
        <button type='submit'>{buttonText}</button>
      </form>
      {isLogin && (
        <button
          className='google-btn'
          onClick={handleGoogleLogin}
        >
          <img className='google-icon' src={googleLogo} alt="Google" />
          {t("login.googleLogin")}
        </button>
      )}
    </div>
  );
};

export default FormTemplate;

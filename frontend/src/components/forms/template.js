import './template.css';
import { IoArrowBackOutline } from "react-icons/io5";
import { useForm } from "react-hook-form";
import { useState } from 'react';
import { useTranslation } from "react-i18next";
import { FiEye, FiEyeOff } from "react-icons/fi";
import LanguageSwitcher from "../languageSwitcher";

const FormTemplate = ({
  title,
  fields,
  onSubmit,
  buttonText,
  isLogin = false,
  className,
  onForgotPassword,
  onBack,
  changeLanguage
}) => {
  const { t } = useTranslation();
  const { register, handleSubmit, formState: { errors } } = useForm();
  const [showPassword, setShowPassword] = useState(false);
  const [status, setStatus] = useState({ message: null, type: null });

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

  return (
    <div className={`form-template ${className}`}>
      <div className='header'>
        <IoArrowBackOutline className='icon' onClick={onBack} />
        <span>{title}</span>
        <LanguageSwitcher changeLanguage={changeLanguage} />
      </div>
      {status.message && <div className={`status ${status.type}`}>{status.message}</div>}
      <form className='form' onSubmit={handleSubmit(handleFormSubmit)}>
        {fields.map(({ name, type, placeholder, validation }) => (
          <div className='form-group' key={name}>
            <input
              placeholder={placeholder}
              type={name === "password" && showPassword ? 'text' : type}
              {...register(name, validation)}
            />
            {errors[name] && <p className='error'>{errors[name].message}</p>}
            {name === "password" && (
              showPassword ?
                <FiEyeOff className='icon' onClick={() => setShowPassword(false)} /> :
                <FiEye className='icon' onClick={() => setShowPassword(true)} />
            )}
          </div>
        ))}
        {isLogin && (
          <div className='additional'>
            <div className='remember'>
              <input type='checkbox' id='remember-me' />
              <label htmlFor='remember-me'>{t("login.rememberMe")}</label>
            </div>
            <span className='forgot' onClick={onForgotPassword}>{t("login.forgotPassword")}</span>
          </div>
        )}
        <button type='submit'>{buttonText}</button>
      </form>
    </div>
  );
};

export default FormTemplate;

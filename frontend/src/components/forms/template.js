import './template.css';
import { IoArrowBackOutline } from "react-icons/io5";
import { useForm } from "react-hook-form";
import { useState } from 'react';
import { FiEye, FiEyeOff } from "react-icons/fi";

const FormTemplate = ({
  title,
  fields,
  onSubmit,
  buttonText,
  isLogin = false,
  className,
  onForgotPassword,
  onBack
}) => {
  const { register, handleSubmit, formState: { errors } } = useForm();
  const [showPassword, setShowPassword] = useState(false);
  const [status, setStatus] = useState({ message: null, type: null });

  const handleFormSubmit = async (data) => {
    try {
      await onSubmit(data, setStatus);
    } catch (error) {
      setStatus({
        message: error.response?.data?.message || "An error occurred.",
        type: "error",
      });
    }
  };

  return (
    <div className={`form-template ${className}`}>
      <div className='header'>
        <IoArrowBackOutline className='icon' onClick={onBack} />
        <span>{title}</span>
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
              <label htmlFor='remember-me'>remember me?</label>
            </div>
            <span className='forgot' onClick={onForgotPassword}>forgot password?</span>
          </div>
        )}
        <button type='submit'>{buttonText}</button>
      </form>
    </div>
  );
};

export default FormTemplate;

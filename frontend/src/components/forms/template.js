import './template.css';
import { IoArrowBackOutline } from "react-icons/io5";
import { useForm } from "react-hook-form";
import { useState } from 'react';
import { FiEye, FiEyeOff } from "react-icons/fi";

const FormTemplate = ({ title, status, statusType, fields, onSubmit, buttonText }) => {
  const { register, handleSubmit, formState: { errors } } = useForm();
  const [showPassword, setShowPassword] = useState(false);

  return (
    <div className='form-template'>
      <div className='header'>
        <IoArrowBackOutline className='icon' />
        <span>{title}</span>
      </div>
      {status && <div className={`status ${statusType}`}>{status}</div>}
      <form className='form' onSubmit={handleSubmit(onSubmit)}>
        {fields.map(({ name, type, placeholder, validation }) => (
          <div className='form-group' key={name}>
            <input 
              placeholder={placeholder} 
              type={name === "password" && !showPassword ? 'password' : type} 
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
        <button type='submit'>{buttonText}</button>
      </form>
    </div>
  );
};

export default FormTemplate;

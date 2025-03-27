// import './form-template.css';
// import { IoArrowBackOutline } from "react-icons/io5";
// import { useForm } from "react-hook-form";
// import { useState } from 'react';
// import { FiEye, FiEyeOff } from "react-icons/fi";

// const FormTemplate = () => {
//   const { register, handleSubmit, formState: { errors } } = useForm();
//   const [showPassword, setShowPassword] = useState(false);

//   const onSubmit = (data) => {
//     console.log("Login Data:", data);
//   };

//   return (
//     <div className='form-template'>
//       <div className='header'>
//         <IoArrowBackOutline className='icon' />
//         <span>Form Header</span>
//       </div>
//       <div className='status success'>
//         auth status
//       </div>
//       <form className='form' onSubmit={handleSubmit(onSubmit)}>
//         <div className='form-group'>
//           <input placeholder='email' type='email' {...register("email", { required: "email is required" })} />
//           {errors.email && <p className='error'>{errors.email.message}</p>}
//         </div>
//         <div className='form-group'>
//           <input placeholder='password' type={showPassword ? 'text' : 'password'} {...register("password", { required: "password is required", minLength: { value: 8, message: "password must be at least 8 characters" } })} />
//           {errors.password && <p className='error'>{errors.password.message}</p>}
//           {showPassword ?
//             <FiEyeOff className='icon' onClick={() => setShowPassword(false)} /> :
//             <FiEye className='icon' onClick={() => setShowPassword(true)} />
//           }
//         </div>
//         <div className='additional'>
//           <div className='remember'>
//             <input type='checkbox' id='remember-me' />
//             <label htmlFor='remember-me'>remember me?</label>
//           </div>
//           <span className='forgot'>forgot password?</span>
//         </div>
//         <button type='submit'>Login</button>
//       </form>
//     </div>
//   );
// };

// export default FormTemplate;

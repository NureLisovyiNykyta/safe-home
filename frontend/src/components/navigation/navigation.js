import './navigation.css';
import logo from './logo.png';
import { MdLogout, MdPayment } from "react-icons/md";
import { FiUsers } from "react-icons/fi";
import { GrUserAdmin } from "react-icons/gr";
import { IoArrowBackOutline } from "react-icons/io5";
import { FaRegUser } from "react-icons/fa";
import { IoIosArrowDown } from "react-icons/io";
import { useState, useEffect } from 'react';
import { Link, useLocation } from "react-router-dom";
import { useTranslation } from 'react-i18next';
import { useAuth } from '../../contexts/authContext';
import LanguageSwitcher from '../languageSwitcher';
import Modal from '../modal';
import api from '../../configs/api';
import { useForm } from "react-hook-form";
import { FiEye, FiEyeOff } from "react-icons/fi";

const Navigation = ({ changeLanguage }) => {
  const { t, i18n } = useTranslation();
  const { logout, userData, updatePassword } = useAuth();
  const [loading, setLoading] = useState(true);
  const [userEmail, setUserEmail] = useState(null);
  const location = useLocation();
  const userId = location.pathname.split('/')[3];
  const [isAccordionOpen, setIsAccordionOpen] = useState(false);
  const [notification, setNotification] = useState({ isOpen: false, message: "" });
  const [showOldPassword, setShowOldPassword] = useState(false); // Стан для видимості старого пароля
  const [showNewPassword, setShowNewPassword] = useState(false); // Стан для видимості нового пароля

  const { register, handleSubmit, formState: { errors }, reset } = useForm();

  useEffect(() => {
    if (i18n.isInitialized) {
      setLoading(false);
    } else {
      const handleInitialized = () => setLoading(false);
      i18n.on('initialized', handleInitialized);
      return () => i18n.off('initialized', handleInitialized);
    }
  }, [i18n]);

  useEffect(() => {
    if (!location.pathname.startsWith("/customers/user")) {
      setUserEmail(null);
    }
  }, [location.pathname]);

  useEffect(() => {
    const fetchUserEmail = async () => {
      try {
        const response = await api.get(`/admin/user/user?user=${userId}`);
        if (response.data && response.data.user.email) {
          setUserEmail(response.data.user.email);
        }
      } catch (error) {
        console.log(error);
      }
    };
    if (userId) {
      fetchUserEmail();
    }
  }, [userId]);

  const handleLogout = () => {
    logout();
  };

  const toggleAccordion = () => {
    setIsAccordionOpen(!isAccordionOpen);
  };

  const onSubmit = async (data) => {
    try {
      await updatePassword(data.oldPassword, data.newPassword);
      setNotification({ isOpen: true, message: t("notification.passwordUpdated") });
      setTimeout(() => {
        toggleAccordion();
        reset();
      }, 700);
    } catch (error) {
      setNotification({ isOpen: true, message: t("notification.passwordUpdateFailed") });
    }
  };

  const getActiveLink = (path) => {
    return location.pathname.startsWith(path) ? 'active' : '';
  };

  if (loading) {
    return null;
  }

  return (
    <div className='navigation'>
      <div className='logo'>
        <img src={logo} alt='company-logo' />
        <span>safe home</span>
      </div>
      <div className='links'>
        <div className={`link-container ${getActiveLink('/customers')}`}>
          <Link to="/customers" className="link">
            {!userEmail ? (
              <FiUsers className='icon' />
            ) : (
              <IoArrowBackOutline className='icon arrow' />
            )}
            {t('navigation.customers')}
          </Link>
          {userEmail && (
            <div className="user-email">
              <FaRegUser className='icon' />
              {userEmail}
            </div>
          )}
        </div>
        <div className={`link-container ${getActiveLink('/admins')}`}>
          <Link to="/admins" className="link">
            <GrUserAdmin className='icon' />
            {t('navigation.admins')}
          </Link>
        </div>
        <div className={`link-container ${getActiveLink('/subscriptions')}`}>
          <Link to="/subscriptions" className="link">
            <MdPayment className='icon' />
            {t('navigation.subscriptions')}
          </Link>
        </div>
      </div>
      <div className='user-panel'>
        <div className='user-header'>
          <p className='name'>{userData?.name || ''}</p>
          <p className='email'>{userData?.email || ''}</p>
          <IoIosArrowDown
            className={`icon ${isAccordionOpen ? 'open' : ''}`}
            onClick={toggleAccordion}
          />
          {isAccordionOpen && (
            <div className='accordion-content'>
              <form className='form' onSubmit={handleSubmit(onSubmit)}>
                <div className='form-group'>
                  <input
                    type={showOldPassword ? 'text' : 'password'}
                    {...register('oldPassword', {
                      required: t('login.passwordRequired'),
                      minLength: { value: 8, message: t('login.passwordMinLength', { length: 8 }) },
                    })}
                    placeholder={t('navigation.oldPassword')}
                  />
                  <button
                    type="button"
                    className="icon"
                    onClick={() => setShowOldPassword(!showOldPassword)}
                  >
                    {showOldPassword ? <FiEyeOff /> : <FiEye />}
                  </button>
                </div>
                {errors.oldPassword && <p className="error">{errors.oldPassword.message}</p>}
                <div className='form-group'>
                  <input
                    type={showNewPassword ? 'text' : 'password'}
                    {...register('newPassword', {
                      required: t('login.passwordRequired'),
                      minLength: { value: 8, message: t('login.passwordMinLength', { length: 8 }) },
                    })}
                    placeholder={t('navigation.newPassword')}
                  />
                  <button
                    type="button"
                    className="icon"
                    onClick={() => setShowNewPassword(!showNewPassword)}
                  >
                    {showNewPassword ? <FiEyeOff /> : <FiEye />}
                  </button>
                </div>
                {errors.newPassword && <p className="error">{errors.newPassword.message}</p>}
                <button type='submit'>{t('navigation.changePassword')}</button>
              </form>
              <LanguageSwitcher changeLanguage={changeLanguage} />
            </div>
          )}
        </div>
        <button className='logout' onClick={handleLogout}>
          <MdLogout className='icon' />
          <span>{t('navigation.logout')}</span>
        </button>
      </div>
      <Modal
        isOpen={notification.isOpen}
        onClose={() => setNotification({ isOpen: false, message: "" })}
        message={notification.message}
        showCloseButton={true}
      />
    </div>
  );
};

export default Navigation;
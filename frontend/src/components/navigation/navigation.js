import './navigation.css';
import logo from './logo.png';
import { MdLogout, MdPayment } from "react-icons/md";
import { FiUsers } from "react-icons/fi";
import { GrUserAdmin } from "react-icons/gr";
import { IoArrowBackOutline } from "react-icons/io5";
import { FaRegUser } from "react-icons/fa";
import { useState, useEffect } from 'react';
import { Link, useLocation } from "react-router-dom";
import { useTranslation } from 'react-i18next';
import { useAuth } from '../../contexts/authContext';
import LanguageSwitcher from '../languageSwitcher';
import api from '../../configs/api';

const Navigation = ({ changeLanguage }) => {
  const { t, i18n } = useTranslation();
  const { logout, userData } = useAuth();
  const [loading, setLoading] = useState(true);
  const [userEmail, setUserEmail] = useState(null);
  const location = useLocation();
  const userId = location.pathname.split('/')[3]

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

  if (loading) {
    return null;
  }

  const getActiveLink = (path) => {
    return location.pathname.startsWith(path) ? 'active' : '';
  };

  return (
    <div className='navigation'>
      <div className='logo'>
        <img src={logo} alt='company-logo' />
        <span>safe home</span>
      </div>
      <div className='links'>
        <div className={`link-container ${getActiveLink('/customers')}`}>
          <Link to="/customers" className="link">
            {!userEmail ?
              <FiUsers className='icon' /> :
              <IoArrowBackOutline className='icon arrow' />
            }
            {t('navigation.customers')}
          </Link>
          {userEmail &&
            <div className="user-email">
              <FaRegUser className='icon' />
              {userEmail}
            </div>}
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
        <LanguageSwitcher changeLanguage={changeLanguage} />
        <button className='user'>
          <p className='name'>{userData?.name || ''}</p>
          <p className='email'>{userData?.email || ''}</p>
        </button>
        <button className='logout' onClick={handleLogout}>
          <MdLogout className='icon' />
          <span>{t('navigation.logout')}</span>
        </button>
      </div>
    </div>
  );
};

export default Navigation;

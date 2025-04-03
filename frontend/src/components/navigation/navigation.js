import './navigation.css';
import logo from './logo.png';
import { MdLogout, MdPayment } from "react-icons/md";
import { FiUsers } from "react-icons/fi";
import { GrUserAdmin } from "react-icons/gr";
import { useState, useEffect } from 'react';
import { Link, useLocation } from "react-router-dom";
import { useTranslation } from 'react-i18next';
import { useAuth } from '../../contexts/authContext';
import LanguageSwitcher from '../languageSwitcher';
import { useUser } from '../../contexts/userContext';

const Navigation = ({ changeLanguage }) => {
  const { t, i18n } = useTranslation();
  const { logout, userData } = useAuth();
  const [loading, setLoading] = useState(true);
  const { userName, setUserName } = useUser();
  const location = useLocation();

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
    if (!location.pathname.startsWith("/subscriptions")) {
      setUserName(null);
    }
  }, [location, setUserName]);

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
        <Link
          to="/customers"
          className={`link ${getActiveLink('/customers')}`}
        >
          <FiUsers className='icon' />
          {t('navigation.customers')}
        </Link>
        <Link
          to="/admins"
          className={`link ${getActiveLink('/admins')}`}
        >
          <GrUserAdmin className='icon' />
          {t('navigation.admins')}
        </Link>
        <Link
          to="/subscriptions"
          className={`link ${getActiveLink('/subscriptions')}`}
        >
          <MdPayment className='icon' />
          {t('navigation.subscriptions')}
          {userName && <>
            <span className='separator'>/</span>
            <span className="user-name">{userName}</span>
          </>}
        </Link>
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

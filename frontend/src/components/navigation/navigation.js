import './navigation.css';
import logo from './logo.png';
import { MdLogout, MdPayment } from "react-icons/md";
import { FiUsers } from "react-icons/fi";
import { GrUserAdmin } from "react-icons/gr";
import { useState, useEffect } from 'react';
import { Link } from "react-router-dom";
import { useTranslation } from 'react-i18next';
import { useAuth } from '../../authContext';
import LanguageSwitcher from '../languageSwitcher';

const Navigation = ({ changeLanguage }) => {
  const { t, i18n } = useTranslation();
  const { logout } = useAuth();
  const [activeLink, setActiveLink] = useState('customers');
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (i18n.isInitialized) {
      setLoading(false);
    } else {
      const handleInitialized = () => setLoading(false);
      i18n.on('initialized', handleInitialized);
      return () => i18n.off('initialized', handleInitialized);
    }
  }, [i18n]);

  const handleLinkClick = (link) => {
    setActiveLink(link);
  };

  const handleLogout = () => {
    logout();
  }

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
        <Link
          to="/customers"
          className={`link ${activeLink === 'customers' ? 'active' : ''}`}
          onClick={() => handleLinkClick('customers')}
        >
          <FiUsers className='icon' />
          {t('navigation.customers')}
        </Link>
        <Link
          to="/admins"
          className={`link ${activeLink === 'admins' ? 'active' : ''}`}
          onClick={() => handleLinkClick('admins')}
        >
          <GrUserAdmin className='icon' />
          {t('navigation.admins')}
        </Link>
        <Link
          to="/subscriptions"
          className={`link ${activeLink === 'subscriptions' ? 'active' : ''}`}
          onClick={() => handleLinkClick('subscriptions')}
        >
          <MdPayment className='icon' />
          {t('navigation.subscriptions')}
        </Link>
      </div>
      <div className='user-panel'>
        <LanguageSwitcher changeLanguage={changeLanguage} />
        <button className='user'>
          <p className='name'>Oleg</p>
          <p className='email'>oleg.kivirenko@safe.home</p>
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

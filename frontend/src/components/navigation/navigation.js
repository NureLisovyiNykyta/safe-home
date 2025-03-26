import './navigation.css';
import logo from './logo.png';
import { MdLogout, MdPayment } from "react-icons/md";
import { FiUsers } from "react-icons/fi";
import { GrUserAdmin } from "react-icons/gr";
import { useState } from 'react';
import { Link } from "react-router-dom";
import { useTranslation } from 'react-i18next';

const Navigation = () => {
  const { t } = useTranslation();
  const [activeLink, setActiveLink] = useState('customers');

  const handleLinkClick = (link) => {
    setActiveLink(link);
  };

  return (
    <div className='navigation'>
      <div className='logo'>
        <img src={logo} alt='company-logo' />
        <span>safe home</span>
      </div>
      <div className='links'>
        <Link
          to="/"
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
        <button className='user'>
          <p className='name'>Oleg</p>
          <p className='email'>oleg.kivirenko@safe.home</p>
        </button>
        <button className='logout'>
          <MdLogout className='icon' />
          <span>{t('navigation.logout')}</span>
        </button>
      </div>
    </div>
  );
};

export default Navigation;
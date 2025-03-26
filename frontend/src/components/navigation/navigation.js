import './navigation.css';
import logo from './logo.png';
import { MdLogout } from "react-icons/md";
import { FiUsers } from "react-icons/fi";
import { GrUserAdmin } from "react-icons/gr";
import { MdPayment } from "react-icons/md";
import { useState } from 'react';

const Navigation = () => {
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
        <button
          className={`link ${activeLink === 'customers' ? 'active' : ''}`}
          onClick={() => handleLinkClick('customers')}
        >
          <FiUsers className='icon' />
          customers
        </button>
        <button
          className={`link ${activeLink === 'admins' ? 'active' : ''}`}
          onClick={() => handleLinkClick('admins')}
        >
          <GrUserAdmin className='icon' />
          admins
        </button>
        <button
          className={`link ${activeLink === 'subscriptions' ? 'active' : ''}`}
          onClick={() => handleLinkClick('subscriptions')}
        >
          <MdPayment className='icon' />
          subscriptions
        </button>
      </div>
      <div className='user-panel'>
        <button className='user'>
          <p className='name'>Oleg</p>
          <p className='email'>oleg.kivirenko@safe.home</p>
        </button>
        <button className='logout'>
          <MdLogout className='icon' />
          <span>logout</span>
        </button>
      </div>
    </div>
  );
};

export default Navigation;

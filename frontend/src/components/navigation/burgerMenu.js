import React from "react";
import { Link } from "react-router-dom";
import { MdLogout, MdPayment } from "react-icons/md";
import { FiUsers } from "react-icons/fi";
import { GrUserAdmin } from "react-icons/gr";
import './burgerMenu.css';

const BurgerMenu = ({ isOpen, toggleMenu, handleLogout, getActiveLink, t }) => {
  if (!isOpen) return null;

  return (
    <div className="burger-menu">
      <div className="menu-links">
        <Link to="/customers" className={`link ${getActiveLink('/customers')}`} onClick={toggleMenu}>
          <FiUsers className="icon" />
          {t("navigation.customers")}
        </Link>
        <Link to="/admins" className={`link ${getActiveLink('/admins')}`} onClick={toggleMenu}>
          <GrUserAdmin className="icon" />
          {t("navigation.admins")}
        </Link>
        <Link to="/subscriptions" className={`link ${getActiveLink('/subscriptions')}`} onClick={toggleMenu}>
          <MdPayment className="icon" />
          {t("navigation.subscriptions")}
        </Link>
      </div>
      <button className="logout" onClick={handleLogout}>
        <MdLogout className="icon" />
        <span>{t("navigation.logout")}</span>
      </button>
    </div>
  );
};

export default BurgerMenu;
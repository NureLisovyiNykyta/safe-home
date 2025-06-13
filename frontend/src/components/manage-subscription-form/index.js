import './index.css';
import logo from '../navigation/logo.png';
import { useAuth } from '../../contexts/auth-context';
import { BiCoinStack } from "react-icons/bi";
import { BiDollarCircle } from "react-icons/bi";

const ManageSubscriptionForm = () => {
  const { logout } = useAuth();

  const handleLogout = () => {
    logout();
  };

  return (
    <div className="sub-form">
      <div className="header">
        <div className='logo-container'>
          <img src={logo} alt="Logo" className="logo" />
          <h3>Safe home</h3>
        </div>
        <button className='logout-button' onClick={handleLogout}>
          Logout
        </button>
      </div>
      <div className='active-sub'>
        <h2>Your active subscription</h2>
        <div className='info-container'>
          <span className='icon'>
            <BiCoinStack />
            <BiDollarCircle className='dollar' />
          </span>
          <div className='info'>
            <p className='plan'>Vip</p>
            <p className='starts'>Started: 05.05.2005</p>
            <p className='ends'>Ends: 05.06.2005</p>
          </div>
          <button className='cancel'>
            Cancel
          </button>
        </div>
      </div>
      <div className='plans-list'>
        <h2>Plans</h2>
        <div className='container'>
          <div className='item'>
            <h3 className='name'>Basic</h3>
            <p className='price'>$10/month</p>
            <button className='subscribe'>Buy</button>
          </div>
          <div className='item'>
            <h3>VIP</h3>
            <p>$20/month</p>
            <button className='subscribe'>Buy</button>
          </div>
          <div className='item'>
            <h3>Premium</h3>
            <p>$30/month</p>
            <button className='subscribe'>Buy</button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default ManageSubscriptionForm;

import './index.css';
import logo from '../navigation/logo.png';
import { useAuth } from '../../contexts/auth-context';
import { BiCoinStack } from "react-icons/bi";
import { BiDollarCircle } from "react-icons/bi";
import { MdOutlineSensors } from "react-icons/md";
import { FiHome } from "react-icons/fi";

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
            <div className='info'>
              <h3 className='name'>Basic</h3>
              <div>
                <MdOutlineSensors className='icon' />
                <span>1 Sensor</span>
              </div>
              <div>
                <FiHome className='icon' />
                <span>1 Home</span>
              </div>
            </div>
            <h3 className='duration'>10 Days</h3>
            <button className='subscribe'>free</button>
          </div>
          <div className='item'>
            <div className='info'>
              <h3 className='name'>Basic</h3>
              <div>
                <MdOutlineSensors className='icon' />
                <span>1 Sensor</span>
              </div>
              <div>
                <FiHome className='icon' />
                <span>1 Home</span>
              </div>
            </div>
            <h3 className='duration'>10 Days</h3>
            <button className='subscribe'>10$ / Buy</button>
          </div>
          <div className='item'>
            <div className='info'>
              <h3 className='name'>VIP</h3>
              <div>
                <MdOutlineSensors className='icon' />
                <span>10 Sensors</span>
              </div>
              <div>
                <FiHome className='icon' />
                <span>1 Home</span>
              </div>
            </div>
            <h3 className='duration'>10 Days</h3>
            <button className='subscribe active'>20$ / Extend</button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default ManageSubscriptionForm;

import './navigation.css';
import logo from './logo.png';
import { MdLogout } from "react-icons/md";

const Navigation = () => {
  return (
    <div className='navigation'>
      <div className='logo'>
        <img src={logo} alt='company-logo' />
        <span>safe home</span>
      </div>
      <div className='user-panel'>
        <button className='logout'>
          <MdLogout className='icon' />
          <span>logout</span>
        </button>
      </div>
    </div>
  );
};

export default Navigation;
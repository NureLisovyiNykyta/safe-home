import './navigation.css';
import logo from './logo.png';

const Navigation = () => {
  return (
    <div className='navigation'>
      <div className='logo'>
        <img src={logo} alt='company-logo' />
        <span>safe home</span>
      </div>
    </div>
  );
};

export default Navigation;
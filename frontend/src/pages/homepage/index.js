import { Link } from 'react-router-dom';
import './index.css';
import homelogo from './home-logo.jpg';
import appimage from './app-image.jpg';

const Homepage = () => {
  return (
    <div className="homepage">
      <header className='header'>
        <h3 className="title">Safe Home</h3>
        <Link to="/login" className="login-link">
          Authorize
        </Link>
      </header>
      <main className="content">
        <div className='main-content'>
          <div className='intro'>
            <div className='left-column'>
              <h1>Safe Home: Comprehensive Home Security Management System</h1>
              <p>Safe Home integrates door opening sensors with a powerful backend, a user-friendly web interface, and a mobile application. Control your home's security in real-time and enjoy peace of mind and protection. Perfectly suited for any residence, from apartments to large mansions.</p>
              <button className="download-mobile-app">
                Download mobile app
              </button>
            </div>
            <div className='right-column'>
              <img src={homelogo} alt="Safe Home Logo" className="home-logo" />
            </div>
          </div>
          <div className='features'>
            <div className='left-column'>
              <h2>Why Safe Home?</h2>
              <div className='feature'>
                <h3>Constant Monitoring</h3>
                <p>Protecting your home 24/7 with instant notifications and remote control.</p>
              </div>
              <div className='feature'>
                <h3>Convenient Control</h3>
                <p>Intuitive web interface and iOS/Android mobile application.</p>
              </div>
              <div className='feature'>
                <h3>Quick Installation</h3>
                <p>Simple setup and support for comfortable, hassle-free use.</p>
              </div>
              <div className='feature'>
                <h3>Technical Support</h3>
                <p>Free expert assistance to resolve any questions and issues.</p>
              </div>
            </div>
            <div className='right-column'>
              <img src={appimage} alt="Safe Home mobile app" className="mobile-app-image" />
            </div>
          </div>
        </div>
        <footer className="footer">
          <p>&copy; {new Date().getFullYear()} Safe Home. All rights reserved.</p>
        </footer>
      </main>
    </div>
  );
}

export default Homepage;

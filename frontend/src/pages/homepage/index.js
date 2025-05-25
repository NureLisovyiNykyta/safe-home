import { Link } from 'react-router-dom';
import './index.css';
import homelogo from './home-logo.jpg';
import appimage from './app-image.jpg';
import aboutproject from './about-project.jpg';
import { GoShieldCheck } from "react-icons/go";
import { TbViewportWide } from "react-icons/tb";
import { IoPersonOutline } from "react-icons/io5";
import { GoLock } from "react-icons/go";
import { MdOutlineSavings } from "react-icons/md";
import { IoMdSquare } from "react-icons/io";

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
          <div className='advantages'>
            <h2>Advantages of Safe Home</h2>
            <div className='list'>
              <div className='advantage'>
                <div className='icon'><GoShieldCheck /></div>
                <h3>Maximum Reliability</h3>
                <p>Advanced technologies to protect your home.</p>
              </div>
              <div className='advantage'>
                <div className='icon'><TbViewportWide /></div>
                <h3>Maximum Reliability</h3>
                <p>Advanced technologies to protect your home.</p>
              </div>
              <div className='advantage'>
                <div className='icon'><IoPersonOutline /></div>
                <h3>Flexible Scalability</h3>
                <p>Suitable for any size and type of dwelling.</p>
              </div>
              <div className='advantage'>
                <div className='icon'><GoLock /></div>
                <h3>Ease of Use</h3>
                <p>User-friendly interface accessible to all users.</p>
              </div>
              <div className='advantage'>
                <div className='icon'><MdOutlineSavings /></div>
                <h3>Cost Savings</h3>
                <p>Reduce expenses on insurance and external security systems.</p>
              </div>
            </div>
          </div>
          <div className='about-project'>
            <div className='columns'>
              <div className='left-column'>
                <img src={aboutproject} alt="About project" className="about-project-image" />
              </div>
              <div className='right-column'>
                <h2>About Our Project</h2>
                <div className='list'>
                  <div className='item'>
                    <div className='square'><IoMdSquare /></div>
                    <div className='column'>
                      <h3>Our Mission</h3>
                      <p>To empower users with innovative, reliable, and user-friendly home security solutions.</p>
                    </div>
                  </div>
                  <div className='item'>
                    <div className='square'><IoMdSquare /></div>
                    <div className='column'>
                      <h3>Our Vision</h3>
                      <p>To become the leading provider of smart home security systems globally, ensuring peace of mind for every household.</p>
                    </div>
                  </div>
                  <div className='item'>
                    <div className='square'><IoMdSquare /></div>
                    <div className='column'>
                      <h3>Our Journey</h3>
                      <p>Discover how we're transforming home security, from initial concept to widespread adoption and continuous improvement.</p>
                    </div>
                  </div>
                </div>
              </div>
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

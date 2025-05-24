import './index.css';
import Navigation from '../navigation';
import NotFound from '../../pages/not-found';
import Customers from '../../pages/customers';
import Admins from '../../pages/admins';
import Subscriptions from '../../pages/subscriptions';
import UserSubscriptions from '../../pages/user-subscriptions';
import AuditLog from '../../pages/audit-log';
import { Routes, Route } from "react-router-dom";
import { useEffect, useContext } from 'react';
import { useCookies } from 'react-cookie';
import i18n from '../../configs/locale';
import { AuthContext } from '../../contexts/auth-context';
import { LoginForm } from '../forms/login';
import Statistics from '../../pages/statistics';

const App = () => {
  const [cookies, setCookie] = useCookies(['language']);
  const { isAuthenticated } = useContext(AuthContext);

  useEffect(() => {
    const currentLanguage = cookies.language || 'en';
    i18n.changeLanguage(currentLanguage);
  }, [cookies.language]);

  const changeLanguage = (language) => {
    i18n.changeLanguage(language);
    setCookie('language', language, { path: '/', maxAge: 24 * 60 * 60 });
  };

  return (
    <div className="app">
      {isAuthenticated && <Navigation changeLanguage={changeLanguage} />}
      <Routes>
        <Route path='/' element={<LoginForm changeLanguage={changeLanguage} />} />
        <Route path='/customers' element={<Customers />} />        
        <Route path="/customers/user/:userId" element={<UserSubscriptions />} />
        <Route path='/admins' element={<Admins />} />
        <Route path='/subscriptions' element={<Subscriptions />} />
        <Route path='/audit-log' element={<AuditLog />} />
        <Route path='/statistics/*' element={<Statistics />} />
        <Route path='*' element={<NotFound />} />
      </Routes>
    </div>
  );
};

export default App;

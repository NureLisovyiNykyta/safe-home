import './App.css';
import Navigation from './components/navigation/navigation';
import NotFound from './pages/notFound/notFound';
import Customers from './pages/customers';
import Admins from './pages/admins';
import Subscriptions from './pages/subscriptions';
import { BrowserRouter as Router, Routes, Route } from "react-router-dom";
import { useEffect } from 'react';
import { useCookies } from 'react-cookie';
import i18n from './i18n';

function App() {
  const [cookies, setCookie] = useCookies(['language']);

  useEffect(() => {
    const currentLanguage = cookies.language || 'en';
    i18n.changeLanguage(currentLanguage);
  }, [cookies.language]);

  const changeLanguage = (language) => {
    i18n.changeLanguage(language);
    setCookie('language', language, { path: '/', maxAge: 24 * 60 * 60 });
  };

  return (
    <Router>
      <div className="app">
        <Navigation changeLanguage={changeLanguage} />
        <Routes>
          <Route path='/' element={<Customers />} />
          <Route path='/admins' element={<Admins />} />
          <Route path='/subscriptions' element={<Subscriptions />} />
          <Route path='*' element={<NotFound />} />
        </Routes>
      </div>
    </Router>
  );
}

export default App;

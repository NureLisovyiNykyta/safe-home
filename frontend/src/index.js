import React from 'react';
import ReactDOM from 'react-dom/client';
import './index.css';
import App from './App';
import './i18n';
import { CookiesProvider } from 'react-cookie';
import { AuthProvider } from './authContext';

const root = ReactDOM.createRoot(document.getElementById('root'));
root.render(
  <React.StrictMode>
    <CookiesProvider>
      <AuthProvider>
        <App />
      </AuthProvider>
    </CookiesProvider>
  </React.StrictMode>
);

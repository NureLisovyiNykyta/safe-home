import { createContext, useState, useEffect } from 'react';
import { useCookies } from 'react-cookie';
import api from './apiConfig';

export const AuthContext = createContext();

export const AuthProvider = ({ children }) => {
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const [loading, setLoading] = useState(true);
  const [cookies] = useCookies(['authToken']);

  useEffect(() => {
    const checkAuth = async () => {
      try {
        if (cookies.authToken) {
          const response = await api.get('/profile');
          if (response.status === 200) {
            setIsAuthenticated(true);
          } else {
            setIsAuthenticated(false);
          }
        } else {
          setIsAuthenticated(false);
        }
      } catch (error) {
        setIsAuthenticated(false);
      } finally {
        setLoading(false);
      }
    };

    checkAuth();
  }, [cookies.authToken]);

  return (
    <AuthContext.Provider value={{ isAuthenticated, setIsAuthenticated }}>
      {!loading && children}
    </AuthContext.Provider>
  );
};
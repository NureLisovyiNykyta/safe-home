import { createContext, useState, useEffect, useContext, useCallback } from 'react';
import { useNavigate, useLocation } from 'react-router-dom';
import api from '../configs/api';

export const AuthContext = createContext();

export const useAuth = () => useContext(AuthContext);

export const AuthProvider = ({ children }) => {
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const [userData, setUserData] = useState(null);
  const [loading, setLoading] = useState(true);
  const navigate = useNavigate();
  const location = useLocation();

  const logout = useCallback(async () => {
    try {
      await api.post('/logout');
    } catch (error) {
      console.error("Logout failed:", error.message);
    } finally {
      setIsAuthenticated(false);
      setUserData(null);
      navigate('/');
    }
  }, [navigate]);

  const login = useCallback((user) => {
    if (!user || user.role !== 'admin') {
      logout();
      return;
    }
    setIsAuthenticated(true);
    setUserData(user);
  }, [logout]);

  useEffect(() => {
    const checkAuthStatus = async () => {
      try {
        const response = await api.get('/user');
        if (response.status === 401) {
          setIsAuthenticated(false);
          setUserData(null);
          if (location.pathname !== '/') {
            navigate('/');
          }
          return;
        }
        if (response.status === 200) {
          login(response.data.user);
          if (location.pathname === '/') {
            navigate('/customers');
          }
        }
      } catch (error) {
        console.error("Authentication check failed:", error.message);
        setIsAuthenticated(false);
        setUserData(null);
      } finally {
        setLoading(false);
      }
    };

    checkAuthStatus();
  }, [login, navigate, location.pathname]);

  return (
    <AuthContext.Provider value={{ isAuthenticated, userData, login, logout }}>
      {!loading && children}
    </AuthContext.Provider>
  );
};
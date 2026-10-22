import { createContext, useState, useContext, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';

const AuthContext = createContext();

export const AuthProvider = ({ children }) => {
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    // Check local storage on initial load
    const storedUser = localStorage.getItem('agri_user');
    if (storedUser) {
      setUser(JSON.parse(storedUser));
    }
    setLoading(false);
  }, []);

  const loginUser = (userData) => {
    // Extract user details and token so they are easily accessible
    const loggedInUser = {
      id: userData.user.id,
      name: userData.user.name,
      role: userData.user.role,
      token: userData.token
    };
    
    localStorage.setItem('agri_user', JSON.stringify(loggedInUser));
    setUser(loggedInUser);
  };

  const logoutUser = () => {
    localStorage.removeItem('agri_user');
    setUser(null);
  };

  return (
    <AuthContext.Provider value={{ user, loginUser, logoutUser, loading }}>
      {children}
    </AuthContext.Provider>
  );
};

export const useAuth = () => useContext(AuthContext);

import { Navigate } from 'react-router-dom';
import { useAuth } from '../../context/AuthContext';
import Spinner from './Spinner'; // Assuming we create this simple spinner later

const PrivateRoute = ({ children, role }) => {
  const { user, loading } = useAuth();

  if (loading) return <div className="min-h-screen flex items-center justify-center"><Spinner /></div>;

  if (!user) return <Navigate to="/login" replace />;
  
  if (user.role !== role) {
    // Redirect to their correct dashboard if they try to access the wrong one
    if (user.role === 'Farmer') return <Navigate to="/farmer" replace />;
    if (user.role === 'CollectionCenter') return <Navigate to="/collection" replace />;
    if (user.role === 'Retail') return <Navigate to="/retail" replace />;
    return <Navigate to="/" replace />;
  }

  return children;
};

export default PrivateRoute;

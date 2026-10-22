import { Routes, Route } from 'react-router-dom';
import Landing from '../pages/Landing';
import Register from '../pages/Register';
import Login from '../pages/Login';
import NotFound from '../pages/NotFound';
import Customer from '../pages/Customer';
import FarmerDashboard from '../pages/dashboards/FarmerDashboard';
import CollectionDashboard from '../pages/dashboards/CollectionDashboard';
import RetailDashboard from '../pages/dashboards/RetailDashboard';
import PrivateRoute from '../components/common/PrivateRoute'; // We will create this in Auth Context

const AppRoutes = () => {
  return (
    <Routes>
      {/* Public Routes */}
      <Route path="/" element={<Landing />} />
      <Route path="/register" element={<Register />} />
      <Route path="/login" element={<Login />} />
      <Route path="/customer" element={<Customer />} />
      
      {/* Protected Routes (Only logged in users with specific roles) */}
      <Route path="/farmer" element={<PrivateRoute role="Farmer"><FarmerDashboard /></PrivateRoute>} />
      <Route path="/collection" element={<PrivateRoute role="CollectionCenter"><CollectionDashboard /></PrivateRoute>} />
      <Route path="/retail" element={<PrivateRoute role="Retail"><RetailDashboard /></PrivateRoute>} />

      {/* 404 Route */}
      <Route path="*" element={<NotFound />} />
    </Routes>
  );
};

export default AppRoutes;

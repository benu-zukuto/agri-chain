import { Link, useLocation, useNavigate } from 'react-router-dom';
import { motion } from 'framer-motion';
import { FiHome, FiLogOut, FiUser, FiBox, FiShoppingBag, FiTruck } from 'react-icons/fi';
import { useAuth } from '../../context/AuthContext';

const Sidebar = ({ role }) => {
  const location = useLocation();
  const navigate = useNavigate();
  const { logoutUser, user } = useAuth();

  const menuItems = {
    Farmer: [{ name: 'Dashboard', path: '/farmer', icon: <FiHome /> }],
    CollectionCenter: [{ name: 'Dashboard', path: '/collection', icon: <FiHome /> }],
    Retail: [{ name: 'Dashboard', path: '/retail', icon: <FiHome /> }]
  };

  const handleLogout = () => {
    logoutUser();
    navigate('/login');
  };

  return (
    <div className="w-64 h-screen sticky top-0 glass-card rounded-none border-r border-white/20 dark:border-white/10 flex flex-col">
      <div className="p-6">
        <Link to="/" className="text-2xl font-bold bg-gradient-to-r from-blue-600 to-purple-600 bg-clip-text text-transparent">
          AgriChain
        </Link>
      </div>
      
      <div className="flex-1 px-4 py-2">
        <nav className="space-y-2">
          {menuItems[role]?.map((item) => (
            <Link
              key={item.path}
              to={item.path}
              className={`flex items-center px-4 py-3 rounded-xl text-sm font-medium transition-all ${
                location.pathname === item.path
                  ? 'bg-blue-600 text-white shadow-lg shadow-blue-500/30'
                  : 'text-gray-700 dark:text-gray-300 hover:bg-gray-100 dark:hover:bg-gray-800'
              }`}
            >
              <span className="mr-3 text-lg">{item.icon}</span>
              {item.name}
            </Link>
          ))}
        </nav>
      </div>

      <div className="p-4 border-t border-white/20 dark:border-white/10">
        <div className="flex items-center mb-4 px-2">
          <div className="w-10 h-10 rounded-full bg-gradient-to-r from-blue-500 to-purple-500 flex items-center justify-center text-white">
            <FiUser />
          </div>
          <div className="ml-3">
            <p className="text-sm font-medium text-gray-800 dark:text-white">{user?.name || 'User'}</p>
            <p className="text-xs text-gray-500 dark:text-gray-400">{role}</p>
          </div>
        </div>
        <button
          onClick={handleLogout}
          className="w-full flex items-center justify-center px-4 py-2 text-sm font-medium text-red-600 dark:text-red-400 hover:bg-red-50 dark:hover:bg-red-900/20 rounded-xl transition"
        >
          <FiLogOut className="mr-2" /> Logout
        </button>
      </div>
    </div>
  );
};

export default Sidebar;

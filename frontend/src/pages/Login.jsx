import { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { motion } from 'framer-motion';
import { FiMail, FiLock, FiArrowRight } from 'react-icons/fi';
import axiosInstance from '../api/axiosInstance';
import { useAuth } from '../context/AuthContext';
import toast from 'react-hot-toast';
import Button from '../components/common/Button';

const Login = () => {
  const [formData, setFormData] = useState({ email: '', password: '' });
  const { loginUser } = useAuth();
  const navigate = useNavigate();

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      const res = await axiosInstance.post('/auth/login', formData);
      loginUser(res.data.data);
      toast.success('Login successful!');
      
      // Redirect based on role
      const role = res.data.data.user.role;
      if (role === 'Farmer') navigate('/farmer');
      else if (role === 'CollectionCenter') navigate('/collection');
      else if (role === 'Retail') navigate('/retail');
      else navigate('/'); // fallback
    } catch (error) {
      // Error handled globally
    }
  };

  return (
    <div className="min-h-screen gradient-bg flex items-center justify-center p-4">
      <motion.div 
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        className="w-full max-w-md glass-card p-8 rounded-3xl shadow-2xl"
      >
        <Link to="/" className="block text-center mb-8">
          <span className="text-3xl font-bold bg-gradient-to-r from-blue-600 to-purple-600 bg-clip-text text-transparent">
            AgriChain
          </span>
        </Link>

        <h2 className="text-2xl font-bold text-gray-800 dark:text-white mb-2">Welcome Back</h2>
        <p className="text-gray-600 dark:text-gray-400 mb-6">Login to access your dashboard.</p>

        <form onSubmit={handleSubmit} className="space-y-4">
          <div className="relative">
            <div className="absolute inset-y-0 left-0 flex items-center pl-3 pointer-events-none text-gray-400">
              <FiMail />
            </div>
            <input
              type="email"
              name="email"
              placeholder="Email Address"
              value={formData.email}
              onChange={handleChange}
              className="w-full pl-10 pr-4 py-3 rounded-xl bg-white/50 dark:bg-slate-800/50 border border-white/20 dark:border-white/10 text-gray-800 dark:text-white placeholder-gray-500 focus:outline-none focus:ring-2 focus:ring-blue-500 transition"
              required
            />
          </div>

          <div className="relative">
            <div className="absolute inset-y-0 left-0 flex items-center pl-3 pointer-events-none text-gray-400">
              <FiLock />
            </div>
            <input
              type="password"
              name="password"
              placeholder="Password"
              value={formData.password}
              onChange={handleChange}
              className="w-full pl-10 pr-4 py-3 rounded-xl bg-white/50 dark:bg-slate-800/50 border border-white/20 dark:border-white/10 text-gray-800 dark:text-white placeholder-gray-500 focus:outline-none focus:ring-2 focus:ring-blue-500 transition"
              required
            />
          </div>

          <Button type="submit" variant="gradient" className="w-full">
            Login <FiArrowRight className="inline ml-2" />
          </Button>
        </form>

        <p className="text-center text-sm text-gray-600 dark:text-gray-400 mt-6">
          Don't have an account? <Link to="/register" className="text-blue-600 hover:underline font-medium">Register here</Link>
        </p>
        
        <div className="mt-6 pt-6 border-t border-white/20 dark:border-white/10 text-center">
          <Link to="/customer" className="text-sm text-gray-500 hover:text-blue-600 transition">
            Are you a customer? View Products & Scan QR
          </Link>
        </div>
      </motion.div>
    </div>
  );
};

export default Login;

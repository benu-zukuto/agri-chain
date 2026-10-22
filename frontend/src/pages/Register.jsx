import { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { motion, AnimatePresence } from 'framer-motion';
import { FiUser, FiMail, FiLock, FiMapPin, FiArrowRight } from 'react-icons/fi';
import axiosInstance from '../api/axiosInstance';
import { useAuth } from '../context/AuthContext';
import toast from 'react-hot-toast';
import Button from '../components/common/Button';

const Register = () => {
  const [role, setRole] = useState('Farmer');
  const [formData, setFormData] = useState({
    email: '',
    username: '',
    password: '',
    confirmPassword: '',
    // Role specific fields
    farmerName: '',
    farmLocation: '',
    centerName: '',
    centerLocation: '',
    shopName: '',
    shopLocation: ''
  });

  const { loginUser } = useAuth();
  const navigate = useNavigate();

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    if (formData.password !== formData.confirmPassword) {
      return toast.error('Passwords do not match');
    }

    // Prepare payload based on role
    let payload = {
      email: formData.email,
      password: formData.password,
      role: role,
      phone: 'N/A', // Backend requires phone, sending placeholder
      name: formData.username // Default to username
    };

    if (role === 'Farmer') {
      payload.name = formData.farmerName || formData.username;
    } else if (role === 'CollectionCenter') {
      payload.name = formData.centerName || formData.username;
    } else if (role === 'Retail') {
      payload.name = formData.shopName || formData.username;
    }

    try {
      const res = await axiosInstance.post('/auth/register', payload);
      loginUser(res.data.data);
      toast.success('Registration successful!');
      
      // Redirect based on role
      if (role === 'Farmer') navigate('/farmer');
      else if (role === 'CollectionCenter') navigate('/collection');
      else if (role === 'Retail') navigate('/retail');
    } catch (error) {
      // Error is already handled globally by axios interceptor
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

        <h2 className="text-2xl font-bold text-gray-800 dark:text-white mb-2">Create Account</h2>
        <p className="text-gray-600 dark:text-gray-400 mb-6">Join the decentralized agricultural network.</p>

        {/* Role Selector */}
        <div className="grid grid-cols-3 gap-2 mb-6 p-1 glass-card rounded-xl">
          {['Farmer', 'CollectionCenter', 'Retail'].map((r) => (
            <button
              key={r}
              onClick={() => setRole(r)}
              className={`py-2 px-4 rounded-lg text-sm font-medium transition-all ${
                role === r ? 'bg-blue-600 text-white shadow-md' : 'text-gray-600 dark:text-gray-300 hover:bg-gray-100 dark:hover:bg-gray-800'
              }`}
            >
              {r === 'CollectionCenter' ? 'Collection' : r}
            </button>
          ))}
        </div>

        <form onSubmit={handleSubmit} className="space-y-4">
          {/* Common Fields */}
          <InputField icon={<FiMail />} type="email" name="email" placeholder="Email Address" value={formData.email} onChange={handleChange} required />
          <InputField icon={<FiUser />} type="text" name="username" placeholder="Username" value={formData.username} onChange={handleChange} required />
          <InputField icon={<FiLock />} type="password" name="password" placeholder="Password" value={formData.password} onChange={handleChange} required />
          <InputField icon={<FiLock />} type="password" name="confirmPassword" placeholder="Confirm Password" value={formData.confirmPassword} onChange={handleChange} required />

          {/* Dynamic Role Fields */}
          <AnimatePresence mode="wait">
            <motion.div
              key={role}
              initial={{ opacity: 0, height: 0 }}
              animate={{ opacity: 1, height: 'auto' }}
              exit={{ opacity: 0, height: 0 }}
              className="space-y-4 overflow-hidden"
            >
              {role === 'Farmer' && (
                <>
                  <InputField icon={<FiUser />} type="text" name="farmerName" placeholder="Farmer Name" value={formData.farmerName} onChange={handleChange} required />
                  <InputField icon={<FiMapPin />} type="text" name="farmLocation" placeholder="Farm Location" value={formData.farmLocation} onChange={handleChange} required />
                </>
              )}
              {role === 'CollectionCenter' && (
                <>
                  <InputField icon={<FiUser />} type="text" name="centerName" placeholder="Collection Center Name" value={formData.centerName} onChange={handleChange} required />
                  <InputField icon={<FiMapPin />} type="text" name="centerLocation" placeholder="Collection Center Location" value={formData.centerLocation} onChange={handleChange} required />
                </>
              )}
              {role === 'Retail' && (
                <>
                  <InputField icon={<FiUser />} type="text" name="shopName" placeholder="Retail Shop Name" value={formData.shopName} onChange={handleChange} required />
                  <InputField icon={<FiMapPin />} type="text" name="shopLocation" placeholder="Retail Shop Location" value={formData.shopLocation} onChange={handleChange} required />
                </>
              )}
            </motion.div>
          </AnimatePresence>

          <Button type="submit" variant="gradient" className="w-full">
            Register <FiArrowRight className="inline ml-2" />
          </Button>
        </form>

        <p className="text-center text-sm text-gray-600 dark:text-gray-400 mt-6">
          Already have an account? <Link to="/login" className="text-blue-600 hover:underline font-medium">Login here</Link>
        </p>
      </motion.div>
    </div>
  );
};

// Reusable Input Field Component for this page
const InputField = ({ icon, ...props }) => (
  <div className="relative">
    <div className="absolute inset-y-0 left-0 flex items-center pl-3 pointer-events-none text-gray-400">
      {icon}
    </div>
    <input
      {...props}
      className="w-full pl-10 pr-4 py-3 rounded-xl bg-white/50 dark:bg-slate-800/50 border border-white/20 dark:border-white/10 text-gray-800 dark:text-white placeholder-gray-500 focus:outline-none focus:ring-2 focus:ring-blue-500 transition"
      required
    />
  </div>
);

export default Register;

import { Link } from 'react-router-dom';
import { motion } from 'framer-motion';
import { FiHome, FiAlertTriangle } from 'react-icons/fi';
import Button from '../components/common/Button';

const NotFound = () => {
  return (
    <div className="min-h-screen gradient-bg flex items-center justify-center p-4 text-center">
      <motion.div 
        initial={{ opacity: 0, scale: 0.9 }}
        animate={{ opacity: 1, scale: 1 }}
        className="glass-card p-12 rounded-3xl max-w-lg w-full"
      >
        <div className="w-20 h-20 mx-auto rounded-full bg-red-100 dark:bg-red-900/30 flex items-center justify-center text-red-600 dark:text-red-400 text-4xl mb-6">
          <FiAlertTriangle />
        </div>
        <h1 className="text-6xl font-bold text-gray-800 dark:text-white mb-2">404</h1>
        <h2 className="text-2xl font-semibold text-gray-700 dark:text-gray-200 mb-4">Page Not Found</h2>
        <p className="text-gray-500 dark:text-gray-400 mb-8">
          Oops! The page you are looking for does not exist or has been moved.
        </p>
        <Link to="/">
          <Button variant="gradient" className="w-full">
            <FiHome className="inline mr-2" /> Back to Home
          </Button>
        </Link>
      </motion.div>
    </div>
  );
};

export default NotFound;

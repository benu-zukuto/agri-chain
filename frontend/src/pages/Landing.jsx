import { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { motion } from 'framer-motion';
import { FiArrowRight, FiTruck, FiShoppingBag, FiCheckCircle, FiUser, FiDatabase, FiShield, FiSearch } from 'react-icons/fi';
import Navbar from '../components/layout/Navbar';
import Button from '../components/common/Button';

const Landing = () => {
  const [searchTerm, setSearchTerm] = useState('');
  const navigate = useNavigate();

  const features = [
    { icon: <FiShield />, title: 'Blockchain Secured', desc: 'Tamper-proof records ensure absolute trust and transparency from farm to table.' },
    { icon: <FiTruck />, title: 'Supply Chain Tracking', desc: 'Real-time tracking of harvest, collection, and retail distribution stages.' },
    { icon: <FiSearch />, title: 'QR Code Scanning', desc: 'Customers can instantly view the complete journey of their produce via QR.' },
    { icon: <FiDatabase />, title: 'Decentralized Data', desc: 'Empowering farmers and retailers by removing middlemen and ensuring fair trade.' },
  ];

  const workflow = [
    { step: '01', title: 'Farmer', desc: 'Registers harvest & generates Product ID', icon: <FiUser /> },
    { step: '02', title: 'Collection Center', desc: 'Grades quality & updates storage data', icon: <FiDatabase /> },
    { step: '03', title: 'Retail', desc: 'Receives stock, sets price & generates QR', icon: <FiShoppingBag /> },
    { step: '04', title: 'Customer', desc: 'Scans QR to verify complete history', icon: <FiCheckCircle /> },
  ];

  const techStack = ['React', 'Node.js', 'Express', 'MongoDB', 'Tailwind CSS', 'Blockchain'];

  const handleSearch = (e) => {
    e.preventDefault();
    navigate(`/customer?search=${searchTerm}`);
  };

  return (
    <div className="gradient-bg min-h-screen text-gray-800 dark:text-white">
      <Navbar />

      {/* Hero Section */}
      <section className="relative overflow-hidden pt-20 pb-32 px-4">
        <div className="absolute top-20 left-10 w-72 h-72 bg-purple-300 rounded-full mix-blend-multiply filter blur-3xl opacity-30 animate-float"></div>
        <div className="absolute top-40 right-10 w-72 h-72 bg-blue-300 rounded-full mix-blend-multiply filter blur-3xl opacity-30 animate-float"></div>
        
        <div className="max-w-7xl mx-auto text-center relative z-10">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8 }}
          >
            <span className="px-4 py-1 rounded-full text-sm font-medium bg-blue-100 text-blue-800 dark:bg-blue-900/30 dark:text-blue-300 mb-6 inline-block">
              Powered by Blockchain Technology
            </span>
            <h1 className="text-5xl md:text-7xl font-bold tracking-tight mb-6 bg-gradient-to-r from-gray-900 to-gray-600 dark:from-white dark:to-gray-300 bg-clip-text text-transparent">
              Supply Chain Transparency<br />for Agricultural Produce
            </h1>
            <p className="text-lg md:text-xl text-gray-600 dark:text-gray-400 max-w-3xl mx-auto mb-10">
              Connect farmers, collection centers, and retailers on a single decentralized platform. Empower customers with the truth behind their food.
            </p>
            
            {/* NEW: Home Page Search Bar */}
            <form onSubmit={handleSearch} className="max-w-xl mx-auto relative mb-10">
              <FiSearch className="absolute left-4 top-4 text-gray-400 text-xl" />
              <input 
                type="text" 
                placeholder="Search for a product (e.g., Tomato)..." 
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="w-full pl-12 pr-32 py-4 rounded-2xl glass-card focus:outline-none focus:ring-2 focus:ring-blue-500 text-lg text-gray-800 dark:text-white"
              />
              <button type="submit" className="absolute right-2 top-2 bottom-2 px-6 bg-blue-600 text-white rounded-xl font-medium hover:bg-blue-700 transition flex items-center">
                Search
              </button>
            </form>

            <div className="flex flex-col sm:flex-row gap-4 justify-center">
              <Link to="/register">
                <Button variant="gradient" className="w-full sm:w-auto">Get Started <FiArrowRight className="inline ml-2" /></Button>
              </Link>
              <Link to="/login">
                <Button variant="secondary" className="w-full sm:w-auto">Login</Button>
              </Link>
            </div>
          </motion.div>
        </div>
      </section>

      {/* Features Section */}
      <section className="py-20 px-4 bg-white/40 dark:bg-slate-900/40 backdrop-blur-lg">
        <div className="max-w-7xl mx-auto">
          <motion.h2 
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            className="text-4xl font-bold text-center mb-16"
          >
            Why Choose AgriChain?
          </motion.h2>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
            {features.map((feature, index) => (
              <motion.div
                key={index}
                initial={{ opacity: 0, y: 30 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ delay: index * 0.1 }}
                className="glass-card p-6 rounded-2xl hover:shadow-xl transition-all"
              >
                <div className="w-12 h-12 rounded-xl bg-gradient-to-r from-blue-500 to-purple-500 flex items-center justify-center text-white text-xl mb-4">
                  {feature.icon}
                </div>
                <h3 className="text-xl font-semibold mb-2">{feature.title}</h3>
                <p className="text-gray-600 dark:text-gray-400">{feature.desc}</p>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* Workflow Illustration */}
      <section className="py-20 px-4">
        <div className="max-w-7xl mx-auto">
          <h2 className="text-4xl font-bold text-center mb-16">How It Works</h2>
          <div className="grid grid-cols-1 md:grid-cols-4 gap-8 relative">
            <div className="hidden md:block absolute top-12 left-0 right-0 h-0.5 bg-gradient-to-r from-blue-200 via-purple-200 to-pink-200 dark:from-blue-900 dark:via-purple-900 dark:to-pink-900"></div>
            
            {workflow.map((item, index) => (
              <motion.div 
                key={index}
                initial={{ opacity: 0, scale: 0.8 }}
                whileInView={{ opacity: 1, scale: 1 }}
                viewport={{ once: true }}
                transition={{ delay: index * 0.15 }}
                className="relative text-center z-10"
              >
                <div className="w-24 h-24 mx-auto rounded-full glass-card flex items-center justify-center text-3xl text-blue-600 dark:text-blue-400 mb-4">
                  {item.icon}
                </div>
                <span className="text-sm font-bold text-blue-600 dark:text-blue-400">STEP {item.step}</span>
                <h3 className="text-xl font-semibold mt-1">{item.title}</h3>
                <p className="text-gray-600 dark:text-gray-400 mt-2 text-sm">{item.desc}</p>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* Technology & Footer */}
      <section className="py-16 px-4 bg-white/40 dark:bg-slate-900/40 backdrop-blur-lg">
        <div className="max-w-4xl mx-auto text-center">
          <h2 className="text-3xl font-bold mb-8">Built with Modern Tech</h2>
          <div className="flex flex-wrap justify-center gap-4">
            {techStack.map((tech, index) => (
              <span key={index} className="px-4 py-2 glass-card rounded-full text-sm font-medium text-gray-700 dark:text-gray-300">
                {tech}
              </span>
            ))}
          </div>
        </div>
      </section>

      <footer className="py-8 px-4 text-center text-gray-500 dark:text-gray-400 text-sm">
        © {new Date().getFullYear()} AgriChain. Hackathon Project. All rights reserved.
      </footer>
    </div>
  );
};

export default Landing;

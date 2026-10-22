import { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { FiPlusCircle, FiBox, FiCheckCircle, FiClock, FiSearch } from 'react-icons/fi';
import DashboardLayout from '../../components/layout/DashboardLayout';
import Card from '../../components/common/Card';
import Button from '../../components/common/Button';
import StatusBadge from '../../components/common/StatusBadge';
import Spinner from '../../components/common/Spinner';
import axiosInstance from '../../api/axiosInstance';
import { useAuth } from '../../context/AuthContext';
import toast from 'react-hot-toast';

const FarmerDashboard = () => {
  const { user } = useAuth();
  const [batches, setBatches] = useState([]);
  const [loading, setLoading] = useState(true);
  const [submitting, setSubmitting] = useState(false);
  const [searchTerm, setSearchTerm] = useState('');
  const [generatedId, setGeneratedId] = useState('');

  const [formData, setFormData] = useState({
    cropName: '',
    cropCategory: '',
    quantity: '',
    unit: 'kg',
    harvestDate: '',
    farmerLocation: '',
    transportDate: ''
  });

  useEffect(() => {
    fetchBatches();
  }, []);

  const fetchBatches = async () => {
    try {
      const res = await axiosInstance.get('/farmer/my-batches');
      setBatches(res.data.data);
    } catch (error) {
      // Handled globally
    } finally {
      setLoading(false);
    }
  };

  const handleGenerateId = () => {
    const randomNum = Math.floor(100 + Math.random() * 900);
    setGeneratedId(`AGRI${randomNum}`);
    toast.success('Product ID generated!');
  };

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setSubmitting(true);
    
    try {
      const payload = {
        ...formData,
        farmerName: user.name,
        description: `Transport Date: ${formData.transportDate}` // Sending transport date in description
      };
      
      await axiosInstance.post('/farmer/create-batch', payload);
      toast.success('Product created successfully!');
      
      // Reset form
      setFormData({
        cropName: '', cropCategory: '', quantity: '', unit: 'kg', harvestDate: '', farmerLocation: '', transportDate: ''
      });
      setGeneratedId('');
      fetchBatches(); // Refresh list
    } catch (error) {
      // Handled globally
    } finally {
      setSubmitting(false);
    }
  };

  const filteredBatches = batches.filter(batch => 
    batch.cropName.toLowerCase().includes(searchTerm.toLowerCase()) ||
    batch.batchId.toLowerCase().includes(searchTerm.toLowerCase())
  );

  return (
    <DashboardLayout>
      <div className="mb-8">
        <h1 className="text-3xl font-bold text-gray-800 dark:text-white mb-2">Farmer Dashboard</h1>
        <p className="text-gray-500 dark:text-gray-400">Welcome back, {user?.name}. Manage your harvests here.</p>
      </div>

      {/* Statistics Cards */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
        <Card hover className="flex items-center justify-between">
          <div>
            <p className="text-sm text-gray-500 dark:text-gray-400 mb-1">Total Products</p>
            <h3 className="text-3xl font-bold text-gray-800 dark:text-white">{batches.length}</h3>
          </div>
          <div className="w-12 h-12 rounded-xl bg-blue-100 dark:bg-blue-900/30 flex items-center justify-center text-blue-600 dark:text-blue-400 text-xl">
            <FiBox />
          </div>
        </Card>
        <Card hover className="flex items-center justify-between">
          <div>
            <p className="text-sm text-gray-500 dark:text-gray-400 mb-1">At Collection</p>
            <h3 className="text-3xl font-bold text-gray-800 dark:text-white">{batches.filter(b => b.currentStatus === 'AtCollectionCenter').length}</h3>
          </div>
          <div className="w-12 h-12 rounded-xl bg-yellow-100 dark:bg-yellow-900/30 flex items-center justify-center text-yellow-600 dark:text-yellow-400 text-xl">
            <FiClock />
          </div>
        </Card>
        <Card hover className="flex items-center justify-between">
          <div>
            <p className="text-sm text-gray-500 dark:text-gray-400 mb-1">At Retail</p>
            <h3 className="text-3xl font-bold text-gray-800 dark:text-white">{batches.filter(b => b.currentStatus === 'AtRetailer').length}</h3>
          </div>
          <div className="w-12 h-12 rounded-xl bg-green-100 dark:bg-green-900/30 flex items-center justify-center text-green-600 dark:text-green-400 text-xl">
            <FiCheckCircle />
          </div>
        </Card>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Create Product Form */}
        <div className="lg:col-span-1">
          <Card>
            <h2 className="text-xl font-bold text-gray-800 dark:text-white mb-4 flex items-center">
              <FiPlusCircle className="mr-2" /> Create New Product
            </h2>
            <form onSubmit={handleSubmit} className="space-y-4">
              <div className="flex gap-2">
                <div className="flex-1">
                  <Label>Product ID</Label>
                  <input 
                    type="text" 
                    value={generatedId} 
                    readOnly 
                    placeholder="Click Generate" 
                    className="w-full px-4 py-2.5 rounded-xl bg-gray-100 dark:bg-slate-800 border border-white/20 dark:border-white/10 text-gray-500 dark:text-gray-400 cursor-not-allowed"
                  />
                </div>
                <Button type="button" variant="secondary" onClick={handleGenerateId} className="self-end">Generate</Button>
              </div>

              <InputField label="Product Name" name="cropName" value={formData.cropName} onChange={handleChange} required />
              <InputField label="Breed / Variety" name="cropCategory" value={formData.cropCategory} onChange={handleChange} required />
              
              <div className="grid grid-cols-2 gap-4">
                <InputField label="Quantity" type="number" name="quantity" value={formData.quantity} onChange={handleChange} required />
                <div>
                  <Label>Unit</Label>
                  <select 
                    name="unit" 
                    value={formData.unit} 
                    onChange={handleChange}
                    className="w-full px-4 py-2.5 rounded-xl bg-white/50 dark:bg-slate-800/50 border border-white/20 dark:border-white/10 text-gray-800 dark:text-white focus:outline-none focus:ring-2 focus:ring-blue-500"
                  >
                    <option value="kg">kg</option>
                    <option value="g">g</option>
                    <option value="tons">tons</option>
                    <option value="crates">crates</option>
                  </select>
                </div>
              </div>

              <InputField label="Harvest Location" name="farmerLocation" value={formData.farmerLocation} onChange={handleChange} required />
              <InputField label="Harvest Date" type="date" name="harvestDate" value={formData.harvestDate} onChange={handleChange} required />
              <InputField label="Transport Date" type="date" name="transportDate" value={formData.transportDate} onChange={handleChange} required />

              <Button type="submit" variant="gradient" className="w-full" disabled={submitting}>
                {submitting ? 'Saving...' : 'Save Product'}
              </Button>
            </form>
          </Card>
        </div>

        {/* Products List */}
        <div className="lg:col-span-2">
          <Card>
            <div className="flex justify-between items-center mb-6">
              <h2 className="text-xl font-bold text-gray-800 dark:text-white">My Products</h2>
              <div className="relative w-64">
                <FiSearch className="absolute left-3 top-3 text-gray-400" />
                <input 
                  type="text" 
                  placeholder="Search..." 
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                  className="w-full pl-10 pr-4 py-2.5 rounded-xl bg-white/50 dark:bg-slate-800/50 border border-white/20 dark:border-white/10 text-gray-800 dark:text-white focus:outline-none focus:ring-2 focus:ring-blue-500"
                />
              </div>
            </div>

            {loading ? (
              <div className="flex justify-center py-12"><Spinner /></div>
            ) : (
              <div className="overflow-x-auto">
                <table className="w-full text-left border-collapse">
                  <thead>
                    <tr className="border-b border-gray-200 dark:border-gray-700">
                      <th className="py-3 px-4 text-gray-500 dark:text-gray-400 font-medium">Batch ID</th>
                      <th className="py-3 px-4 text-gray-500 dark:text-gray-400 font-medium">Product</th>
                      <th className="py-3 px-4 text-gray-500 dark:text-gray-400 font-medium">Quantity</th>
                      <th className="py-3 px-4 text-gray-500 dark:text-gray-400 font-medium">Status</th>
                    </tr>
                  </thead>
                  <tbody>
                    {filteredBatches.length > 0 ? (
                      filteredBatches.map((batch) => (
                        <motion.tr 
                          key={batch._id}
                          initial={{ opacity: 0 }}
                          animate={{ opacity: 1 }}
                          className="border-b border-gray-100 dark:border-gray-800 hover:bg-gray-50 dark:hover:bg-slate-800/50 transition"
                        >
                          <td className="py-3 px-4 text-sm text-gray-700 dark:text-gray-300 font-medium">{batch.batchId}</td>
                          <td className="py-3 px-4 text-sm text-gray-700 dark:text-gray-300">{batch.cropName}</td>
                          <td className="py-3 px-4 text-sm text-gray-700 dark:text-gray-300">{batch.quantity} {batch.unit}</td>
                          <td className="py-3 px-4"><StatusBadge status={batch.currentStatus} /></td>
                        </motion.tr>
                      ))
                    ) : (
                      <tr>
                        <td colSpan="4" className="text-center py-12 text-gray-400">No products found.</td>
                      </tr>
                    )}
                  </tbody>
                </table>
              </div>
            )}
          </Card>
        </div>
      </div>
    </DashboardLayout>
  );
};

// Simple internal components to keep file clean
const Label = ({ children }) => <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">{children}</label>;
const InputField = ({ label, ...props }) => (
  <div>
    <Label>{label}</Label>
    <input 
      {...props} 
      className="w-full px-4 py-2.5 rounded-xl bg-white/50 dark:bg-slate-800/50 border border-white/20 dark:border-white/10 text-gray-800 dark:text-white focus:outline-none focus:ring-2 focus:ring-blue-500"
    />
  </div>
);

export default FarmerDashboard;

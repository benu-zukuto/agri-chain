import { useState } from 'react';
import { motion } from 'framer-motion';
import { FiSearch, FiClock, FiCheckCircle, FiTruck, FiArrowRight, FiBox } from 'react-icons/fi';
import DashboardLayout from '../../components/layout/DashboardLayout';
import Card from '../../components/common/Card';
import Button from '../../components/common/Button';
import StatusBadge from '../../components/common/StatusBadge';
import Spinner from '../../components/common/Spinner';
import axiosInstance from '../../api/axiosInstance';
import { useAuth } from '../../context/AuthContext';
import toast from 'react-hot-toast';

const CollectionDashboard = () => {
  const { user } = useAuth();
  const [searchId, setSearchId] = useState('');
  const [loading, setLoading] = useState(false);
  const [submitting, setSubmitting] = useState(false);
  const [searchResult, setSearchResult] = useState(null);
  const [batchFound, setBatchFound] = useState(null);

  const [formData, setFormData] = useState({
    arrivalDate: '',
    exportDate: '',
    qualityGrade: 'Class A',
    goodPackage: '',
    badPackage: '',
    totalExported: ''
  });

  const handleSearch = async (e) => {
    e.preventDefault();
    if (!searchId) return toast.error('Please enter a Product ID (e.g., AGRI001)');
    
    setLoading(true);
    setBatchFound(null);
    setSearchResult(null);

    try {
      // Using the history endpoint to fetch product from DB
      const res = await axiosInstance.get(`/customer/history/${searchId}`);
      setSearchResult(res.data.data);
    } catch (error) {
      // Handled globally by axios interceptor
    } finally {
      setLoading(false);
    }
  };

  const handleLoadDetails = () => {
    setBatchFound(searchResult);
    setSearchResult(null); 
    toast.success('Product loaded. You can now update collection data.');
  };

  const calculateStorageDays = () => {
    if (formData.arrivalDate && formData.exportDate) {
      const arrival = new Date(formData.arrivalDate);
      const exportD = new Date(formData.exportDate);
      const diffTime = Math.abs(exportD - arrival);
      const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24));
      return diffDays;
    }
    return 0;
  };

  const storageDays = calculateStorageDays();

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!batchFound) return toast.error('Please search and load a valid product first');
    
    setSubmitting(true);
    try {
      // Map frontend data to backend schema
      const payload = {
        batch: batchFound.batch._id, // Send MongoDB ObjectId from DB
        qualityGrade: formData.qualityGrade,
        processingDate: formData.arrivalDate,
        storageDays: storageDays,
        storageTemperature: "Ambient",
        remarks: `Good: ${formData.goodPackage}, Bad: ${formData.badPackage}, Total Exported: ${formData.totalExported}`
      };

      await axiosInstance.post('/collection/update', payload);
      toast.success('Collection update submitted successfully!');
      
      // Reset form and loaded product
      setBatchFound(null);
      setSearchId('');
      setFormData({ arrivalDate: '', exportDate: '', qualityGrade: 'Class A', goodPackage: '', badPackage: '', totalExported: '' });
    } catch (error) {
      // Handled globally
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <DashboardLayout>
      <div className="mb-8">
        <h1 className="text-3xl font-bold text-gray-800 dark:text-white mb-2">Collection Center</h1>
        <p className="text-gray-500 dark:text-gray-400">Welcome, {user?.name}. Process incoming harvests.</p>
      </div>

      {/* Statistics */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
        <Card hover className="flex items-center justify-between">
          <div>
            <p className="text-sm text-gray-500 dark:text-gray-400 mb-1">Processed Today</p>
            <h3 className="text-3xl font-bold text-gray-800 dark:text-white">12</h3>
          </div>
          <div className="w-12 h-12 rounded-xl bg-blue-100 dark:bg-blue-900/30 flex items-center justify-center text-blue-600 text-xl">
            <FiCheckCircle />
          </div>
        </Card>
        <Card hover className="flex items-center justify-between">
          <div>
            <p className="text-sm text-gray-500 dark:text-gray-400 mb-1">In Storage</p>
            <h3 className="text-3xl font-bold text-gray-800 dark:text-white">4</h3>
          </div>
          <div className="w-12 h-12 rounded-xl bg-yellow-100 dark:bg-yellow-900/30 flex items-center justify-center text-yellow-600 text-xl">
            <FiClock />
          </div>
        </Card>
        <Card hover className="flex items-center justify-between">
          <div>
            <p className="text-sm text-gray-500 dark:text-gray-400 mb-1">Exported</p>
            <h3 className="text-3xl font-bold text-gray-800 dark:text-white">8</h3>
          </div>
          <div className="w-12 h-12 rounded-xl bg-green-100 dark:bg-green-900/30 flex items-center justify-center text-green-600 text-xl">
            <FiTruck />
          </div>
        </Card>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Search & Farmer Details */}
        <Card>
          <h2 className="text-xl font-bold text-gray-800 dark:text-white mb-4">Search Product</h2>
          <form onSubmit={handleSearch} className="flex gap-2 mb-6">
            <div className="relative flex-1">
              <FiSearch className="absolute left-3 top-3 text-gray-400" />
              <input 
                type="text" 
                placeholder="Enter Product ID (e.g., AGRI001)" 
                value={searchId}
                onChange={(e) => setSearchId(e.target.value)}
                className="w-full pl-10 pr-4 py-2.5 rounded-xl bg-white/50 dark:bg-slate-800/50 border border-white/20 dark:border-white/10 text-gray-800 dark:text-white focus:outline-none focus:ring-2 focus:ring-blue-500"
              />
            </div>
            <Button type="submit" variant="secondary" disabled={loading}>
              {loading ? <Spinner className="w-5 h-5" /> : 'Search'}
            </Button>
          </form>

          {/* Search Result List (Clickable) */}
          {searchResult && !batchFound && (
            <motion.div 
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              className="bg-gray-50 dark:bg-slate-800/50 p-4 rounded-xl border border-gray-100 dark:border-gray-700 flex items-center justify-between cursor-pointer hover:border-blue-500 transition-all"
              onClick={handleLoadDetails}
            >
              <div className="flex items-center">
                <FiBox className="text-2xl text-blue-600 mr-3" />
                <div>
                  <h3 className="font-semibold text-gray-800 dark:text-white">{searchResult.batch.cropName}</h3>
                  <p className="text-sm text-gray-500 dark:text-gray-400">ID: {searchResult.batch.batchId}</p>
                </div>
              </div>
              <Button variant="ghost" className="text-blue-600">
                View Details <FiArrowRight className="inline ml-1" />
              </Button>
            </motion.div>
          )}

          {/* Empty State */}
          {!searchResult && !batchFound && (
            <div className="flex flex-col items-center justify-center py-12 text-center border-2 border-dashed border-gray-200 dark:border-gray-700 rounded-xl">
              <FiSearch className="text-5xl text-gray-300 dark:text-gray-600 mb-4" />
              <h3 className="text-lg font-semibold text-gray-500 dark:text-gray-400">No Product Loaded</h3>
              <p className="text-sm text-gray-400 max-w-xs mt-1">
                Enter a Product ID provided by the farmer to begin processing.
              </p>
            </div>
          )}

          {/* Loaded Farmer Details (Read Only) */}
          {batchFound && (
            <motion.div 
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              className="space-y-4 bg-gray-50 dark:bg-slate-800/50 p-4 rounded-xl border border-gray-100 dark:border-gray-700"
            >
              <div className="flex justify-between items-center mb-2">
                <h3 className="text-lg font-semibold text-gray-700 dark:text-gray-200">Farmer Details</h3>
                <StatusBadge status={batchFound.batch.currentStatus} />
              </div>
              <div className="grid grid-cols-2 gap-4 text-sm">
                <div>
                  <p className="text-gray-500 dark:text-gray-400">Batch ID</p>
                  <p className="font-medium text-gray-800 dark:text-white">{batchFound.batch.batchId}</p>
                </div>
                <div>
                  <p className="text-gray-500 dark:text-gray-400">Crop</p>
                  <p className="font-medium text-gray-800 dark:text-white">{batchFound.batch.cropName}</p>
                </div>
                <div>
                  <p className="text-gray-500 dark:text-gray-400">Farmer Name</p>
                  <p className="font-medium text-gray-800 dark:text-white">{batchFound.batch.farmerName}</p>
                </div>
                <div>
                  <p className="text-gray-500 dark:text-gray-400">Quantity</p>
                  <p className="font-medium text-gray-800 dark:text-white">{batchFound.batch.quantity} {batchFound.batch.unit}</p>
                </div>
              </div>
            </motion.div>
          )}
        </Card>

        {/* Collection Update Form */}
        <Card>
          <h2 className="text-xl font-bold text-gray-800 dark:text-white mb-4">Update Collection Data</h2>
          <form onSubmit={handleSubmit} className="space-y-4">
            <div className="grid grid-cols-2 gap-4">
              <InputField label="Arrival Date" type="date" name="arrivalDate" value={formData.arrivalDate} onChange={handleChange} disabled={!batchFound} />
              <InputField label="Export Date" type="date" name="exportDate" value={formData.exportDate} onChange={handleChange} disabled={!batchFound} />
            </div>

            <div>
              <Label>Storage Days (Auto-calculated)</Label>
              <input 
                type="text" 
                value={`${storageDays} Days`} 
                readOnly 
                className="w-full px-4 py-2.5 rounded-xl bg-gray-100 dark:bg-slate-800 border border-white/20 dark:border-white/10 text-gray-500 dark:text-gray-400 cursor-not-allowed"
              />
            </div>

            <div>
              <Label>Quality Grade</Label>
              <select 
                name="qualityGrade" 
                value={formData.qualityGrade} 
                onChange={handleChange}
                disabled={!batchFound}
                className="w-full px-4 py-2.5 rounded-xl bg-white/50 dark:bg-slate-800/50 border border-white/20 dark:border-white/10 text-gray-800 dark:text-white focus:outline-none focus:ring-2 focus:ring-blue-500"
              >
                <option value="Class A">Class A</option>
                <option value="Class B">Class B</option>
                <option value="Class C">Class C</option>
              </select>
            </div>

            <div className="grid grid-cols-3 gap-4">
              <InputField label="Good Pkg" type="number" name="goodPackage" value={formData.goodPackage} onChange={handleChange} disabled={!batchFound} />
              <InputField label="Bad Pkg" type="number" name="badPackage" value={formData.badPackage} onChange={handleChange} disabled={!batchFound} />
              <InputField label="Total Export" type="number" name="totalExported" value={formData.totalExported} onChange={handleChange} disabled={!batchFound} />
            </div>

            <Button type="submit" variant="gradient" className="w-full" disabled={!batchFound || submitting}>
              {submitting ? 'Submitting...' : 'Submit Update'} <FiArrowRight className="inline ml-2" />
            </Button>
          </form>
        </Card>
      </div>
    </DashboardLayout>
  );
};

const Label = ({ children }) => <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">{children}</label>;
const InputField = ({ label, ...props }) => (
  <div>
    <Label>{label}</Label>
    <input 
      {...props} 
      className="w-full px-4 py-2.5 rounded-xl bg-white/50 dark:bg-slate-800/50 border border-white/20 dark:border-white/10 text-gray-800 dark:text-white focus:outline-none focus:ring-2 focus:ring-blue-500 disabled:opacity-50 disabled:cursor-not-allowed"
    />
  </div>
);

export default CollectionDashboard;

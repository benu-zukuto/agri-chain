import { useState } from 'react';
import { motion } from 'framer-motion';
import { FiSearch, FiShoppingBag, FiTag, FiDollarSign, FiDownload, FiArrowRight, FiBox } from 'react-icons/fi';
import { BsQrCode } from 'react-icons/bs';
import DashboardLayout from '../../components/layout/DashboardLayout';
import Card from '../../components/common/Card';
import Button from '../../components/common/Button';
import StatusBadge from '../../components/common/StatusBadge';
import Spinner from '../../components/common/Spinner';
import axiosInstance from '../../api/axiosInstance';
import { useAuth } from '../../context/AuthContext';
import toast from 'react-hot-toast';

const RetailDashboard = () => {
  const { user } = useAuth();
  const [searchId, setSearchId] = useState('');
  const [loading, setLoading] = useState(false);
  const [submitting, setSubmitting] = useState(false);
  const [generatingQR, setGeneratingQR] = useState(false);
  const [searchResult, setSearchResult] = useState(null);
  const [batchFound, setBatchFound] = useState(null);
  const [qrData, setQrData] = useState(null);

  const [formData, setFormData] = useState({
    arrivalDate: '',
    availableStock: '',
    price: ''
  });

  const handleSearch = async (e) => {
    e.preventDefault();
    if (!searchId) return toast.error('Please enter a Product ID');
    
    setLoading(true);
    setBatchFound(null);
    setSearchResult(null);
    setQrData(null);

    try {
      const res = await axiosInstance.get(`/customer/history/${searchId}`);
      setSearchResult(res.data.data);
    } catch (error) {
      // Handled globally
    } finally {
      setLoading(false);
    }
  };

  const handleLoadDetails = () => {
    setBatchFound(searchResult);
    setSearchResult(null);
    toast.success('Product loaded. You can now update retail data.');
  };

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!batchFound) return toast.error('Please search and load a valid product first');
    
    setSubmitting(true);
    try {
      const payload = {
        batch: batchFound.batch._id, // Real MongoDB ObjectId from DB
        retailShopName: user.name,
        retailLocation: "Default Location", 
        arrivalDate: formData.arrivalDate,
        availableStock: formData.availableStock,
        price: formData.price
      };

      await axiosInstance.post('/retail/update', payload);
      toast.success('Retail update submitted successfully!');
    } catch (error) {
      // Handled globally
    } finally {
      setSubmitting(false);
    }
  };

  const handleGenerateQR = async () => {
    if (!batchFound) return toast.error('Search for a product first');
    
    setGeneratingQR(true);
    try {
      const res = await axiosInstance.post('/retail/generate-qr', { batchId: batchFound.batch.batchId });
      setQrData(res.data.data);
      toast.success('QR Code generated successfully!');
    } catch (error) {
      // Handled globally
    } finally {
      setGeneratingQR(false);
    }
  };

  const baseUrl = import.meta.env.VITE_API_URL.replace('/api/v1', '');

  return (
    <DashboardLayout>
      <div className="mb-8">
        <h1 className="text-3xl font-bold text-gray-800 dark:text-white mb-2">Retail Dashboard</h1>
        <p className="text-gray-500 dark:text-gray-400">Welcome, {user?.name}. Manage your shop inventory.</p>
      </div>

      {/* Statistics */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
        <Card hover className="flex items-center justify-between">
          <div>
            <p className="text-sm text-gray-500 dark:text-gray-400 mb-1">Total Products</p>
            <h3 className="text-3xl font-bold text-gray-800 dark:text-white">15</h3>
          </div>
          <div className="w-12 h-12 rounded-xl bg-blue-100 dark:bg-blue-900/30 flex items-center justify-center text-blue-600 text-xl">
            <FiShoppingBag />
          </div>
        </Card>
        <Card hover className="flex items-center justify-between">
          <div>
            <p className="text-sm text-gray-500 dark:text-gray-400 mb-1">Available Stock</p>
            <h3 className="text-3xl font-bold text-gray-800 dark:text-white">320</h3>
          </div>
          <div className="w-12 h-12 rounded-xl bg-purple-100 dark:bg-purple-900/30 flex items-center justify-center text-purple-600 text-xl">
            <FiTag />
          </div>
        </Card>
        <Card hover className="flex items-center justify-between">
          <div>
            <p className="text-sm text-gray-500 dark:text-gray-400 mb-1">Revenue Today</p>
            <h3 className="text-3xl font-bold text-gray-800 dark:text-white">$240</h3>
          </div>
          <div className="w-12 h-12 rounded-xl bg-green-100 dark:bg-green-900/30 flex items-center justify-center text-green-600 text-xl">
            <FiDollarSign />
          </div>
        </Card>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Search & Read-Only Details */}
        <Card>
          <h2 className="text-xl font-bold text-gray-800 dark:text-white mb-4">Search Product</h2>
          <form onSubmit={handleSearch} className="flex gap-2 mb-6">
            <div className="relative flex-1">
              <FiSearch className="absolute left-3 top-3 text-gray-400" />
              <input 
                type="text" 
                placeholder="Enter Product ID" 
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
                Enter a Product ID to view its journey.
              </p>
            </div>
          )}

          {/* Loaded Details (Read Only) */}
          {batchFound && (
            <motion.div 
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              className="space-y-6 bg-gray-50 dark:bg-slate-800/50 p-4 rounded-xl border border-gray-100 dark:border-gray-700"
            >
              <div>
                <div className="flex justify-between items-center mb-3">
                  <h3 className="text-lg font-semibold text-gray-700 dark:text-gray-200">Product Details</h3>
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
                  {batchFound.collection && (
                    <>
                      <div>
                        <p className="text-gray-500 dark:text-gray-400">Quality Grade</p>
                        <p className="font-medium text-gray-800 dark:text-white">{batchFound.collection.qualityGrade}</p>
                      </div>
                      <div>
                        <p className="text-gray-500 dark:text-gray-400">Storage Days</p>
                        <p className="font-medium text-gray-800 dark:text-white">{batchFound.collection.storageDays} Days</p>
                      </div>
                    </>
                  )}
                </div>
              </div>
            </motion.div>
          )}
        </Card>

        {/* Retail Update & QR Form */}
        <Card>
          <h2 className="text-xl font-bold text-gray-800 dark:text-white mb-4">Retail Information</h2>
          <form onSubmit={handleSubmit} className="space-y-4 mb-6">
            <div className="grid grid-cols-2 gap-4">
              <div>
                <Label>Retail Shop Name (Auto)</Label>
                <input 
                  type="text" 
                  value={user?.name || ''} 
                  readOnly 
                  className="w-full px-4 py-2.5 rounded-xl bg-gray-100 dark:bg-slate-800 border border-white/20 dark:border-white/10 text-gray-500 dark:text-gray-400 cursor-not-allowed"
                />
              </div>
              <div>
                <Label>Retail Location (Auto)</Label>
                <input 
                  type="text" 
                  value="Default Location" 
                  readOnly 
                  className="w-full px-4 py-2.5 rounded-xl bg-gray-100 dark:bg-slate-800 border border-white/20 dark:border-white/10 text-gray-500 dark:text-gray-400 cursor-not-allowed"
                />
              </div>
            </div>

            <InputField label="Arrival Date" type="date" name="arrivalDate" value={formData.arrivalDate} onChange={handleChange} disabled={!batchFound} />
            
            <div className="grid grid-cols-2 gap-4">
              <InputField label="Available Stock" type="number" name="availableStock" value={formData.availableStock} onChange={handleChange} disabled={!batchFound} />
              <InputField label="Selling Price ($)" type="number" step="0.01" name="price" value={formData.price} onChange={handleChange} disabled={!batchFound} />
            </div>

            <Button type="submit" variant="gradient" className="w-full" disabled={!batchFound || submitting}>
              {submitting ? 'Updating...' : 'Update Product'}
            </Button>
          </form>

          <div className="border-t border-gray-100 dark:border-gray-700 pt-6">
            <Button type="button" variant="secondary" className="w-full mb-4" onClick={handleGenerateQR} disabled={!batchFound || generatingQR}>
              {generatingQR ? <Spinner className="w-5 h-5 mx-auto" /> : <><BsQrCode className="inline mr-2" /> Generate QR Code</>}
            </Button>

            {qrData && (
              <motion.div 
                initial={{ opacity: 0, scale: 0.9 }}
                animate={{ opacity: 1, scale: 1 }}
                className="flex flex-col items-center justify-center bg-gray-50 dark:bg-slate-800/50 p-4 rounded-xl"
              >
                <img src={`${baseUrl}${qrData.filePath}`} alt="QR Code" className="w-40 h-40 mb-4 rounded-lg bg-white p-2" />
                <a href={`${baseUrl}${qrData.filePath}`} download className="text-blue-600 hover:underline flex items-center text-sm font-medium">
                  <FiDownload className="mr-1" /> Download QR Code
                </a>
              </motion.div>
            )}
          </div>
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

export default RetailDashboard;

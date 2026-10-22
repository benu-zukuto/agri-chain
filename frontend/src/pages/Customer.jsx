import { useState, useEffect } from 'react';
import { useSearchParams } from 'react-router-dom';
import { motion, AnimatePresence } from 'framer-motion';
import { FiSearch, FiArrowRight, FiX, FiMapPin, FiCalendar, FiTag, FiUser, FiShoppingBag, FiClock } from 'react-icons/fi';
import { BsQrCode } from 'react-icons/bs';
import Navbar from '../components/layout/Navbar';
import Card from '../components/common/Card';
import Button from '../components/common/Button';
import StatusBadge from '../components/common/StatusBadge';
import Spinner from '../components/common/Spinner';
import Timeline from '../components/ui/Timeline';
import ProductJourneyNarrator from '../components/ui/ProductJourneyNarrator'; // <-- NEW IMPORT
import axiosInstance from '../api/axiosInstance';

const Customer = () => {
  const [searchParams, setSearchParams] = useSearchParams();
  const [searchTerm, setSearchTerm] = useState(searchParams.get('search') || '');
  const [loading, setLoading] = useState(false);
  const [historyLoading, setHistoryLoading] = useState(false);
  const [products, setProducts] = useState([]);
  const [selectedProduct, setSelectedProduct] = useState(null);

  const calculateDaysSince = (dateString) => {
    if (!dateString) return 'N/A';
    const harvest = new Date(dateString);
    const today = new Date();
    const diffTime = Math.abs(today - harvest);
    return Math.ceil(diffTime / (1000 * 60 * 60 * 24));
  };

  // Calculate total days from Harvest Date to Retail Arrival Date
  const calculateTotalJourneyDays = (harvestDate, retailDate) => {
    if (!harvestDate || !retailDate) return 'Pending';
    const harvest = new Date(harvestDate);
    const retail = new Date(retailDate);
    const diffTime = Math.abs(retail - harvest);
    return Math.ceil(diffTime / (1000 * 60 * 60 * 24));
  };

  const fetchProducts = async (query) => {
    setLoading(true);
    try {
      const res = await axiosInstance.get(`/customer/products?search=${query}`);
      setProducts(res.data.data);
    } catch (error) {
      // handled globally
    } finally {
      setLoading(false);
    }
  };

  const handleViewDetails = async (batchId) => {
    setHistoryLoading(true);
    try {
      const res = await axiosInstance.get(`/customer/history/${batchId}`);
      setSelectedProduct(res.data.data);
    } catch (error) {
      const product = products.find(p => p.batchId === batchId);
      if (product) {
        setSelectedProduct({ batch: product, collection: null, retail: null, timeline: [] });
      }
    } finally {
      setHistoryLoading(false);
    }
  };

  useEffect(() => {
    const query = searchParams.get('search');
    const batchId = searchParams.get('batchId');
    
    if (query) {
      setSearchTerm(query);
      fetchProducts(query);
    } else if (batchId) {
      handleViewDetails(batchId);
    }
  }, [searchParams]);

  const handleSearch = (e) => {
    e.preventDefault();
    setSearchParams({ search: searchTerm });
  };

  return (
    <div className="gradient-bg min-h-screen text-gray-800 dark:text-white">
      <Navbar />

      <div className="max-w-7xl mx-auto px-4 py-12">
        <div className="text-center mb-12">
          <h1 className="text-4xl md:text-5xl font-bold mb-4 bg-gradient-to-r from-blue-600 to-purple-600 bg-clip-text text-transparent">
            Track Your Food
          </h1>
          <p className="text-lg text-gray-600 dark:text-gray-400 mb-8">
            Enter the Product ID or Name to verify its complete journey.
          </p>
          
          <form onSubmit={handleSearch} className="max-w-xl mx-auto relative">
            <FiSearch className="absolute left-4 top-4 text-gray-400 text-xl" />
            <input 
              type="text" 
              placeholder="Search by Product Name or ID..." 
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="w-full pl-12 pr-4 py-4 rounded-2xl glass-card focus:outline-none focus:ring-2 focus:ring-blue-500 text-lg"
            />
          </form>
        </div>

        {loading ? (
          <div className="flex justify-center py-12"><Spinner /></div>
        ) : (
          <>
            {/* Results Grid */}
            {searchParams.get('search') && (
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 mb-12">
                {products.length > 0 ? (
                  products.map((product, index) => (
                    <motion.div
                      key={product._id}
                      initial={{ opacity: 0, y: 20 }}
                      animate={{ opacity: 1, y: 0 }}
                      transition={{ delay: index * 0.1 }}
                    >
                      <Card hover className="h-full flex flex-col justify-between">
                        <div>
                          <div className="flex justify-between items-start mb-4">
                            <div>
                              <h3 className="text-xl font-bold text-gray-800 dark:text-white">{product.cropName}</h3>
                              <p className="text-sm text-gray-500 dark:text-gray-400">{product.batchId}</p>
                            </div>
                            <StatusBadge status={product.currentStatus} />
                          </div>
                          <div className="space-y-2 text-sm text-gray-600 dark:text-gray-300">
                            <p className="flex items-center"><FiCalendar className="mr-2 text-gray-400" /> Harvested: {new Date(product.harvestDate).toLocaleDateString()}</p>
                            <p className="flex items-center"><FiMapPin className="mr-2 text-gray-400" /> Origin: {product.farmerLocation}</p>
                            <p className="flex items-center"><FiTag className="mr-2 text-gray-400" /> Days since harvest: {calculateDaysSince(product.harvestDate)} days</p>
                          </div>
                        </div>
                        <Button variant="secondary" className="w-full mt-6" onClick={() => handleViewDetails(product.batchId)}>
                          View Details <FiArrowRight className="inline ml-2" />
                        </Button>
                      </Card>
                    </motion.div>
                  ))
                ) : (
                  <div className="col-span-full text-center py-12 text-gray-400">
                    No products found matching your search.
                  </div>
                )}
              </div>
            )}

            {!searchParams.get('search') && (
              <div className="text-center py-16 glass-card rounded-3xl flex flex-col items-center justify-center">
                <BsQrCode className="text-6xl text-gray-300 dark:text-gray-600 mb-4" />
                <p className="text-gray-500 dark:text-gray-400">Start by searching for a product or scanning a QR code.</p>
              </div>
            )}
          </>
        )}
      </div>

      {/* Details Modal */}
      <AnimatePresence>
        {selectedProduct && (
          <motion.div 
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            onClick={() => setSelectedProduct(null)}
            className="fixed inset-0 bg-black/50 backdrop-blur-sm flex items-center justify-center p-4 z-50 overflow-y-auto"
          >
            <motion.div 
              initial={{ scale: 0.9, y: 20 }}
              animate={{ scale: 1, y: 0 }}
              exit={{ scale: 0.9, y: 20 }}
              onClick={(e) => e.stopPropagation()}
              className="bg-white dark:bg-slate-900 w-full max-w-2xl rounded-3xl p-8 max-h-[90vh] overflow-y-auto"
            >
              {historyLoading ? (
                <div className="flex justify-center py-24"><Spinner /></div>
              ) : (
                <>
                  <div className="flex justify-between items-start mb-6">
                    <div>
                      <h2 className="text-2xl font-bold text-gray-800 dark:text-white">{selectedProduct.batch?.cropName}</h2>
                      <p className="text-gray-500 dark:text-gray-400">ID: {selectedProduct.batch?.batchId}</p>
                    </div>
                    <button onClick={() => setSelectedProduct(null)} className="p-2 rounded-full hover:bg-gray-100 dark:hover:bg-gray-800">
                      <FiX className="text-2xl text-gray-500" />
                    </button>
                  </div>

                  <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-4">
                    <DetailBox title="Farmer Details">
                      <p>Name: {selectedProduct.batch?.farmerName || selectedProduct.batch?.farmer?.name}</p>
                      <p>Location: {selectedProduct.batch?.farmerLocation || selectedProduct.batch?.farmer?.location}</p>
                    </DetailBox>
                    <DetailBox title="Collection Center">
                      <p>Center: {selectedProduct.collection?.collectionCenter?.name || 'Pending'}</p>
                      <p>Grade: {selectedProduct.collection?.qualityGrade || 'Pending'}</p>
                      <p>Storage: {selectedProduct.collection?.storageDays ? `${selectedProduct.collection.storageDays} days` : 'Pending'}</p>
                    </DetailBox>
                    <DetailBox title="Retail Details">
                      <p>Shop: {selectedProduct.retail?.retailShopName || 'Pending'}</p>
                      <p>Location: {selectedProduct.retail?.retailLocation || 'Pending'}</p>
                    </DetailBox>
                    <DetailBox title="Product Info">
                      <p>Harvest Date: {selectedProduct.batch ? new Date(selectedProduct.batch.harvestDate).toLocaleDateString() : 'N/A'}</p>
                      <p>Quantity: {selectedProduct.batch?.quantity} {selectedProduct.batch?.unit}</p>
                      {selectedProduct.retail?.price && <p className="font-bold text-green-600 mt-1">Price: ${selectedProduct.retail.price}</p>}
                      
                      <div className="mt-3 pt-3 border-t border-gray-200 dark:border-gray-700 flex items-center text-blue-600 dark:text-blue-400 font-bold">
                        <FiClock className="mr-2" />
                        Total Journey: {calculateTotalJourneyDays(selectedProduct.batch?.harvestDate, selectedProduct.retail?.arrivalDate)} Days
                      </div>
                    </DetailBox>
                  </div>

                  {/* AI Product Journey Narrator Component */}
                  <ProductJourneyNarrator product={selectedProduct} />

                  <h3 className="text-xl font-bold text-gray-800 dark:text-white mt-8 mb-4">Product Timeline</h3>
                  <Timeline events={[
                    { title: 'Harvested by Farmer', date: selectedProduct.batch ? new Date(selectedProduct.batch.harvestDate).toLocaleDateString() : 'N/A', desc: `At ${selectedProduct.batch?.farmerLocation}`, icon: <FiUser /> },
                    ...(selectedProduct.collection ? [{ title: 'Processed at Collection', date: new Date(selectedProduct.collection.processingDate).toLocaleDateString(), desc: `Quality checked. Grade: ${selectedProduct.collection.qualityGrade}`, icon: <FiTag /> }] : []),
                    ...(selectedProduct.retail ? [{ title: 'Arrived at Retail', date: new Date(selectedProduct.retail.arrivalDate).toLocaleDateString(), desc: `Now available at ${selectedProduct.retail.retailShopName}`, icon: <FiShoppingBag /> }] : [])
                  ]} />
                </>
              )}
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
};

const DetailBox = ({ title, children }) => (
  <div className="bg-gray-50 dark:bg-slate-800/50 p-4 rounded-xl border border-gray-100 dark:border-gray-700">
    <h4 className="font-semibold text-gray-700 dark:text-gray-200 mb-2">{title}</h4>
    <div className="text-sm text-gray-600 dark:text-gray-400 space-y-1">
      {children}
    </div>
  </div>
);

export default Customer;

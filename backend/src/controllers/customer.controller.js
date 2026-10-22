const ProductBatch = require('../models/ProductBatch');
const CollectionUpdate = require('../models/CollectionUpdate');
const RetailUpdate = require('../models/RetailUpdate');
const ApiResponse = require('../utils/apiResponse');
const ApiError = require('../utils/apiError');

exports.getBatchHistory = async (req, res, next) => {
    try {
        const { batchId } = req.params;
        
        const batch = await ProductBatch.findOne({ batchId }).populate('farmer', 'name phone location');
        if (!batch) return next(new ApiError(404, "Batch not found"));

        const collection = await CollectionUpdate.findOne({ batch: batch._id }).populate('collectionCenter', 'name phone');
        const retail = await RetailUpdate.findOne({ batch: batch._id }).populate('retailer', 'name phone');

        const timeline = [];
        timeline.push({ event: "Batch Created", date: batch.createdAt, actor: batch.farmerName });
        if (collection) timeline.push({ event: "Processed at Center", date: collection.processingDate, actor: collection.collectionCenter.name });
        if (retail) timeline.push({ event: "Arrived at Retail", date: retail.arrivalDate, actor: retail.retailShopName });

        res.status(200).json(new ApiResponse(200, { batch, collection, retail, timeline }));
    } catch (error) {
        next(new ApiError(500, error.message));
    }
};
// Search products by name (Public)
exports.searchProducts = async (req, res, next) => {
    try {
        const searchQuery = req.query.search;
        const query = searchQuery ? { cropName: { $regex: searchQuery, $options: 'i' } } : {};
        
        const products = await ProductBatch.find(query).populate('farmer', 'name location');
        
        res.status(200).json(new ApiResponse(200, products));
    } catch (error) {
        next(new ApiError(500, error.message));
    }
};

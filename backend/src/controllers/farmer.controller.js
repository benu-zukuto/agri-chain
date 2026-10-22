const ProductBatch = require('../models/ProductBatch');
const { generateBatchId } = require('../services/batch.service');
const ApiResponse = require('../utils/apiResponse');
const ApiError = require('../utils/apiError');

exports.createBatch = async (req, res, next) => {
    try {
        const batchId = generateBatchId();
        const batchData = { ...req.body, batchId, farmer: req.user._id };
        
        const batch = await ProductBatch.create(batchData);
        res.status(201).json(new ApiResponse(201, batch, "Batch created successfully"));
    } catch (error) {
        next(new ApiError(400, error.message));
    }
};

exports.getMyBatches = async (req, res, next) => {
    try {
        const batches = await ProductBatch.find({ farmer: req.user._id });
        res.status(200).json(new ApiResponse(200, batches));
    } catch (error) {
        next(new ApiError(500, error.message));
    }
};

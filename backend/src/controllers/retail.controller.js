const ProductBatch = require('../models/ProductBatch');
const RetailUpdate = require('../models/RetailUpdate');
const { generateQRCode } = require('../services/qr.service');
const ApiResponse = require('../utils/apiResponse');
const ApiError = require('../utils/apiError');

exports.updateRetail = async (req, res, next) => {
    try {
        const batch = await ProductBatch.findById(req.body.batch);
        if (!batch) return next(new ApiError(404, "Batch not found"));

        const update = await RetailUpdate.create({ ...req.body, retailer: req.user._id });
        
        batch.currentStatus = 'AtRetailer';
        await batch.save();

        res.status(201).json(new ApiResponse(201, update, "Retail update added successfully"));
    } catch (error) {
        next(new ApiError(400, error.message));
    }
};

exports.generateQR = async (req, res, next) => {
    try {
        const { batchId } = req.body;
        const batch = await ProductBatch.findOne({ batchId });
        if (!batch) return next(new ApiError(404, "Batch not found"));

        const qrData = await generateQRCode(batchId);
        res.status(200).json(new ApiResponse(200, qrData, "QR Code generated successfully"));
    } catch (error) {
        next(new ApiError(500, error.message));
    }
};

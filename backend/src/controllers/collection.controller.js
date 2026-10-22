const ProductBatch = require('../models/ProductBatch');
const CollectionUpdate = require('../models/CollectionUpdate');
const ApiResponse = require('../utils/apiResponse');
const ApiError = require('../utils/apiError');

exports.updateCollection = async (req, res, next) => {
    try {
        const batch = await ProductBatch.findById(req.body.batch);
        if (!batch) return next(new ApiError(404, "Batch not found"));

        const update = await CollectionUpdate.create({ ...req.body, collectionCenter: req.user._id });
        
        batch.currentStatus = 'AtCollectionCenter';
        await batch.save();

        res.status(201).json(new ApiResponse(201, update, "Collection update added successfully"));
    } catch (error) {
        next(new ApiError(400, error.message));
    }
};

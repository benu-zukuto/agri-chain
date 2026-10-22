const mongoose = require('mongoose');

const productBatchSchema = new mongoose.Schema({
    batchId: { type: String, required: true, unique: true },
    farmer: { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true },
    cropName: { type: String, required: true },
    cropCategory: { type: String, required: true },
    quantity: { type: Number, required: true },
    unit: { type: String, required: true },
    harvestDate: { type: Date, required: true },
    farmerName: { type: String, required: true },
    farmerLocation: { type: String, required: true },
    description: { type: String, default: 'N/A' },
    currentStatus: { 
        type: String, 
        enum: ['Created', 'AtCollectionCenter', 'AtRetailer', 'Sold'], 
        default: 'Created' 
    }
}, { timestamps: true });

module.exports = mongoose.model('ProductBatch', productBatchSchema);

const mongoose = require('mongoose');

const retailUpdateSchema = new mongoose.Schema({
    batch: { type: mongoose.Schema.Types.ObjectId, ref: 'ProductBatch', required: true },
    retailer: { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true },
    retailShopName: { type: String, required: true },
    retailLocation: { type: String, required: true },
    arrivalDate: { type: Date, required: true },
    availableStock: { type: Number, required: true },
    price: { type: Number, required: true },
    status: { type: String, default: 'Available' }
}, { timestamps: true });

module.exports = mongoose.model('RetailUpdate', retailUpdateSchema);

const mongoose = require('mongoose');

const collectionUpdateSchema = new mongoose.Schema({
    batch: { type: mongoose.Schema.Types.ObjectId, ref: 'ProductBatch', required: true },
    collectionCenter: { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true },
    qualityGrade: { type: String, required: true },
    processingDate: { type: Date, required: true },
    storageDays: { type: Number, required: true },
    storageTemperature: { type: String, required: true },
    remarks: { type: String, default: 'N/A' },
    status: { type: String, default: 'Processed' }
}, { timestamps: true });

module.exports = mongoose.model('CollectionUpdate', collectionUpdateSchema);

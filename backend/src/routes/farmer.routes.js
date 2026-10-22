const express = require('express');
const router = express.Router();
const { createBatch, getMyBatches } = require('../controllers/farmer.controller');
const { protect, authorize } = require('../middleware/auth.middleware');

router.use(protect, authorize('Farmer'));

router.post('/create-batch', createBatch);
router.get('/my-batches', getMyBatches);

module.exports = router;

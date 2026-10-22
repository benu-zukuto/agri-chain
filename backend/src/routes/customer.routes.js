const express = require('express');
const router = express.Router();
const { getBatchHistory, searchProducts } = require('../controllers/customer.controller');

// Public routes for customers (No login required)
router.get('/products', searchProducts);
router.get('/history/:batchId', getBatchHistory);

module.exports = router;

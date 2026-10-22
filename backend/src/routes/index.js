const express = require('express');
const router = express.Router();

const healthRoutes = require('./health.routes');
const authRoutes = require('./auth.routes');
const farmerRoutes = require('./farmer.routes');
const collectionRoutes = require('./collection.routes');
const retailRoutes = require('./retail.routes');
const customerRoutes = require('./customer.routes');

router.use('/health', healthRoutes);
router.use('/auth', authRoutes);
router.use('/farmer', farmerRoutes);
router.use('/collection', collectionRoutes);
router.use('/retail', retailRoutes);
router.use('/customer', customerRoutes);

module.exports = router;

const express = require('express');
const router = express.Router();
const { updateCollection } = require('../controllers/collection.controller');
const { protect, authorize } = require('../middleware/auth.middleware');

router.use(protect, authorize('CollectionCenter'));

router.post('/update', updateCollection);

module.exports = router;

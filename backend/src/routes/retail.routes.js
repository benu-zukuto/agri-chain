const express = require('express');
const router = express.Router();
const { updateRetail, generateQR } = require('../controllers/retail.controller');
const { protect, authorize } = require('../middleware/auth.middleware');

router.use(protect, authorize('Retail'));

router.post('/update', updateRetail);
router.post('/generate-qr', generateQR);

module.exports = router;

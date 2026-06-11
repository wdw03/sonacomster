const express = require('express');
const router = express.Router();
const { getStats, getRecentReports, getTopVendors, getDefectDistribution } = require('../controllers/dashboardController');
const { protect } = require('../middleware/authMiddleware');

router.get('/stats', protect, getStats);
router.get('/recent', protect, getRecentReports);
router.get('/vendors', protect, getTopVendors);
router.get('/defects', protect, getDefectDistribution);

module.exports = router;

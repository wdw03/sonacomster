const express = require('express');
const router = express.Router();
const { getReports, createReport, deleteReport, updateReportStatus, updateKanbanStage, addComment, getReportStats, getActivity } = require('../controllers/reportController');
const { protect } = require('../middleware/authMiddleware');

router.route('/').get(protect, getReports).post(protect, createReport);
router.route('/stats').get(protect, getReportStats);
router.route('/activity').get(protect, getActivity);
router.route('/:id').delete(protect, deleteReport);
router.route('/:id/status').put(protect, updateReportStatus);
router.route('/:id/stage').put(protect, updateKanbanStage);
router.route('/:id/comment').post(protect, addComment);

module.exports = router;

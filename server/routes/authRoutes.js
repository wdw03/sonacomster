const express = require('express');
const router = express.Router();
const { authUser, updateProfile } = require('../controllers/authController');
const { protect } = require('../middleware/authMiddleware');

router.post('/login', authUser);
router.put('/profile', protect, updateProfile);

module.exports = router;

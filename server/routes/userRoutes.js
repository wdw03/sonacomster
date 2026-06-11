const express = require('express');
const router = express.Router();
const { getUsers, createUser, updateUserStatus } = require('../controllers/userController');
const { protect } = require('../middleware/authMiddleware');

router.route('/').get(protect, getUsers).post(protect, createUser);
router.route('/:id').put(protect, updateUserStatus);

module.exports = router;

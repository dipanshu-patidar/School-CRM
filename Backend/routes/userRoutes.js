const express = require('express');
const router = express.Router();
const { getStaff, updateProfile } = require('../controllers/userController');
const { protect } = require('../middlewares/authMiddleware');

router.get('/staff', protect, getStaff);
router.put('/profile', protect, updateProfile);

module.exports = router;

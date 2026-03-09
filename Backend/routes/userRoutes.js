const express = require('express');
const router = express.Router();
const { getStaff } = require('../controllers/userController');
const { protect } = require('../middlewares/authMiddleware');

router.get('/staff', protect, getStaff);

module.exports = router;

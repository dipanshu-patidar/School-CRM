const express = require('express');
const router = express.Router();
const {
    getWorkshops,
    createWorkshop,
    updateWorkshop,
    deleteWorkshop
} = require('../controllers/workshopController');
const { protect, authorize } = require('../middlewares/authMiddleware');

router.route('/')
    .get(protect, getWorkshops)
    .post(protect, authorize('admin'), createWorkshop);

router.route('/:id')
    .put(protect, authorize('admin'), updateWorkshop)
    .delete(protect, authorize('admin'), deleteWorkshop);

module.exports = router;

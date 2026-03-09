const express = require('express');
const router = express.Router();
const {
    getStudents,
    createStudent,
    getStudentById,
    updateStudent,
    deleteStudent
} = require('../controllers/studentController');

const { protect, authorize } = require('../middlewares/authMiddleware');

router.route('/')
    .get(protect, getStudents)
    .post(protect, authorize('admin'), createStudent);

router.route('/:id')
    .get(protect, getStudentById)
    .put(protect, authorize('admin'), updateStudent)
    .delete(protect, authorize('admin'), deleteStudent);

module.exports = router;

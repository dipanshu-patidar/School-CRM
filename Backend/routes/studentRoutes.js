const express = require('express');
const router = express.Router();
const {
    getStudents,
    createStudent,
    getStudentById,
    updateStudent,
    deleteStudent
} = require('../controllers/studentController');

const {
    addNote,
    deleteNote,
    addAttendance,
    deleteAttendance,
    uploadDocument,
    deleteDocument,
    downloadDocument
} = require('../controllers/studentTabsController');

const { upload } = require('../config/cloudinary');
const { protect, authorize } = require('../middlewares/authMiddleware');

router.route('/')
    .get(protect, getStudents)
    .post(protect, authorize('admin'), createStudent);

router.route('/:id')
    .get(protect, getStudentById)
    .put(protect, authorize('admin'), updateStudent)
    .delete(protect, authorize('admin'), deleteStudent);

// Notes routes
router.route('/:id/notes')
    .post(protect, addNote);
router.route('/:id/notes/:noteId')
    .delete(protect, deleteNote);

// Attendance routes
router.route('/:id/attendance')
    .post(protect, addAttendance);
router.route('/:id/attendance/:attId')
    .delete(protect, authorize('admin'), deleteAttendance);

// Documents routes
router.route('/:id/documents')
    .post(protect, upload.single('document'), uploadDocument);
router.route('/:id/documents/:docId/download')
    .get(protect, downloadDocument);
router.route('/:id/documents/:docId')
    .delete(protect, authorize('admin'), deleteDocument);

module.exports = router;

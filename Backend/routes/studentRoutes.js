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
    getAllAttendance,
    addPcpReport,
    deletePcpReport,
    getAllPcpReports,
    getAllDocuments
} = require('../controllers/studentTabsController');

const { upload } = require('../config/cloudinary');
const { protect, authorize } = require('../middlewares/authMiddleware');

// Main student routes
router.get('/', protect, getStudents);
router.post('/', protect, authorize('admin'), createStudent);
router.get('/attendance', protect, getAllAttendance);
router.get('/pcp-reports', protect, getAllPcpReports);
router.get('/all-documents', protect, getAllDocuments);

router.route('/:id')
    .get(protect, getStudentById)
    .put(protect, authorize('admin'), updateStudent)
    .delete(protect, authorize('admin'), deleteStudent);

// Tab routes
router.post('/:id/notes', protect, addNote);
router.delete('/:studentId/notes/:noteId', protect, deleteNote);

router.post('/:id/attendance', protect, addAttendance);
router.delete('/:studentId/attendance/:attendanceId', protect, deleteAttendance);

router.post('/:id/documents', protect, upload.single('document'), uploadDocument);
router.delete('/:studentId/documents/:docId', protect, authorize('admin'), deleteDocument);

router.post('/:id/pcp-reports', protect, addPcpReport);
router.delete('/:studentId/pcp-reports/:reportId', protect, deletePcpReport);

module.exports = router;

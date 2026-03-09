const express = require('express');
const router = express.Router();
const { uploadDocument, getDocuments, deleteDocument } = require('../controllers/documentController');
const { protect, authorize } = require('../middlewares/authMiddleware');
const { uploadDocument: uploadMiddleware } = require('../config/upload'); // rename exported middleware

router.route('/')
    .get(protect, getDocuments)
    .post(protect, authorize('admin', 'staff'), uploadMiddleware.single('file'), uploadDocument);

router.route('/:id')
    .delete(protect, authorize('admin'), deleteDocument);

module.exports = router;

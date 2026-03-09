const Student = require('../models/Student');
const { cloudinary } = require('../config/cloudinary');
const https = require('https');
const http = require('http');

// ─────────────────────────────────────────────────────────
// NOTES
// ─────────────────────────────────────────────────────────

// @desc    Add Note to Student
// @route   POST /api/students/:id/notes
// @access  Private
const addNote = async (req, res) => {
    try {
        const student = await Student.findById(req.params.id);
        if (!student) return res.status(404).json({ success: false, message: 'Student not found' });

        const { text, date } = req.body;
        if (!text || !date) return res.status(400).json({ success: false, message: 'Please provide text and date' });

        student.notes.unshift({ text, date }); // Add to beginning
        await student.save();

        res.status(201).json({ success: true, data: student.notes });
    } catch (error) {
        console.error(error);
        res.status(500).json({ success: false, message: 'Server Error' });
    }
};

// @desc    Delete Note from Student
// @route   DELETE /api/students/:id/notes/:noteId
// @access  Private
const deleteNote = async (req, res) => {
    try {
        const student = await Student.findById(req.params.id);
        if (!student) return res.status(404).json({ success: false, message: 'Student not found' });

        student.notes = student.notes.filter(note => note._id.toString() !== req.params.noteId);
        await student.save();

        res.status(200).json({ success: true, data: student.notes });
    } catch (error) {
        console.error(error);
        res.status(500).json({ success: false, message: 'Server Error' });
    }
};

// ─────────────────────────────────────────────────────────
// ATTENDANCE
// ─────────────────────────────────────────────────────────

// @desc    Add Attendance to Student
// @route   POST /api/students/:id/attendance
// @access  Private
const addAttendance = async (req, res) => {
    try {
        const student = await Student.findById(req.params.id);
        if (!student) return res.status(404).json({ success: false, message: 'Student not found' });

        const { workshopName, pointsEarned, date } = req.body;
        if (!workshopName || pointsEarned === undefined || !date) {
            return res.status(400).json({ success: false, message: 'Please provide workshopName, pointsEarned, and date' });
        }

        student.attendance.unshift({ workshopName, pointsEarned, date });
        student.points += Number(pointsEarned); // Increment overall points
        await student.save();

        res.status(201).json({ success: true, data: student }); // Return whole student to update points on UI
    } catch (error) {
        console.error(error);
        res.status(500).json({ success: false, message: 'Server Error' });
    }
};

// @desc    Delete Attendance from Student
// @route   DELETE /api/students/:id/attendance/:attId
// @access  Private/Admin
const deleteAttendance = async (req, res) => {
    try {
        const student = await Student.findById(req.params.id);
        if (!student) return res.status(404).json({ success: false, message: 'Student not found' });

        const attIndex = student.attendance.findIndex(att => att._id.toString() === req.params.attId);
        if (attIndex === -1) return res.status(404).json({ success: false, message: 'Attendance record not found' });

        // Deduct points
        student.points -= student.attendance[attIndex].pointsEarned;

        // Remove record
        student.attendance.splice(attIndex, 1);
        await student.save();

        res.status(200).json({ success: true, data: student });
    } catch (error) {
        console.error(error);
        res.status(500).json({ success: false, message: 'Server Error' });
    }
};

// ─────────────────────────────────────────────────────────
// DOCUMENTS
// ─────────────────────────────────────────────────────────

// @desc    Upload Document for Student
// @route   POST /api/students/:id/documents
// @access  Private
const uploadDocument = async (req, res) => {
    try {
        if (!req.file) {
            return res.status(400).json({ success: false, message: 'Please upload a file' });
        }

        const student = await Student.findById(req.params.id);
        if (!student) return res.status(404).json({ success: false, message: 'Student not found' });

        // Generate size string (Cloudinary returns bytes)
        const bytes = req.file.size;
        let sizeStr = '';
        if (bytes) {
            sizeStr = bytes < 1024 * 1024
                ? `${(bytes / 1024).toFixed(0)} KB`
                : `${(bytes / (1024 * 1024)).toFixed(1)} MB`;
        } else {
            sizeStr = 'Unknown Size';
        }

        const newDoc = {
            name: req.file.originalname,
            url: req.file.path, // Cloudinary URL
            publicId: req.file.filename, // Cloudinary public_id
            size: sizeStr,
            uploadDate: new Date().toLocaleDateString('en-GB', { day: '2-digit', month: 'short', year: 'numeric' })
        };

        student.documents.unshift(newDoc);
        await student.save();

        res.status(201).json({ success: true, data: student.documents });
    } catch (error) {
        console.error(error);
        res.status(500).json({ success: false, message: 'Server Error' });
    }
};

// @desc    Delete Document from Student
// @route   DELETE /api/students/:id/documents/:docId
// @access  Private/Admin
const deleteDocument = async (req, res) => {
    try {
        const student = await Student.findById(req.params.id);
        if (!student) return res.status(404).json({ success: false, message: 'Student not found' });

        const doc = student.documents.find(d => d._id.toString() === req.params.docId);
        if (!doc) return res.status(404).json({ success: false, message: 'Document not found' });

        // Delete from Cloudinary if it has a publicId
        if (doc.publicId) {
            await cloudinary.uploader.destroy(doc.publicId);
        }

        student.documents = student.documents.filter(d => d._id.toString() !== req.params.docId);
        await student.save();

        res.status(200).json({ success: true, data: student.documents });
    } catch (error) {
        console.error(error);
        res.status(500).json({ success: false, message: 'Server Error' });
    }
};

// @desc    Download Document (proxy with correct filename)
// @route   GET /api/students/:id/documents/:docId/download
// @access  Private
const downloadDocument = async (req, res) => {
    try {
        const student = await Student.findById(req.params.id);
        if (!student) return res.status(404).json({ success: false, message: 'Student not found' });

        const doc = student.documents.find(d => d._id.toString() === req.params.docId);
        if (!doc) return res.status(404).json({ success: false, message: 'Document not found' });

        // Set headers so browser downloads with the correct filename
        res.setHeader('Content-Disposition', `attachment; filename="${doc.name}"`);
        res.setHeader('Content-Type', 'application/octet-stream');

        // Pipe the file from Cloudinary through our server to the client
        const protocol = doc.url.startsWith('https') ? https : http;
        protocol.get(doc.url, (fileStream) => {
            fileStream.pipe(res);
        }).on('error', (err) => {
            console.error('Proxy download error:', err);
            res.status(500).json({ success: false, message: 'Failed to download file' });
        });
    } catch (error) {
        console.error(error);
        res.status(500).json({ success: false, message: 'Server Error' });
    }
};

module.exports = {
    addNote,
    deleteNote,
    addAttendance,
    deleteAttendance,
    uploadDocument,
    deleteDocument,
    downloadDocument
};

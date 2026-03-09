const Student = require('../models/Student');
const { cloudinary } = require('../config/cloudinary');

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

// @desc    Add PCP Report to student
// @route   POST /api/students/:id/pcp-reports
// @access  Private
const addPcpReport = async (req, res) => {
    try {
        const student = await Student.findById(req.params.id);
        if (!student) return res.status(404).json({ success: false, message: 'Student not found' });

        student.pcpReports.push(req.body);
        await student.save();

        res.status(201).json({ success: true, data: student.pcpReports[student.pcpReports.length - 1] });
    } catch (error) {
        console.error(error);
        res.status(500).json({ success: false, message: 'Server Error' });
    }
};

// @desc    Delete PCP Report
// @route   DELETE /api/students/:studentId/pcp-reports/:reportId
// @access  Private
const deletePcpReport = async (req, res) => {
    try {
        const student = await Student.findById(req.params.studentId);
        if (!student) return res.status(404).json({ success: false, message: 'Student not found' });

        student.pcpReports = student.pcpReports.filter(r => r._id.toString() !== req.params.reportId);
        await student.save();

        res.status(200).json({ success: true, data: {} });
    } catch (error) {
        console.error(error);
        res.status(500).json({ success: false, message: 'Server Error' });
    }
};

// @desc    Get all PCP Reports (global)
// @route   GET /api/students/pcp-reports
// @access  Private
const getAllPcpReports = async (req, res) => {
    try {
        let filter = {};
        if (req.user.role === 'staff') {
            filter.assignedStaff = req.user._id;
        }

        const students = await Student.find(filter).select('name pcpReports');

        let allReports = [];
        students.forEach(student => {
            student.pcpReports.forEach(report => {
                allReports.push({
                    ...report.toObject(),
                    studentName: student.name,
                    studentMongoId: student._id
                });
            });
        });

        res.status(200).json({ success: true, data: allReports });
    } catch (error) {
        console.error(error);
        res.status(500).json({ success: false, message: 'Server Error' });
    }
};

// @desc    Get all Standard Documents (global)
// @route   GET /api/students/all-documents
// @access  Private
const getAllDocuments = async (req, res) => {
    try {
        let filter = {};
        if (req.user.role === 'staff') {
            filter.assignedStaff = req.user._id;
        }

        const students = await Student.find(filter).select('name documents');

        let allDocs = [];
        students.forEach(student => {
            student.documents.forEach(doc => {
                allDocs.push({
                    ...doc.toObject(),
                    studentName: student.name,
                    studentMongoId: student._id
                });
            });
        });

        res.status(200).json({ success: true, data: allDocs });
    } catch (error) {
        console.error(error);
        res.status(500).json({ success: false, message: 'Server Error' });
    }
};

// @desc    Get All Attendance Records (Global)
// @route   GET /api/students/attendance
// @access  Private
const getAllAttendance = async (req, res) => {
    try {
        let filter = {};
        if (req.user.role === 'staff') {
            filter = { assignedStaff: req.user._id };
        }

        const students = await Student.find(filter).select('name studentId attendance');

        // Flatten attendance records and add student name/ID to each
        const allRecords = [];
        students.forEach(student => {
            student.attendance.forEach(record => {
                allRecords.push({
                    _id: record._id,
                    studentMongoId: student._id,
                    studentId: student.studentId,
                    studentName: student.name,
                    workshop: record.workshopName,
                    date: record.date,
                    points: record.pointsEarned
                });
            });
        });

        // Sort by date descending
        allRecords.sort((a, b) => new Date(b.date) - new Date(a.date));

        res.status(200).json(allRecords);
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
    addPcpReport,
    deletePcpReport,
    getAllPcpReports,
    getAllDocuments,
    getAllAttendance
};

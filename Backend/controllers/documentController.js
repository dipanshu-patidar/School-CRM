const Document = require('../models/Document');
const Student = require('../models/Student');
const Setting = require('../models/Setting');

// Helper to evaluate completion rules based on CRM specs
const evaluateStudentCompletion = async (studentId) => {
    try {
        const student = await Student.findById(studentId);
        if (!student) return;

        // Fetch current system settings
        let settings = await Setting.findOne();
        if (!settings) {
            settings = await Setting.create({});
        }
        const threshold = settings.completionPointsThreshold;

        // Check if housing document exists
        const hasAnyHousingDoc = await Document.exists({
            studentId,
            documentType: 'Housing Verification'
        });

        if (hasAnyHousingDoc) {
            if (student.points >= threshold) {
                student.status = 'Completed';
            } else {
                student.status = 'Secondary Completion';
            }
            await student.save();
        }
    } catch (err) {
        console.error("Error evaluating completion logic: ", err);
    }
};

// @desc    Upload new document
// @route   POST /api/documents
// @access  Private
const uploadDocument = async (req, res) => {
    try {
        const { studentId, status, documentType } = req.body;

        if (!studentId || !documentType) {
            return res.status(400).json({ success: false, message: 'Student ID and Document Type are required' });
        }

        if (!req.file) {
            return res.status(400).json({ success: false, message: 'Please upload a file' });
        }

        const document = await Document.create({
            studentId,
            documentType,
            status: status || 'pending',
            fileUrl: req.file.path, // Cloudinary provides secure URL in .path
            uploadedBy: req.user._id
        });

        // Trigger business background task automatically
        await evaluateStudentCompletion(studentId);

        res.status(201).json({ success: true, data: document });
    } catch (error) {
        console.error(error);
        res.status(500).json({ success: false, message: 'Server Error' });
    }
};

// @desc    Get all documents
// @route   GET /api/documents
// @access  Private
const getDocuments = async (req, res) => {
    try {
        // Can add logic here to filter by req.query.studentId
        const filter = {};
        if (req.query.studentId) filter.studentId = req.query.studentId;

        const documents = await Document.find(filter)
            .populate('studentId', 'name studentId status points')
            .populate('uploadedBy', 'name role')
            .sort('-createdAt');

        res.status(200).json({ success: true, data: documents });
    } catch (error) {
        console.error(error);
        res.status(500).json({ success: false, message: 'Server Error' });
    }
};

const deleteDocument = async (req, res) => {
    try {
        const document = await Document.findById(req.params.id);

        if (!document) {
            return res.status(404).json({ success: false, message: 'Document not found' });
        }

        // Optional: Delete from Cloudinary if needed, but for now just from DB
        await document.deleteOne();

        res.status(200).json({ success: true, data: {} });
    } catch (error) {
        console.error(error);
        res.status(500).json({ success: false, message: 'Server Error' });
    }
};

module.exports = {
    uploadDocument,
    getDocuments,
    evaluateStudentCompletion,
    deleteDocument
};

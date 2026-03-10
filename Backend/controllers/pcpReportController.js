const PCPReport = require('../models/PCPReport');

// @desc    Create a PCP/IGP Report
// @route   POST /api/pcp-reports
// @access  Private (Admin + Staff)
const createReport = async (req, res) => {
    try {
        console.log('--- New PCP Report Submission ---');
        const {
            studentId,
            dateOfService,
            serviceDescription,
            faceToFaceIndicator,
            faceToFace,
            purpose,
            intervention,
            effectiveness,
            staffNotes,
            staffSignature,
            status
        } = req.body;

        if (!studentId || !dateOfService || !staffSignature) {
            return res.status(400).json({ success: false, message: 'Student, date of service, and staff signature are required.' });
        }

        const assessmentFile = req.file ? req.file.path : undefined;

        // Ensure status matches model enum ['draft', 'completed']
        let finalStatus = 'draft';
        if (status) {
            finalStatus = status.toLowerCase() === 'draft' ? 'draft' : 'completed';
        }

        const report = await PCPReport.create({
            studentId,
            dateOfService,
            serviceDescription: serviceDescription || 'Standard Service',
            faceToFaceIndicator: faceToFaceIndicator || faceToFace || 'Face-to-Face',
            purpose: purpose || 'Standard Purpose',
            intervention: intervention || 'Standard Intervention',
            effectiveness: effectiveness || 'Standard Effectiveness',
            staffNotes: staffNotes || '',
            staffSignature,
            assessmentFile,
            status: finalStatus,
            createdBy: req.user._id
        });

        res.status(201).json({ success: true, data: report });
    } catch (error) {
        console.error('PCP REPORT CREATION ERROR:', error);
        res.status(500).json({ success: false, message: error.message || 'Server Error' });
    }
};

// @desc    Get all PCP Reports
// @route   GET /api/pcp-reports
// @access  Private
const getReports = async (req, res) => {
    try {
        const filter = {};
        if (req.query.studentId) filter.studentId = req.query.studentId;

        // Staff filter
        if (req.user.role === 'staff') {
            const Student = require('../models/Student');
            const students = await Student.find({ assignedStaff: req.user._id }).select('_id');
            const studentIds = students.map(s => s._id);

            if (filter.studentId) {
                // If a specific student is requested, ensure it's one of their assigned students
                if (!studentIds.some(id => id.toString() === filter.studentId.toString())) {
                    return res.status(403).json({ success: false, message: 'Not authorized to view this student\'s reports' });
                }
            } else {
                filter.studentId = { $in: studentIds };
            }
        }

        const reports = await PCPReport.find(filter)
            .populate('studentId', 'name studentId status')
            .populate('createdBy', 'name role')
            .sort('-dateOfService');

        res.status(200).json({ success: true, data: reports });
    } catch (error) {
        console.error(error);
        res.status(500).json({ success: false, message: 'Server Error' });
    }
};

// @desc    Get single PCP Report
// @route   GET /api/pcp-reports/:id
// @access  Private
const getReportById = async (req, res) => {
    try {
        const report = await PCPReport.findById(req.params.id)
            .populate('studentId', 'name studentId status points')
            .populate('createdBy', 'name role');

        if (!report) {
            return res.status(404).json({ success: false, message: 'Report not found' });
        }

        res.status(200).json({ success: true, data: report });
    } catch (error) {
        console.error(error);
        res.status(500).json({ success: false, message: 'Server Error' });
    }
};

// @desc    Update PCP Report
// @route   PUT /api/pcp-reports/:id
// @access  Private (Admin + Staff)
const updateReport = async (req, res) => {
    try {
        let report = await PCPReport.findById(req.params.id);
        if (!report) return res.status(404).json({ success: false, message: 'Report not found' });

        const updateData = { ...req.body };
        // If a new file is uploaded, update the assessmentFile URL
        if (req.file) {
            updateData.assessmentFile = req.file.path;
        }

        report = await PCPReport.findByIdAndUpdate(req.params.id, updateData, {
            new: true,
            runValidators: true
        });

        res.status(200).json({ success: true, data: report });
    } catch (error) {
        console.error(error);
        res.status(500).json({ success: false, message: 'Server Error' });
    }
};

// @desc    Delete PCP Report
// @route   DELETE /api/pcp-reports/:id
// @access  Private (Admin only)
const deleteReport = async (req, res) => {
    try {
        const report = await PCPReport.findById(req.params.id);
        if (!report) return res.status(404).json({ success: false, message: 'Report not found' });

        await report.deleteOne();

        res.status(200).json({ success: true, data: {} });
    } catch (error) {
        console.error(error);
        res.status(500).json({ success: false, message: 'Server Error' });
    }
};

module.exports = {
    createReport,
    getReports,
    getReportById,
    updateReport,
    deleteReport
};

const Student = require('../models/Student');

// @desc    Get all students
// @route   GET /api/students
// @access  Private
const getAllStudents = async (req, res) => {
    try {
        const isStaff = req.user.role === 'staff';
        const filter = isStaff ? { assignedStaff: req.user.name } : {};

        const students = await Student.find(filter).sort({ createdAt: -1 });

        res.status(200).json({
            success: true,
            count: students.length,
            data: students
        });
    } catch (error) {
        console.error(error);
        res.status(500).json({ success: false, message: 'Server Error' });
    }
};

// @desc    Get single student
// @route   GET /api/students/:id
// @access  Private
const getStudent = async (req, res) => {
    try {
        const student = await Student.findById(req.params.id);

        if (!student) {
            return res.status(404).json({ success: false, message: 'Student not found' });
        }

        res.status(200).json({ success: true, data: student });
    } catch (error) {
        console.error(error);
        res.status(500).json({ success: false, message: 'Server Error' });
    }
};

// @desc    Create new student
// @route   POST /api/students
// @access  Private (Admin only or restricted staff)
const createStudent = async (req, res) => {
    try {
        // If staff creates, auto-assign to them
        if (req.user.role === 'staff') {
            req.body.assignedStaff = req.user.name;
        }

        const student = await Student.create(req.body);

        res.status(201).json({ success: true, data: student });
    } catch (error) {
        console.error(error);
        if (error.code === 11000) {
            return res.status(400).json({ success: false, message: 'Student ID or Email already exists' });
        }
        res.status(500).json({ success: false, message: 'Server Error' });
    }
};

// @desc    Update student
// @route   PUT /api/students/:id
// @access  Private
const updateStudent = async (req, res) => {
    try {
        let student = await Student.findById(req.params.id);

        if (!student) {
            return res.status(404).json({ success: false, message: 'Student not found' });
        }

        // Make sure user is student owner or admin
        if (req.user.role === 'staff' && student.assignedStaff !== req.user.name) {
            return res.status(401).json({ success: false, message: 'Not authorized to update this student' });
        }

        student = await Student.findByIdAndUpdate(req.params.id, req.body, {
            new: true,
            runValidators: true
        });

        res.status(200).json({ success: true, data: student });
    } catch (error) {
        console.error(error);
        res.status(500).json({ success: false, message: 'Server Error' });
    }
};

// @desc    Delete student
// @route   DELETE /api/students/:id
// @access  Private
const deleteStudent = async (req, res) => {
    try {
        const student = await Student.findById(req.params.id);

        if (!student) {
            return res.status(404).json({ success: false, message: 'Student not found' });
        }

        // Make sure user is student owner or admin
        if (req.user.role === 'staff' && student.assignedStaff !== req.user.name) {
            return res.status(401).json({ success: false, message: 'Not authorized to delete this student' });
        }

        await student.deleteOne();

        res.status(200).json({ success: true, data: {} });
    } catch (error) {
        console.error(error);
        res.status(500).json({ success: false, message: 'Server Error' });
    }
};

module.exports = {
    getAllStudents,
    getStudent,
    createStudent,
    updateStudent,
    deleteStudent
};

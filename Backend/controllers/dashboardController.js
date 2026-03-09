const Student = require('../models/Student');
const Workshop = require('../models/Workshop');
const User = require('../models/User');

// @desc    Get dashboard statistics
// @route   GET /api/dashboard/stats
// @access  Private
const getDashboardStats = async (req, res) => {
    try {
        const isStaff = req.user.role === 'staff';
        const filter = isStaff ? { assignedStaff: req.user._id } : {};

        const totalStudents = await Student.countDocuments(filter);
        const activeStudents = await Student.countDocuments({ ...filter, status: 'Active' });
        const completedStudents = await Student.countDocuments({ ...filter, status: 'Completed' });
        const totalWorkshops = await Workshop.countDocuments();

        // Fetch 5 most recent students
        const recentStudents = await Student.find(filter)
            .sort({ createdAt: -1 })
            .limit(5);

        // Mock activities (Attendance model not implemented yet)
        const recentActivities = [
            { id: 1, name: 'John Doe', workshop: 'Financial Literacy', points: '+1', date: 'Today' },
            { id: 2, name: 'Sara Smith', workshop: 'Emotional Support', points: '+1', date: 'Yesterday' },
            { id: 3, name: 'Mike Johnson', workshop: 'Career Development', points: '+1', date: 'Today' },
        ];

        // Calculate attendance rate (mocking)
        const attendanceRate = 94.8;

        // Calculate completion rate
        const completionRate = totalStudents > 0
            ? ((completedStudents / totalStudents) * 100).toFixed(1)
            : 0;

        res.status(200).json({
            success: true,
            data: {
                totalStudents,
                activeStudents,
                completedStudents,
                totalWorkshops,
                attendanceRate,
                completionRate,
                recentStudents,
                recentActivities
            }
        });
    } catch (error) {
        console.error(error);
        res.status(500).json({ success: false, message: 'Server Error' });
    }
};

module.exports = {
    getDashboardStats
};

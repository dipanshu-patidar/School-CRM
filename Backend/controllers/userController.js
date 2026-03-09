const User = require('../models/User');

// @desc    Get all staff
// @route   GET /api/users/staff
// @access  Private
const getStaff = async (req, res) => {
    try {
        const staff = await User.find({ role: 'staff' }).select('-password');
        res.status(200).json({ success: true, data: staff });
    } catch (error) {
        console.error(error);
        res.status(500).json({ success: false, message: 'Server Error' });
    }
};

module.exports = {
    getStaff
};

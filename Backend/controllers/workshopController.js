const Workshop = require('../models/Workshop');

// @desc    Get all workshops
// @route   GET /api/workshops
// @access  Private
const getWorkshops = async (req, res) => {
    try {
        const workshops = await Workshop.find().sort({ createdAt: -1 });
        res.status(200).json(workshops);
    } catch (error) {
        console.error(error);
        res.status(500).json({ success: false, message: 'Server Error' });
    }
};

// @desc    Create workshop
// @route   POST /api/workshops
// @access  Private/Admin
const createWorkshop = async (req, res) => {
    try {
        const { name, description, points } = req.body;

        const workshop = await Workshop.create({
            name,
            description,
            points: points || 1
        });

        res.status(201).json({ success: true, data: workshop });
    } catch (error) {
        console.error(error);
        if (error.code === 11000) {
            return res.status(400).json({ success: false, message: 'Workshop name already exists' });
        }
        res.status(500).json({ success: false, message: 'Server Error' });
    }
};

// @desc    Update workshop
// @route   PUT /api/workshops/:id
// @access  Private/Admin
const updateWorkshop = async (req, res) => {
    try {
        let workshop = await Workshop.findById(req.params.id);
        if (!workshop) return res.status(404).json({ success: false, message: 'Workshop not found' });

        workshop = await Workshop.findByIdAndUpdate(req.params.id, req.body, {
            new: true,
            runValidators: true
        });

        res.status(200).json({ success: true, data: workshop });
    } catch (error) {
        console.error(error);
        res.status(500).json({ success: false, message: 'Server Error' });
    }
};

// @desc    Delete workshop
// @route   DELETE /api/workshops/:id
// @access  Private/Admin
const deleteWorkshop = async (req, res) => {
    try {
        const workshop = await Workshop.findById(req.params.id);
        if (!workshop) return res.status(404).json({ success: false, message: 'Workshop not found' });

        await workshop.deleteOne();

        res.status(200).json({ success: true, data: {} });
    } catch (error) {
        console.error(error);
        res.status(500).json({ success: false, message: 'Server Error' });
    }
};

module.exports = {
    getWorkshops,
    createWorkshop,
    updateWorkshop,
    deleteWorkshop
};

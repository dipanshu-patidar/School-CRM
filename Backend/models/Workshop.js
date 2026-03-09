const mongoose = require('mongoose');

const workshopSchema = new mongoose.Schema(
    {
        name: {
            type: String,
            required: [true, 'Please add a workshop name'],
            unique: true,
        },
        description: {
            type: String,
        },
        points: {
            type: Number,
            default: 1,
        },
    },
    {
        timestamps: true,
    }
);

module.exports = mongoose.model('Workshop', workshopSchema);

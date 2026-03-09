const mongoose = require('mongoose');

const studentSchema = new mongoose.Schema(
    {
        name: {
            type: String,
            required: [true, 'Please add a student name'],
        },
        studentId: {
            type: String,
            required: [true, 'Please add a student ID'],
            unique: true,
        },
        email: {
            type: String,
            required: [true, 'Please add an email'],
            unique: true,
        },
        phone: {
            type: String,
        },
        status: {
            type: String,
            enum: ['Active', 'Completed', 'Inactive'],
            default: 'Active',
        },
        points: {
            type: Number,
            default: 0,
        },
        totalPoints: {
            type: Number,
            default: 250,
        },
        assignedStaff: {
            type: String,
        },
        enrolledDate: {
            type: Date,
            default: Date.now,
        },
    },
    {
        timestamps: true,
    }
);

module.exports = mongoose.model('Student', studentSchema);

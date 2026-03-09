const Attendance = require('../models/Attendance');
const Student = require('../models/Student');

// @desc    Create attendance record
// @route   POST /api/attendance
// @access  Private/Admin
const createAttendance = async (req, res) => {
    const { studentMongoId, workshopName, date, pointsEarned } = req.body;

    if (!studentMongoId || !workshopName || !date) {
        return res.status(400).json({ success: false, message: 'Please provide student, workshop, and date' });
    }

    try {
        const attendanceDate = new Date(date);

        // 1. Check for duplicates
        const existingRecord = await Attendance.findOne({
            studentId: studentMongoId,
            workshopId: workshopName,
            date: attendanceDate
        });

        if (existingRecord) {
            return res.status(400).json({
                success: false,
                message: 'Student already has attendance recorded for this workshop on this date'
            });
        }

        // 2. Get student
        const student = await Student.findById(studentMongoId);
        if (!student) {
            return res.status(404).json({ success: false, message: 'Student not found' });
        }

        // 3. Create record
        const points = pointsEarned || 1; // Enforce rule: +1 point per workshop
        const attendance = await Attendance.create({
            studentId: studentMongoId,
            workshopId: workshopName,
            date: attendanceDate,
            pointsAwarded: points,
            createdBy: req.user._id
        });

        // 4. Assign +1 point and save student
        student.points += points;

        // Ensure student schema logic adds it properly without duplicating arrays if they existed previously inside students list.
        // We will push a generic object into student's deprecated attendance array to keep backwards compatibility if UI uses it.
        student.attendance.push({
            workshopName,
            pointsEarned: points,
            date: date
        });

        await student.save();

        res.status(201).json({ success: true, data: attendance });
    } catch (error) {
        console.error(error);
        if (error.code === 11000) {
            return res.status(400).json({ success: false, message: 'Duplicate attendance record found' });
        }
        res.status(500).json({ success: false, message: 'Server Error' });
    }
};

// @desc    Get all attendance
// @route   GET /api/attendance
// @access  Private
const getAllAttendance = async (req, res) => {
    try {
        const records = await Attendance.find()
            .populate('studentId', 'name studentId points status')
            .sort('-date'); // newest first

        // Map to format frontend expects
        const formattedRecords = records.map(record => ({
            _id: record._id,
            studentMongoId: record.studentId ? record.studentId._id : null,
            studentId: record.studentId ? record.studentId.studentId : 'Unknown',
            studentName: record.studentId ? record.studentId.name : 'Deleted Student',
            studentPoints: record.studentId ? record.studentId.points : 0,
            studentStatus: record.studentId ? record.studentId.status : 'N/A',
            workshop: record.workshopId,
            date: record.date.toISOString().split('T')[0], // Extract YYYY-MM-DD
            points: record.pointsAwarded,
            createdBy: record.createdBy // Raw ID for now since we don't need populating admin user for this view usually
        }));

        res.status(200).json(formattedRecords);
    } catch (error) {
        console.error(error);
        res.status(500).json({ success: false, message: 'Server Error' });
    }
};

// @desc    Delete attendance record
// @route   DELETE /api/attendance/:id
// @access  Private/Admin
const deleteAttendance = async (req, res) => {
    try {
        const attendance = await Attendance.findById(req.params.id);

        if (!attendance) {
            return res.status(404).json({ success: false, message: 'Attendance record not found' });
        }

        // 1. Decrease points from student
        const student = await Student.findById(attendance.studentId);

        if (student) {
            student.points = Math.max(0, student.points - attendance.pointsAwarded); // Prevent negative

            // Remove from legacy array if matching approx
            const dateStr = new Date(attendance.date).toISOString().split('T')[0];
            student.attendance = student.attendance.filter(a =>
                !(a.workshopName === attendance.workshopId && a.date.includes(dateStr))
            );

            await student.save();
        }

        // 2. Delete record
        await attendance.deleteOne();

        res.status(200).json({ success: true, message: 'Attendance record removed' });
    } catch (error) {
        console.error(error);
        res.status(500).json({ success: false, message: 'Server Error' });
    }
};

module.exports = {
    createAttendance,
    getAllAttendance,
    deleteAttendance
};

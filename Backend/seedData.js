const mongoose = require('mongoose');
const dotenv = require('dotenv');
const Student = require('./models/Student');
const Workshop = require('./models/Workshop');

dotenv.config();

const seedData = async () => {
    try {
        await mongoose.connect(process.env.MONGO_URI);
        console.log('MongoDB Connected for seeding');

        // Clear existing data (optional)
        // await Student.deleteMany();
        // await Workshop.deleteMany();

        // Seed Workshops
        const workshops = [
            { name: 'Financial Literacy', description: 'Basic money management.', points: 1 },
            { name: 'Social Wellness', description: 'Building better relationships.', points: 1 },
            { name: 'Emotional Support', description: 'Mental health and support.', points: 1 },
            { name: 'Career Development', description: 'Resume building and interview tips.', points: 1 },
        ];

        for (const w of workshops) {
            let existing = await Workshop.findOne({ name: w.name });
            if (!existing) {
                await Workshop.create(w);
                console.log(`Workshop created: ${w.name}`);
            }
        }

        // Seed Students
        const students = [
            { studentId: 'S101', name: 'John Doe', email: 'john@example.com', status: 'Active', points: 120, assignedStaff: 'System Staff' },
            { studentId: 'S102', name: 'Sara Smith', email: 'sara@example.com', status: 'Completed', points: 250, assignedStaff: 'System Staff' },
            { studentId: 'S103', name: 'Mike Brown', email: 'mike@example.com', status: 'Active', points: 60, assignedStaff: 'System Staff' },
            { studentId: 'S104', name: 'Emily White', email: 'emily@example.com', status: 'Active', points: 180, assignedStaff: 'System Staff' },
            { studentId: 'S105', name: 'David Black', email: 'david@example.com', status: 'Completed', points: 300, assignedStaff: 'System Staff' },
        ];

        for (const s of students) {
            let existing = await Student.findOne({ email: s.email });
            if (!existing) {
                await Student.create(s);
                console.log(`Student created: ${s.name}`);
            }
        }

        console.log('Sample data successfully seeded!');
        process.exit();
    } catch (error) {
        console.error(`Error: ${error.message}`);
        process.exit(1);
    }
};

seedData();

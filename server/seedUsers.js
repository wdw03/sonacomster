require('dotenv').config();
const mongoose = require('mongoose');
const User = require('./models/User');
const connectDB = require('./config/db');

const seedData = async () => {
    try {
        await connectDB();

        // Remove all existing users
        await User.deleteMany({});
        console.log('Cleared existing users');

        // Insert Admin
        await User.create({
            employeeId: 'admin',
            password: 'admin',
            name: 'Administrator',
            role: 'Admin',
            department: 'Administration',
            avatar: 'AD',
            email: 'admin@sonacomstar.com'
        });
        
        // Insert User
        await User.create({
            employeeId: 'user',
            password: 'user',
            name: 'Employee User',
            role: 'User',
            department: 'Quality Assurance',
            avatar: 'US',
            email: 'user@sonacomstar.com'
        });

        console.log('Successfully seeded admin and user accounts');
        process.exit();
    } catch (error) {
        console.error('Error with seed data:', error);
        process.exit(1);
    }
};

seedData();

const mongoose = require('mongoose');
const dotenv = require('dotenv');
const User = require('./models/User');
const Report = require('./models/Report');
const Vendor = require('./models/Vendor');
const connectDB = require('./config/db');

dotenv.config();

connectDB();

const importData = async () => {
    try {
        await User.deleteMany();
        await Report.deleteMany();
        await Vendor.deleteMany();

        const createdUser = await User.create({
            employeeId: 'savanop',
            password: 'savanop',
            name: 'Savanop',
            role: 'Admin',
            department: 'Administration',
            avatar: 'SV',
            email: 'savanop@example.com'
        });
        
        await User.create({
            employeeId: 'EMP-90210',
            password: 'user_password',
            name: 'Amit Sharma',
            role: 'Quality Manager',
            department: 'Quality Assurance',
            avatar: 'AS',
            email: 'amit.sharma@sonacomstar.com'
        });

        const vendors = await Vendor.insertMany([
            { name: 'ABC Ltd', issues: 45, resolved: 38 },
            { name: 'Tata Steel', issues: 32, resolved: 28 },
            { name: 'SKF India', issues: 28, resolved: 25 },
            { name: 'Bosch Ltd', issues: 21, resolved: 18 }
        ]);

        const sampleReports = [
            {
                id: 'RPT-2024-001',
                item: 'Gear Assembly',
                vendor: 'ABC Ltd',
                date: new Date().toISOString().split('T')[0],
                status: 'pending',
                qty: 10,
                priority: 'high',
                department: 'Production',
                defectType: 'Dimension Error',
                description: 'Gear teeth dimensions not meeting specifications. Deviation of 0.5mm from required measurements.',
                submittedBy: createdUser.name,
                submittedDate: new Date().toLocaleString(),
            },
            {
                id: 'RPT-2024-002',
                item: 'Bearing Set',
                vendor: 'Tata Steel',
                date: new Date(Date.now() - 86400000).toISOString().split('T')[0],
                status: 'approved',
                qty: 5,
                priority: 'medium',
                department: 'Quality Assurance',
                defectType: 'Hardness Issue',
                description: 'Bearing hardness below specification. Required 60 HRC, measured 55 HRC.',
                submittedBy: createdUser.name,
                submittedDate: new Date(Date.now() - 86400000).toLocaleString(),
            }
        ];

        await Report.insertMany(sampleReports);

        console.log('Data Imported!');
        process.exit();
    } catch (error) {
        console.error(`${error}`);
        process.exit(1);
    }
};

importData();

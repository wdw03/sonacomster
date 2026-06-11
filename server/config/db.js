const mongoose = require('mongoose');
const dns = require('dns');

// Fix Node.js DNS resolution issues on Windows for SRV records
dns.setServers(['8.8.8.8', '8.8.4.4']);

const connectDB = async () => {
    try {
        const conn = await mongoose.connect(process.env.MONGO_URI, {
            family: 4
        });
        console.log(`MongoDB Connected: ${conn.connection.host}`);
    } catch (error) {
        console.error(`MongoDB Connection Error: ${error.message}`);
        console.warn('Backend is running, but database connection failed. Check your MongoDB URI.');
    }
};

module.exports = connectDB;

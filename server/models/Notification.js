const mongoose = require('mongoose');

const notificationSchema = new mongoose.Schema({
    userId: { type: String }, // optional, if targeting a specific user
    role: { type: String }, // optional, if targeting a specific role e.g. "Admin"
    title: { type: String, required: true },
    message: { type: String, required: true },
    type: { type: String, enum: ['info', 'warning', 'success', 'error'], default: 'info' },
    isRead: { type: Boolean, default: false },
    link: { type: String } // optional link, e.g. to the specific report ID
}, { timestamps: true });

module.exports = mongoose.model('Notification', notificationSchema);

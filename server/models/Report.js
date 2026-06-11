const mongoose = require('mongoose');

const reportSchema = new mongoose.Schema({
    id: { type: String, required: true, unique: true }, // e.g. RPT-2024-001
    item: { type: String, required: true },
    vendor: { type: String, required: true },
    date: { type: String, required: true },
    status: { type: String, enum: ['pending', 'approved', 'rejected'], default: 'pending' },
    qty: { type: Number, required: true },
    priority: { type: String, enum: ['low', 'medium', 'high', 'critical'], required: true },
    department: { type: String, required: true },
    defectType: { type: String, required: true },
    description: { type: String, required: true },
    images: [{ type: String }],
    submittedBy: { type: String, required: true },
    submitterEmail: { type: String },
    submittedDate: { type: String, required: true },
    reviewedBy: { type: String },
    reviewDate: { type: String },
    rejectionReason: { type: String },
    adminRemarks: { type: String },
    capaAction: { type: String },
    adminImages: [{ type: String }],
    kanbanStage: { type: String, enum: ['Pending', 'Under Investigation', 'CAPA Assigned', 'Resolved'], default: 'Pending' },
    comments: [{
        user: { type: String },
        role: { type: String },
        text: { type: String },
        createdAt: { type: Date, default: Date.now }
    }],
    aiAnalysis: {
        rootCause: { type: String },
        recommendation: { type: String }
    }
}, { timestamps: true });

module.exports = mongoose.model('Report', reportSchema);

const Report = require('../models/Report');
const Notification = require('../models/Notification');

const getReports = async (req, res) => {
    try {
        const { status, search } = req.query;
        let query = {};
        
        if (status && status !== 'all') {
            query.status = status;
        }
        
        if (search) {
            query.$or = [
                { id: { $regex: search, $options: 'i' } },
                { item: { $regex: search, $options: 'i' } },
                { vendor: { $regex: search, $options: 'i' } },
                { defectType: { $regex: search, $options: 'i' } }
            ];
        }

        const reports = await Report.find(query).sort({ createdAt: -1 });
        res.json(reports);
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
};

const createReport = async (req, res) => {
    try {
        const { date, department, vendor, itemCode, quantity, priority, defectType, description, images } = req.body;
        
        const year = new Date().getFullYear();
        const lastReport = await Report.findOne({ id: { $regex: `^RPT-${year}-` } }).sort({ id: -1 });
        let nextNumber = 1;
        if (lastReport) {
            const parts = lastReport.id.split('-');
            const lastNumber = parseInt(parts[2], 10);
            if (!isNaN(lastNumber)) {
                nextNumber = lastNumber + 1;
            }
        }
        const id = `RPT-${year}-${String(nextNumber).padStart(3, '0')}`;

        const report = new Report({
            id,
            item: itemCode,
            vendor,
            date,
            qty: quantity,
            priority,
            department,
            defectType,
            description,
            images,
            submittedBy: req.user.name,
            submitterEmail: req.user.email,
            submittedDate: new Date().toLocaleString(),
            status: 'pending'
        });

        const createdReport = await report.save();

        if (priority === 'critical' || priority === 'high') {
            await Notification.create({
                title: 'High Priority Defect Submitted',
                message: `Report ${id} (${itemCode}) was submitted by ${req.user.name} with ${priority} priority.`,
                type: 'warning',
                link: id
            });
        }

        res.status(201).json(createdReport);
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
};

const deleteReport = async (req, res) => {
    try {
        const report = await Report.findOne({ id: req.params.id });
        if (report) {
            await Report.deleteOne({ id: req.params.id });
            res.json({ message: 'Report removed' });
        } else {
            res.status(404).json({ message: 'Report not found' });
        }
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
};

const updateReportStatus = async (req, res) => {
    try {
        const { status, rejectionReason, capaAction, adminRemarks, adminImages } = req.body;
        const report = await Report.findOne({ id: req.params.id });
        
        if (report) {
            report.status = status;
            report.reviewedBy = req.user.name;
            report.reviewDate = new Date().toLocaleString();
            if (rejectionReason) report.rejectionReason = rejectionReason;
            if (capaAction) report.capaAction = capaAction;
            if (adminRemarks) report.adminRemarks = adminRemarks;
            if (adminImages) report.adminImages = adminImages;

            const updatedReport = await report.save();

            // Notify user
            await Notification.create({
                userId: report.submitterEmail,
                title: `Report ${status}`,
                message: `Your report ${report.id} has been ${status} by ${req.user.name}.`,
                type: status === 'approved' ? 'success' : 'error',
                link: report.id
            });

            res.json(updatedReport);
        } else {
            res.status(404).json({ message: 'Report not found' });
        }
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
};

const updateKanbanStage = async (req, res) => {
    try {
        const { kanbanStage } = req.body;
        const report = await Report.findOne({ id: req.params.id });
        
        if (report) {
            report.kanbanStage = kanbanStage;
            const updatedReport = await report.save();
            res.json(updatedReport);
        } else {
            res.status(404).json({ message: 'Report not found' });
        }
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
};

const addComment = async (req, res) => {
    try {
        const { text } = req.body;
        const report = await Report.findOne({ id: req.params.id });
        
        if (report) {
            const comment = {
                user: req.user.name,
                role: req.user.role,
                text
            };
            report.comments.push(comment);
            const updatedReport = await report.save();

            // Notify submitter if admin comments, or vice versa
            await Notification.create({
                title: `New Comment on ${report.id}`,
                message: `${req.user.name} commented: "${text.substring(0, 30)}..."`,
                type: 'info',
                link: report.id
            });

            res.json(updatedReport);
        } else {
            res.status(404).json({ message: 'Report not found' });
        }
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
};

const getReportStats = async (req, res) => {
    try {
        const total = await Report.countDocuments();
        const pending = await Report.countDocuments({ status: 'pending' });
        const approved = await Report.countDocuments({ status: 'approved' });
        const rejected = await Report.countDocuments({ status: 'rejected' });

        // Department breakdown
        const deptBreakdown = await Report.aggregate([
            { $group: { _id: '$department', count: { $sum: 1 } } },
            { $sort: { count: -1 } }
        ]);

        // Vendor breakdown
        const vendorBreakdown = await Report.aggregate([
            { $group: { _id: '$vendor', count: { $sum: 1 }, pending: { $sum: { $cond: [{ $eq: ['$status', 'pending'] }, 1, 0] } } } },
            { $sort: { count: -1 } }
        ]);

        // Priority breakdown
        const priorityBreakdown = await Report.aggregate([
            { $group: { _id: '$priority', count: { $sum: 1 } } }
        ]);

        // Overdue (pending > 48 hours)
        const twoDaysAgo = new Date(Date.now() - 48 * 60 * 60 * 1000);
        const overdue = await Report.countDocuments({ status: 'pending', createdAt: { $lt: twoDaysAgo } });

        res.json({ total, pending, approved, rejected, overdue, deptBreakdown, vendorBreakdown, priorityBreakdown });
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
};

const getActivity = async (req, res) => {
    try {
        const notifications = await Notification.find({}).sort({ createdAt: -1 }).limit(20);
        res.json(notifications);
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
};

module.exports = { getReports, createReport, deleteReport, updateReportStatus, updateKanbanStage, addComment, getReportStats, getActivity };

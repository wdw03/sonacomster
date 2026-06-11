const Report = require('../models/Report');
const Vendor = require('../models/Vendor');

const getStats = async (req, res) => {
    try {
        const totalReports = await Report.countDocuments();
        const pending = await Report.countDocuments({ status: 'pending' });
        const approved = await Report.countDocuments({ status: 'approved' });
        const rejected = await Report.countDocuments({ status: 'rejected' });
        res.json({ totalReports, pending, approved, rejected });
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
};

const getRecentReports = async (req, res) => {
    try {
        const reports = await Report.find().sort({ createdAt: -1 }).limit(5);
        res.json(reports);
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
};

const getTopVendors = async (req, res) => {
    try {
        const vendors = await Vendor.find().sort({ issues: -1 }).limit(4);
        const vendorsData = vendors.map(v => ({
            name: v.name,
            issues: v.issues,
            resolved: v.resolved,
            trend: (v.resolved / v.issues) > 0.8 ? 'up' : 'down'
        }));
        res.json(vendorsData);
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
};

const getDefectDistribution = async (req, res) => {
    try {
        const distribution = await Report.aggregate([
            { $group: { _id: "$defectType", count: { $sum: 1 } } },
            { $sort: { count: -1 } }
        ]);
        
        const total = distribution.reduce((acc, curr) => acc + curr.count, 0);
        const defectTypes = distribution.map(d => ({
            type: d._id,
            count: d.count,
            percentage: total > 0 ? Math.round((d.count / total) * 100) : 0
        }));

        res.json(defectTypes);
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
};

module.exports = { getStats, getRecentReports, getTopVendors, getDefectDistribution };

const Vendor = require('../models/Vendor');

const getVendors = async (req, res) => {
    try {
        const vendors = await Vendor.find({});
        res.json(vendors);
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
};

const createVendor = async (req, res) => {
    try {
        const { name } = req.body;
        const vendor = await Vendor.create({ name, issues: 0, resolved: 0 });
        res.status(201).json(vendor);
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
};

const updateVendor = async (req, res) => {
    try {
        const { name } = req.body;
        const vendor = await Vendor.findById(req.params.id);
        if (vendor) {
            vendor.name = name;
            await vendor.save();
            res.json(vendor);
        } else {
            res.status(404).json({ message: 'Vendor not found' });
        }
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
};

module.exports = { getVendors, createVendor, updateVendor };

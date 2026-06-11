const User = require('../models/User');
const bcrypt = require('bcryptjs');

const getUsers = async (req, res) => {
    try {
        const users = await User.find({}).select('-password');
        res.json(users);
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
};

const createUser = async (req, res) => {
    try {
        const { employeeId, name, role, department, avatar, email, password } = req.body;
        const userExists = await User.findOne({ employeeId });
        
        if (userExists) {
            return res.status(400).json({ message: 'User already exists' });
        }

        const user = await User.create({
            employeeId, name, role, department, avatar, email, password
        });

        res.status(201).json({ message: 'User created', userId: user._id });
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
};

const updateUserStatus = async (req, res) => {
    try {
        const { isActive, role } = req.body;
        const user = await User.findById(req.params.id);
        if (user) {
            if (isActive !== undefined) user.isActive = isActive;
            if (role) user.role = role;
            await user.save();
            res.json({ message: 'User updated' });
        } else {
            res.status(404).json({ message: 'User not found' });
        }
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
};

module.exports = { getUsers, createUser, updateUserStatus };

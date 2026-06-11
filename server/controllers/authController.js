const User = require('../models/User');
const generateToken = require('../utils/generateToken');

const authUser = async (req, res) => {
    const { employeeId, password, username } = req.body;
    
    // Use employeeId or username
    const loginId = employeeId || username;

    try {
        let user = await User.findOne({ employeeId: loginId });

        // Auto-create is now handled by the seed script.

        if (user && (await user.matchPassword(password))) {
            res.json({
                _id: user._id,
                employeeId: user.employeeId,
                name: user.name,
                role: user.role,
                department: user.department,
                avatar: user.avatar,
                email: user.email,
                profileImage: user.profileImage,
                token: generateToken(user._id),
            });
        } else {
            res.status(401).json({ message: 'Invalid employee ID or password' });
        }
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
};

const updateProfile = async (req, res) => {
    try {
        const user = await User.findById(req.user._id);
        if (user) {
            user.name = req.body.name || user.name;
            user.role = req.body.role || user.role;
            user.department = req.body.department || user.department;
            user.avatar = req.body.avatar || user.avatar;
            if (req.body.profileImage) {
                user.profileImage = req.body.profileImage;
            }

            const updatedUser = await user.save();
            res.json({
                _id: updatedUser._id,
                employeeId: updatedUser.employeeId,
                name: updatedUser.name,
                role: updatedUser.role,
                department: updatedUser.department,
                avatar: updatedUser.avatar,
                email: updatedUser.email,
                profileImage: updatedUser.profileImage,
                token: generateToken(updatedUser._id),
            });
        } else {
            res.status(404).json({ message: 'User not found' });
        }
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
};

module.exports = { authUser, updateProfile };

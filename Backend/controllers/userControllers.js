// require user model
const userModel = require('../models/user');
const personalModel = require('../models/personal');
const certifModel = require('../models/certifications');
const educationModel = require('../models/education');
const experienceModel = require('../models/experience');

// require token
const jwt = require('jsonwebtoken');

const createToken = (_id, role) => {
    return jwt.sign({ _id, role }, process.env.SECRET, { expiresIn: '3d' });
}

const signupUser = async (req, res) => {
    const { email, password, role = 'user'} = req.body; // Add role to destructuring (will use default if not provided)
    try{
        
        const user = await userModel.signup(email, password, role); 

        const token = createToken(user._id, user.role);

        res.status(201).json({
            _id: user._id,
            email: user.email,
            role: user.role, // Now includes the role from the database
            token: token
        });
    } catch (error) {
        // Better error status codes
        const status = error.message.includes('already in use') ? 409 : 
                      error.message.includes('valid') ? 400 : 500;
        res.status(status).json({ message: error.message });
    }
}

const loginUser = async (req, res) => {
    const { email, password } = req.body;

    try {
        const user = await userModel.login(email, password);

        const token = createToken(user._id, user.role);

        res.status(200).json({
            _id: user._id,
            email: user.email,
            role: user.role,
            token: token
        });
         
    } catch (error) {
        // Specific status codes for auth errors
        const status = error.message.includes('Incorrect') ? 401 : 500;
        res.status(status).json({ message: error.message });
    }
}

const updateUser = async (req, res) => {

    const userId = req.params.userId;
    const { email, currentPassword, newPassword } = req.body;

    try {

        const updatedUser = await userModel.updateUser(userId, email, currentPassword, newPassword);

        const token = createToken(updatedUser._id, updatedUser.role);

        res.status(200).json({
            success: true,
            message: "Account updated successfully",
            email: updatedUser.email,
            role: updatedUser.role,
            token: token
        });

    } catch (error) {
        console.error("Account update error:", error);
        
        // Better error status codes
        const status = error.message.includes('Unauthorized') ? 403 : 
                     error.message.includes('not found') ? 404 :
                     error.message.includes('password') || error.message.includes('Email') ? 400 : 500;
        
        res.status(status).json({
            success: false,
            message: error.message || "Failed to update account"
        });
    }
}

const deleteUser = async (req, res) => {
    try {
        const userId = req.params.userId;

        // Delete all user data across collections
        await Promise.all([
            userModel.findByIdAndDelete(userId),
            personalModel.deleteOne({ userId }),
            certifModel.deleteOne({ userId }),
            educationModel.deleteOne({ userId }),
            experienceModel.deleteOne({ userId })
        ]);

        res.status(200).json({ 
            success: true,
            message: 'Account and all associated data deleted successfully' 
          });
    } catch (error) {
        console.error("Delete account error:", error);
        
        const status = error.message.includes('Unauthorized') ? 403 : 500;
        res.status(status).json({
          success: false,
          message: error.message || 'Failed to delete account'
        });
    }
}

//export controllers
module.exports = {signupUser, loginUser, updateUser, deleteUser}
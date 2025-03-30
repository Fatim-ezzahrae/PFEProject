// require user model
const userModel = require('../models/user');

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

//export controllers
module.exports = {signupUser, loginUser}
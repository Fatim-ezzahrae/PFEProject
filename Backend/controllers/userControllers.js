// require user model
const userModel = require('../models/user');

// require token
const jwt = require('jsonwebtoken');

const createToken = (_id) => {
    return jwt.sign({ _id }, process.env.SECRET, { expiresIn: '3d' });
}

const signupUser = async (req, res) => {
    const { email, password } = req.body;
    try{
        const user = await userModel.signup(email, password);

        const token = createToken(user._id);

        res.status(201).json({email, token});
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
}

const loginUser = async (req, res) => {
    const { email, password } = req.body;

    try {
        const user = await userModel.login(email, password);

        const token = createToken(user._id);

        res.status(201).json({email, token});
         
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
}

//export controllers
module.exports = {signupUser, loginUser}
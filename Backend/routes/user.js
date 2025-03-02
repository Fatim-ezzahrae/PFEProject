// require express
const express = require('express');

const {
    signupUser,
    loginUser
} = require('../controllers/userControllers');

const router = express.Router();

//route for login
router.post('/login', loginUser);

//route for signup
router.post('/signup', signupUser);


module.exports = router;
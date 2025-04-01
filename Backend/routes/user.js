// require express
const express = require('express');

const {
    signupUser,
    loginUser,
    updateUser,
    deleteUser
} = require('../controllers/userControllers');

const router = express.Router();

//route for login
router.post('/login', loginUser);

//route for signup
router.post('/signup', signupUser);

// update user
router.put('/:userId', updateUser);

// delete user
router.delete('/:userId', deleteUser);


module.exports = router;
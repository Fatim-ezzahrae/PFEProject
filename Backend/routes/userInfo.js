// require express
const express = require('express');

const { 
    hasFilledInfo,
    fillUserInfo,
    getUserInfo
 } = require('../controllers/userInfoControllers');

const router = express.Router();

// check if user has filled info
router.get("/:userId", hasFilledInfo);

// fill user info
router.post("/", fillUserInfo);

//get user info
router.get("/retreive/:userId", getUserInfo);




module.exports = router;
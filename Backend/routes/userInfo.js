// require express
const express = require('express');

const { 
    hasFilledInfo,
    fillUserInfo
 } = require('../controllers/userInfoControllers');

const router = express.Router();

router.get("/:userId", hasFilledInfo);
router.post("/", fillUserInfo);

module.exports = router;
const express = require('express');

const { 
    generatePDF 
} = require('../controllers/userResumeControllers');

const router = express.Router();

router.post("/generate-resume", generatePDF);

module.exports = router;
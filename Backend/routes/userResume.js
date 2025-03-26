const express = require('express');

const { 
    generatePreviewPDF 
} = require('../controllers/userResumeControllers');

const router = express.Router();

router.get("/generate-resume/:templateId/:userId", generatePreviewPDF);

module.exports = router;
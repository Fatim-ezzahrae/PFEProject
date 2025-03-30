const express = require('express');

const { 
    generatePreviewPDF,
    saveResume,
    exportResume
} = require('../controllers/userResumeControllers');

const router = express.Router();

// cacheMiddleware('1 hour'),
router.get("/generate-resume/:templateId/:userId", generatePreviewPDF);

router.post("/save-resume", saveResume);

router.get("/export-resume/:resumeId/:format", exportResume);

module.exports = router;

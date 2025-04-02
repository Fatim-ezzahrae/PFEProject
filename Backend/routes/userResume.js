const express = require('express');

const { 
    generatePreviewPDF,
    saveResume,
    exportResume,
    getUserResumes,
    getResumeImage
} = require('../controllers/userResumeControllers');

const router = express.Router();

// cacheMiddleware('1 hour'),
router.get("/generate-resume/:templateId/:userId", generatePreviewPDF);

router.post("/save-resume", saveResume);

router.get("/export-resume/:resumeId/:format", exportResume);

// Get all resumes for a user (with image URLs)
router.get('/users/:userId', getUserResumes);

// Get specific resume image (direct file access)
router.get('/users/:userId/:resumeId/image', getResumeImage);

module.exports = router;

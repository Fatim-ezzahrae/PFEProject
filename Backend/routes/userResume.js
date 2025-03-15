const express = require('express');
const { generatePDF } = require('../controllers/userResumeControllers');

const router = express.Router();

router.get('/generate/:templateId/:userId', generatePDF);

module.exports = router;
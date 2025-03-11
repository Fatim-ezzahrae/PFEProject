const express = require('express');
const { generatePDF } = require('../controllers/latexController');

const router = express.Router();

router.get('/generate/:templateId/:userId', generatePDF);

module.exports = router;
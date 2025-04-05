//require express
const express = require('express');
const multer = require('multer');

const {
    uploadTemplate,
    getStats
} = require('../controllers/adminControllers');

//create router
const router = express.Router();

// Configure Multer for memory storage (No file system usage)
const storage = multer.memoryStorage();
const upload = multer({ storage: storage });

//upload template
router.post('/upload', upload.single('pdfFile'), uploadTemplate);

//get stats
router.get('/stats', getStats);

//export router
module.exports = router;
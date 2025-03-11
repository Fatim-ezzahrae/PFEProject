const express = require('express');  //require express
const multer = require('multer');

const {
    uploadTemplate,
    getTemplates,
    getTemplate
} = require('../controllers/templateControllers');

const requireAuth = require('../middleware/requireAuth') // require auth on route below it

//create router
const router = express.Router();

// Configure Multer for memory storage (No file system usage)
const storage = multer.memoryStorage();
const upload = multer({ storage: storage });

// get all templates
router.get('/', getTemplates);

// get single template
router.get('/:id', getTemplate);

// require auth for all workout routes
//router.use(requireAuth)

//upload template
router.post('/upload', upload.single('pdfFile'), uploadTemplate);

//export router
module.exports = router;
const express = require('express');  //require express
const multer = require('multer');

const {
    getTemplates,
    getTemplate,
    getTemplateImage
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
router.get('/:id', getTemplateImage);

// require auth for all workout routes
//router.use(requireAuth)



//export router
module.exports = router;
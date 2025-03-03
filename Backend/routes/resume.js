//require express
const express = require('express');

const {
    getTemplates,
    getTemplate
} = require('../controllers/resumeControllers');

//create router
const router = express.Router();

// get all templates
router.get('/', getTemplates);

// get single template
router.get('/:id', getTemplate);


//export router
module.exports = router;
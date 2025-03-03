//require express
const express = require('express');

const {
    createTemplate
} = require('../controllers/adminControllers');

//create router
const router = express.Router();

//create template
router.post('/', createTemplate);

//export router
module.exports = router;
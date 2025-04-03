//require express
const express = require('express');

const {
    createTemplate,
    getStats
} = require('../controllers/adminControllers');

//create router
const router = express.Router();

//create template
router.post('/', createTemplate);

//get stats
router.get('/stats', getStats);

//export router
module.exports = router;
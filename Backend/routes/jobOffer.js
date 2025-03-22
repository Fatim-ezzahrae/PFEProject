const express = require('express');

const {
    createjobOffer,
    getjobOffers
} = require('../controllers/jobOfferControllers');

//create router
const router = express.Router();

// get all job offers
router.get('/', getjobOffers);


//create job offer
router.post('/', createjobOffer);

module.exports = router;
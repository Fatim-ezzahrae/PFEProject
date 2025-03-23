const express = require('express');

const {
    createjobOffer,
    getjobOffers, 
    getUserJobOffers
} = require('../controllers/jobOfferControllers');

//create router
const router = express.Router();

// get all job offers
router.get('/', getjobOffers);

// get user job offers
router.get('/:id', getUserJobOffers);

//create job offer
router.post('/', createjobOffer);

module.exports = router;
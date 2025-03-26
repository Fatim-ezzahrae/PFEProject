const express = require('express');

const {
    createjobOffer,
    getjobOffers, 
    getUserJobOffers,
    updatejobOffer, 
    deletejobOffer
} = require('../controllers/jobOfferControllers');

//create router
const router = express.Router();

// get all job offers
router.get('/', getjobOffers);

// get user job offers
router.get('/:id', getUserJobOffers);

//create job offer
router.post('/', createjobOffer);

// update job offer
router.put('/:id', updatejobOffer);

// delete job offer
router.delete('/:id', deletejobOffer);

module.exports = router;
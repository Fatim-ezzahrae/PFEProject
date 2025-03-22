const jobOfferModel = require('../models/jobOffer');
const userModel = require('../models/user');


// get all job offers
const getjobOffers = async (req, res) => {
    try{

        const jobOffers = await jobOfferModel.find();
        res.status(200).json(jobOffers);

    } catch(error){

        res.status(500).json({message: error.message});

    }
}


// create job offer
const createjobOffer = async (req, res) => {

    const {publisherId, jobTitle, companyName, location, description, applicationDeadline, contactInfo} = req.body;

    if(!publisherId){
        return res.status(400).json({message: 'Publisher ID is required'});
    }

    const isUser = await userModel.findById(publisherId);

    if(!isUser){    
        return res.status(400).json({message: 'User does not exist'});
    }

    if(!jobTitle || !companyName || !location || !description || !applicationDeadline || !contactInfo){
        return res.status(400).json({message: 'All fields are required'});
    }

    try{

        const jobOffer = await jobOfferModel.create({publisherId, jobTitle, companyName, location, description, applicationDeadline, contactInfo});
        res.status(201).json(jobOffer);

    } catch(error){
        res.status(500).json({message: error.message});
    }

}

module.exports = {createjobOffer, getjobOffers};
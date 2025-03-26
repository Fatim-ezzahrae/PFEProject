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

// get user job offers
const getUserJobOffers = async (req, res) => {
    try{

        const jobOffers = await jobOfferModel.find({publisherId: req.params.id});

        if(!jobOffers || jobOffers.length === 0){
            return res.status(404).json({message: 'User has no job offers found'});
        }

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

// update job offer
const updatejobOffer = async (req, res) => {
    const { id } = req.params;
    const { jobTitle, companyName, location, description, applicationDeadline, contactInfo } = req.body;

    if (!id) {
        return res.status(400).json({ message: 'Job Offer ID is required' });
    }

    try {
        const updatedJobOffer = await jobOfferModel.findByIdAndUpdate(id, {
            jobTitle,
            companyName,
            location,
            description,
            applicationDeadline,
            contactInfo
        }, { new: true });

        if (!updatedJobOffer) {
            return res.status(404).json({ message: 'Job Offer not found' });
        }

        res.status(200).json(updatedJobOffer);
    } catch (error) {
        res.status(500).json({ message: error.message });
    }

}

// delete job offer
const deletejobOffer = async (req, res) => {
    const { id } = req.params;

    if (!id) {
        return res.status(400).json({ message: 'Job Offer ID is required' });
    }

    try {
        const deletedJobOffer = await jobOfferModel.findByIdAndDelete(id);

        if (!deletedJobOffer) {
            return res.status(404).json({ message: 'Job Offer not found' });
        }

        res.status(200).json({ message: 'Job Offer deleted successfully' });
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
}


module.exports = {createjobOffer, getjobOffers, getUserJobOffers, updatejobOffer, deletejobOffer};